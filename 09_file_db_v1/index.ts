import { table } from 'console';
import * as fs from 'fs';
import { type } from 'os';
import * as path from 'path';

// The project is file based database
// Data is stored in binary format
// The data types are: int, float, string with length, all the types support null
// Each table with all related data is stored in a separate file
// Each table has a separate file for the index
// The index is a B+ tree

// Define interfaces for the database
// Interface for the db object
export interface IDB {
  use(dbDataDirPath: string): this;

  createTable(tableName: string, tableSchema: ITableSchema, indexDict?: IIndexSchema): Promise<ITable>;
  dropTable(tableName: string): Promise<void>;
  getTable(tableName: string): Promise<ITable>;
  getTableNameList(): Promise<string[]>;
}

export interface ITableSchema {
  [columnName: string]: TColumnSchema;
}

export enum EColumnType {
  INT,
  FLOAT,
  STRING,
}

export type TColumnSchema = {
  type: Exclude<EColumnType, EColumnType.STRING>;
  length?: number;
  nullable?: boolean;
  index?: boolean;
  unique?: boolean;
} | {
  type: EColumnType.STRING;
  length: number;
  nullable?: boolean;
  index?: boolean;
  unique?: boolean;
};

export interface IIndexSchema {
  index?: string[][]; // list of combined columns
  unique?: string[][]; // list of combined columns
}

// Interface for the table object
export interface ITable {
  insert(data: TRowData): Promise<void>;
  select(where?: TWhere): Promise<TRowData[]>;
  update(data: TRowData, where?: TWhere): Promise<void>;
  delete(where?: TWhere): Promise<void>;
  getIndexes(): Promise<IIndex[]>;
}

export type TRowData = {
  [columnName: string]: TColumnValue;
};

export type TColumnValue = number | string | null | TColumnCondition;

export type TWhere = {
  '$and'?: TWhere[],
  '$or'?: TWhere[],
} | {
  [columnName: string]: TColumnValue | TColumnValue[] | TWhere,
};

export type TColumnCondition = {
  '$eq'?: TColumnValue,
  '$ne'?: TColumnValue,
  '$gt'?: TColumnValue,
  '$lt'?: TColumnValue,
  '$gte'?: TColumnValue,
  '$lte'?: TColumnValue,
  '$in'?: TColumnValue[],
  '$nin'?: TColumnValue[],
  '$like'?: string,
  '$nlike'?: string,
};

export interface IIndex {
  isUnique: boolean;
  columnList: string[];
  save(): Promise<this>;
  load(): Promise<this>;
  delete(): Promise<void>;
}


export type TIndexBtree = {
  [key: string]: TIndexBtree | TIndexBtreeLeaf;
};

export type TIndexBtreeLeaf = TRowData[];

export type TIndexDataKey = {
  columnList: string[],
  isUnique: boolean,
};

export type TIndexData = Map<TIndexDataKey, TIndexBtree>;

export type TChange = {
  [columnName: string]:
  // update
  {
    oldValue: TColumnValue,
    newValue: TColumnValue,
    deleted: undefined,
  } |
  // delete
  {
    oldValue: TColumnValue,
    newValue: undefined,
    deleted: true,
  } |
  // insert
  {
    oldValue: undefined,
    newValue: TRowData,
    deleted: undefined,
  }
};

export type TChangeList = TChange[];


// Define the database class
export class DB implements IDB {
  private dbDataDirPath: string;
  protected loadedTableMap: Map<string, ITable> = new Map();
  protected listedTableNames: string[] = [];

  constructor(dbDataDirPath: string) {
    this.dbDataDirPath = dbDataDirPath;
  }

  public use(dbDataDirPath: string): this {
    // if the dbDataDirPath is new, clear the loadedTableMap and listedTableNames
    if (this.dbDataDirPath !== dbDataDirPath) {
      this.loadedTableMap.clear();
      this.listedTableNames = [];
    }

    this.dbDataDirPath = dbDataDirPath;
    return this;
  }

  public async createTable(tableName: string, tableSchema: ITableSchema, indexDict?: IIndexSchema): Promise<ITable> {
    // reload names
    await this.getTableNameList();
    // if the table already exists, throw error
    if (this.listedTableNames.includes(tableName)) {
      throw new Error(`Table ${tableName} already exists`);
    }
    const table = new Table(this.dbDataDirPath, tableName, tableSchema, indexDict);
    await table.save();
    return table;
  }

  public async dropTable(dbDataDirPath, tableName: string): Promise<void> {
    const table = await this.getTable(tableName);
    await table.delete();
  }

  public async getTable(dbDataDirPath, tableName: string): Promise<ITable> {
    const table = new Table(tableName);
    await table.load();
    return table;
  }

  public async getTableNameList(): Promise<string[]> {
    const tableNameList = await fs.promises.readdir(this.dbDataDirPath);
    this.listedTableNames = tableNameList
      .filter((tableName) => tableName
        .endsWith('.table'))
      .map((tableName) => tableName.slice(0, -6));
    return this.listedTableNames;
  }
}

enum OPERATION_TYPE {
  READ, WRITE
}

// Define the table class
class Table implements ITable {
  private tableName: string;
  private tableSchema: ITableSchema;
  private tableFilePath: string;
  private indexFilePath: string;
  private tableData: TRowData[];
  private indexList: IIndex[];
  private indexData: TIndexData;
  private dumpInterval!: NodeJS.Timeout;

  constructor(
    dirPath: string,
    tableName: string,
    tableSchema?: ITableSchema,
    indexDict?: IIndexSchema
  ) {
    this.tableName = tableName;
    this.tableFilePath = path.join(dirPath, tableName + '.table');
    this.indexFilePath = path.join(dirPath, tableName + '.index');
    this.tableSchema = tableSchema || {};
    this.tableData = [];
    this.indexList = [];
    this.indexData = new Map();
  }

  public async save(): Promise<void> {
    // if the table file exists, throw error
    try {
      await fs.promises.access(this.tableFilePath)
      throw new Error(`Table ${this.tableName} already exists`);
    } catch (err) {
      // if the table file does not exist, skip
    }
    // if the index file exists, throw error
    if (this.indexList) {
      try {
        await fs.promises.access(this.indexFilePath)
        throw new Error(`Index ${this.tableName} already exists`);
      } catch (err) {
        // if the index file does not exist, skip
      }
    }
    // save the table file
    const tableData = BinaryData.encodeTable(this.tableData, this.tableSchema!);
    await fs.promises.writeFile(this.tableFilePath, tableData);
    // save the index file if indexDict exists
    if (this.indexList) {
      const indexData = BinaryData.encodeIndex(this.indexList, this.indexData, this.tableSchema!);
      await fs.promises.writeFile(this.indexFilePath, indexData);
    }
  }

  public async load(): Promise<void> {
    const tableFromFile = await fs.promises.readFile(this.tableFilePath);
    const parsedTable = BinaryData.parseTable(tableFromFile);
    this.tableData = parsedTable.tableData;
    this.tableSchema = parsedTable.schema;
    // if the index file exists, load the index
    try {
      await fs.promises.access(this.indexFilePath)
      const indexFromFile = await fs.promises.readFile(this.indexFilePath);
      const parsedIndex = BinaryData.parseIndex(indexFromFile, parsedTable.schema);
      this.indexList = parsedIndex.indexList;
      this.indexData = parsedIndex.indexData;
    } catch (err) {
      // if the index file does not exist, skip
    }

    // Once the table is loaded, we need to dump the table to file every 5 minutes
    this.dumpInterval = setInterval(() => {
      this.dumpTableToFile().catch((err) => {
        console.error(err);
      });
    }, 5 * 60 * 1000);
  }

  public async delete(): Promise<void> {
    // if the table file does not exist, throw error
    try {
      await fs.promises.access(this.tableFilePath)
    } catch (err) {
      throw new Error(`Table ${this.tableName} does not exist`);
    }
    // if the index file exists, delete the index file
    try {
      await fs.promises.access(this.indexFilePath)
      await fs.promises.unlink(this.indexFilePath);
    } catch (err) {
      // if the index file does not exist, skip
    }
    // delete the table file
    await fs.promises.unlink(this.tableFilePath);
    // clear the table data and index list
    this.tableData = [];
    this.indexList = [];
    // clear the dump interval
    clearInterval(this.dumpInterval);
  }

  // CRUD operations
  public async insert(data: TRowData): Promise<void> {
    // validate the data
    this.validateData(data);
    // if the index list exists, validate the index data
    if (this.indexList) {
      this.validateIndexData(data);
    }

    //check if no unique index constraint is violated
    if (this.violateUniqueIndex(data)) {
      throw new Error(`Unique index constraint violated`);
    }

    // insert the data
    this.tableData.push(data);
    // after operation
    await this.afterOperation(
      OPERATION_TYPE.WRITE,
      [
        Object.fromEntries(
          Object
            .keys(data)
            .filter(columnName => this.indexList.some(i => i.columnList.includes(columnName)))
            .map(colName => {
              return [colName, {
                oldValue: undefined,
                newValue: data,
                deleted: undefined,
              }
              ]
            })
        )
      ]
    );

  }

  public async select(where?: TWhere): Promise<TRowData[]> {

  }

  public async update(data: TRowData, where?: TWhere): Promise<void> {

  }

  public async delete(where?: TWhere): Promise<void> {
    
  }
  // END CRUD operations

  protected async dumpTableToFile(): Promise<void> {
    const tableData = BinaryData.encodeTable(this.tableData, this.tableSchema!);
    await fs.promises.writeFile(this.tableFilePath, tableData);
  }

  // Each operation will trigger the dumpTableToFile and updateIndex if exists
  protected async afterOperation(opType: OPERATION_TYPE, changeList?: TChangeList): Promise<void> {
    await this.dumpTableToFile();
    // if we have index dict and the operation is write, update the index
    if (this.indexList && opType === OPERATION_TYPE.WRITE) {
      await this.updateIndex(changeList);
    }
  }

  protected async updateIndex(changeList?: TChangeList): Promise<void> {
    if (!changeList) { // never happens
      return;
    }

    // for each change, update the index data btree
    for (const change of changeList) {
      for (const columnName in change) {
        const columnChange = change[columnName];
        if (columnChange.deleted === true) {
          IndexUpdater.delete(this.indexData, this.indexList, columnName, columnChange.oldValue);
        } else {
          // if no old value, it is a new row, add to index
          if ('undefined' === typeof columnChange.oldValue) {
            IndexUpdater.add(this.indexData, this.indexList, columnName, columnChange.newValue);
          }
          // if old value exists, it is an update, delete old value and add new value
          else {
            IndexUpdater.update(this.indexData, this.indexList, columnName, columnChange.oldValue, columnChange.newValue);
          }
        }
      }
    }
  }

  // Validate the data
  protected validateData(data: TRowData): void {
    for (const columnName in this.tableSchema) {
      const columnSchema = this.tableSchema[columnName];
      const columnValue = data[columnName];
      if (columnSchema.type === EColumnType.INT) {
        if (typeof columnValue !== 'number') {
          throw new Error(`Column ${columnName} should be number`);
        }
      } else if (columnSchema.type === EColumnType.FLOAT) {
        if (typeof columnValue !== 'number') {
          throw new Error(`Column ${columnName} should be number`);
        }
      } else if (columnSchema.type === EColumnType.STRING) {
        if (typeof columnValue !== 'string') {
          throw new Error(`Column ${columnName} should be string`);
        }
        if (columnValue.length > columnSchema.length) {
          throw new Error(`Column ${columnName} should be less than ${columnSchema.length} characters`);
        }
      }
    }
  }

  // Validate the index data
  protected validateIndexData(data: TRowData): void {
    for (const index of this.indexList) {
      for (const columnName of index.columnList) {
        const columnValue = data[columnName];
        if (typeof columnValue === 'number') {
          // do nothing
        } else if (typeof columnValue === 'string') {
          // do nothing
        } else {
          throw new Error(`Column ${columnName} should be number or string`);
        }
      }
    }
  }

  // Check if the unique index constraint is violated
  protected violateUniqueIndex(data: TRowData): boolean {
    for (const index of this.indexList) {
      if (index.isUnique) {
        const key: TIndexDataKey = {
          columnList: index.columnList,
          isUnique: index.isUnique,
        };
        const indexBtree = this.indexData.get(key);
        if (indexBtree) {
          const leaf = IndexUpdater.findLeaf(indexBtree, data[index.columnList[0]]);
          if (leaf) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

// Index updater
class IndexUpdater {
  static delete(indexData: TIndexData, indexList: IIndex[], columnName: string, oldValue: TColumnValue): void {
    for (const index of indexList) {
      if (index.columnList.includes(columnName)) {
        const key: TIndexDataKey = {
          columnList: index.columnList,
          isUnique: index.isUnique,
        };
        const indexBtree = indexData.get(key);
        if (indexBtree) {
          this.deleteFromIndexBtreeAndBalance(indexBtree, columnName, oldValue);
        }
      }
    }
  }

  static add(indexData: TIndexData, indexList: IIndex[], columnName: string, newValue: TRowData): void {
    for (const index of indexList) {
      if (index.columnList.includes(columnName)) {
        const key: TIndexDataKey = {
          columnList: index.columnList,
          isUnique: index.isUnique,
        };
        const indexBtree = indexData.get(key);
        if (indexBtree) {
          this.addToIndexBtreeAndBalance(indexBtree, columnName, newValue);
        }
      }
    }
  }

  // Update the index data btree looking for the existing value for the column, update the row and balance the three
  static update(indexData: TIndexData, indexList: IIndex[], columnName: string, oldValue: TColumnValue, newValue: TColumnValue): void {
    for (const index of indexList) {
      if (index.columnList.includes(columnName)) {
        const key: TIndexDataKey = {
          columnList: index.columnList,
          isUnique: index.isUnique,
        };
        const indexBtree = indexData.get(key);
        if (indexBtree) {
          this.updateAndBalanceIndexBtree(indexBtree, columnName, oldValue, newValue);
        }
      }
    }
  }


  protected static deleteFromIndexBtreeAndBalance(indexBtree: TIndexBtree, columnName: string, oldValue: TColumnValue): void {
    const leaf = this.findLeaf(indexBtree, oldValue);
    if (leaf) {
      const index = leaf.findIndex((rowData) => this.getKeyFromRowData(columnName, rowData[columnName]) === key);
      if (index !== -1) {
        leaf.splice(index, 1);
        this.balanceIndexBtree(indexBtree);
      }
    }
  }

  protected static addToIndexBtreeAndBalance(indexBtree: TIndexBtree, columnName: string, newValue: TRowData): void {
    const key = this.getKeyFromRowData(columnName, newValue[columnName]);
    const leaf = this.findLeaf(indexBtree, newValue[columnName]);
    if (leaf) {
      leaf.push(newValue);
      this.balanceIndexBtree(indexBtree);
    }
  }

  protected static updateAndBalanceIndexBtree(indexBtree: TIndexBtree, columnName: string, oldValue: TColumnValue, newValue: TColumnValue): void {
    const leaf = this.findLeaf(indexBtree, oldValue);
    if (leaf) {
      const index = leaf.findIndex((rowData) => this.getKeyFromRowData(columnName, rowData[columnName]) === key);
      if (index !== -1) {
        leaf[index] = newValue as TRowData;
        this.balanceIndexBtree(indexBtree);
      }
    }
  }

  // null ?
  protected static getKeyFromRowData(columnName: string, rowData: TRowData): string {
    const columnValue = rowData[columnName];
    if (typeof columnValue === 'number') {
      return columnValue.toString();
    } else if (typeof columnValue === 'string') {
      return columnValue;
    }
    return '';
  }

  public static findLeaf(indexBtree: TIndexBtree, columnValue: TColumnValue): TIndexBtreeLeaf | undefined {
    if (typeof columnValue === 'number') {
      return this.findLeafNumber(indexBtree, columnValue);
    } else if (typeof columnValue === 'string') {
      return this.findLeafString(indexBtree, columnValue);
    }
    return undefined;
  }

  protected static findLeafNumber(indexBtree: TIndexBtree, columnValue: number): TIndexBtreeLeaf | undefined {
    let leaf: TIndexBtreeLeaf | undefined;
    for (const key in indexBtree) {
      const child = indexBtree[key];
      if (typeof child === 'number') {
        if (columnValue === child) {
          leaf = indexBtree[key];
        }
      } else {
        if (columnValue < Number(key)) {
          leaf = this.findLeafNumber(child, columnValue);
        }
      }
    }
    return leaf;
  }

  protected static findLeafString(indexBtree: TIndexBtree, columnValue: string): TIndexBtreeLeaf | undefined {
    let leaf: TIndexBtreeLeaf | undefined;
    for (const key in indexBtree) {
      const child = indexBtree[key];
      if (typeof child === 'string') {
        if (columnValue === child) {
          leaf = indexBtree[key];
        }
      } else {
        if (columnValue < key) {
          leaf = this.findLeafString(child, columnValue);
        }
      }
    }
    return leaf;
  }

  protected static balanceIndexBtree(indexBtree: TIndexBtree): void {
    const keys = Object.keys(indexBtree);
    if (keys.length > 2) {
      const middleIndex = Math.floor(keys.length / 2);
      const leftKeys = keys.slice(0, middleIndex);
      const rightKeys = keys.slice(middleIndex + 1);
      const leftBtree: TIndexBtree = {};
      const rightBtree: TIndexBtree = {};
      for (const key of leftKeys) {
        leftBtree[key] = indexBtree[key];
      }
      for (const key of rightKeys) {
        rightBtree[key] = indexBtree[key];
      }
      const parentKey = keys[middleIndex];
      indexBtree[parentKey] = leftBtree;
      indexBtree[rightKeys[0]] = rightBtree;
    }
  }
}

// Binary functions
class BinaryData {
  // Parse the table data from binary to JSON
  // In the binary data, the first 4 bytes is the number of rows in schema
  // Then 4 bytes is the number of data rows
  // Then the schema is stored
  // Then the data is stored
  static parseTable(data: Buffer): { tableData: TRowData[], schema: ITableSchema } {
    const rowCount = data.readUInt32BE(0);
    const schemaCount = data.readUInt32BE(4);
    const schema = this.parseSchema(data.slice(8, 8 + schemaCount));
    const tableData = this.parseData(data.slice(8 + schemaCount), schema, rowCount);
    return { tableData, schema };
  }

  // Encode the table data from JSON to binary
  // In the binary data, the first 4 bytes is the number of rows in schema
  // Then 4 bytes is the number of data rows
  // Then the schema is stored
  // Then the data is stored
  static encodeTable(tableData: TRowData[], tableSchema: ITableSchema): Buffer {
    const rowCount = tableData.length;
    const schemaCount = Object.keys(tableSchema).length;
    const schemaData = this.getSchemaData(tableSchema);
    const data = this.getData(tableData, tableSchema);
    const buffer = Buffer.alloc(8 + schemaCount + data.length);
    buffer.writeUInt32BE(rowCount, 0);
    buffer.writeUInt32BE(schemaCount, 4);
    buffer.write(schemaData.toString(), 8);
    buffer.write(data.toString(), 8 + schemaCount);
    return buffer;
  }

  // Parse the schema from binary to JSON
  protected static parseSchema(data: Buffer): ITableSchema {
    const schema: ITableSchema = {};
    let offset = 0;
    while (offset < data.length) {
      const columnNameLength = data[offset];
      offset += 1;
      const columnName = data.slice(offset, offset + columnNameLength).toString();
      offset += columnNameLength;
      const columnType = data[offset];
      offset += 1;
      const columnSchema: TColumnSchema = {
        type: columnType,
      };
      if (columnType === EColumnType.STRING) {
        const columnLength = (data as any).readUInt16BE(offset);
        offset += 2;
        columnSchema.length = columnLength;
      }
      schema[columnName] = columnSchema;
    }
    return schema;
  }

  // Parse the data from binary to JSON
  protected static parseData(data: Buffer, schema: ITableSchema, rowCount: number): TRowData[] {
    const tableData: TRowData[] = [];
    let offset = 0;
    for (let i = 0; i < rowCount; i++) {
      const rowData: TRowData = {};
      for (const columnName in schema) {
        const columnSchema = schema[columnName];
        if (columnSchema.type === EColumnType.INT) {
          const columnValue = (data as any).readInt32BE(offset);
          offset += 4;
          rowData[columnName] = (columnValue === 0) ? null : columnValue;
        } else if (columnSchema.type === EColumnType.FLOAT) {
          const columnValue = (data as any).readFloatBE(offset);
          offset += 4;
          rowData[columnName] = (columnValue === 0) ? null : columnValue;
        } else if (columnSchema.type === EColumnType.STRING) {
          const columnValueLength = (data as any).readUInt16BE(offset);
          offset += 2;
          const columnValue = data.slice(offset, offset + columnValueLength).toString();
          offset += columnValueLength;
          rowData[columnName] = Buffer.from(columnValue)[0] === 0 ? null : columnValue;
        }
      }
      tableData.push(rowData);
    }
    return tableData;
  }

  // Encode the schema from JSON to binary
  protected static getSchemaData(schema: ITableSchema): Buffer {
    const data = [];
    for (const columnName in schema) {
      const columnSchema = schema[columnName];
      data.push(Buffer.byteLength(columnName));
      data.push(...Buffer.from(columnName));
      data.push(columnSchema.type);
      if (columnSchema.type === EColumnType.STRING) {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt16BE(columnSchema.length);
        data.push(...buffer);
      }
    }
    return Buffer.from(data);
  }

  // Encode the data from JSON to binary using getColumnValueData
  protected static getData(tableData: TRowData[], schema: ITableSchema): Buffer {
    const data = [];
    for (const rowData of tableData) {
      for (const columnName in schema) {
        const columnSchema = schema[columnName];
        const columnValue = rowData[columnName];
        data.push(...this.getColumnValueData(columnValue, columnSchema));
      }
    }
    return Buffer.from(data);
  }

  // Method that convert TColumnValue  to binary data including null value case
  protected static getColumnValueData(columnValue: TColumnValue, columnSchema: TColumnSchema): Buffer {
    if (columnSchema.type === EColumnType.INT) {
      const buffer = Buffer.alloc(4);
      buffer.writeInt32BE(columnValue === null ? 0 : columnValue as number);
      return buffer;
    } else if (columnSchema.type === EColumnType.FLOAT) {
      const buffer = Buffer.alloc(4);
      buffer.writeFloatBE(columnValue === null ? 0 : columnValue as number);
      return buffer;
    } else if (columnSchema.type === EColumnType.STRING) {
      const buffer = Buffer.alloc(2);
      buffer.writeUInt16BE(columnSchema.length);
      // if columnValue longer than columnSchema.length, cut it
      if (columnValue !== null && (columnValue as string).length > columnSchema.length) {
        columnValue = (columnValue as string).slice(0, columnSchema.length);
      }

      return Buffer.concat([
        buffer,
        Buffer.from(columnValue === null
          ? Array(columnSchema.length).fill(0)
          : (columnValue as string).split('').concat(Array(columnSchema.length - (columnValue as string).length).fill(0)))
      ]);
    }
    return Buffer.alloc(0);
  }

  // Index functions

  // Parse the index data from binary to JSON
  // In the binary data, the first 4 bytes is the number of indexes
  // Then 4 bytes is the number of data rows
  // Then the index list data is stored
  // Then the index data is stored
  static parseIndex(data: Buffer, tableSchema: ITableSchema): { indexData: TIndexData, indexList: IIndex[] } {
    const indexCount = data.readUInt32BE(0);
    const indexList: IIndex[] = [];
    let offset = 4;
    for (let i = 0; i < indexCount; i++) {
      const isUnique = data[offset] === 1;
      offset += 1;
      const columnCount = data[offset];
      offset += 1;
      const columnList: string[] = [];
      for (let j = 0; j < columnCount; j++) {
        const columnNameLength = data[offset];
        offset += 1;
        const columnName = data.slice(offset, offset + columnNameLength).toString();
        offset += columnNameLength;
        columnList.push(columnName);
      }
      const index: IIndex = new Index(columnList, isUnique);
      indexList.push(index);
    }
    const indexData = this.parseIndexData(data.slice(offset), indexList, tableSchema);
    return { indexData, indexList };
  }

  // Encode the index data from JSON to binary
  // In the binary data, the first 4 bytes is the number of indexes in list
  // Then 4 bytes is the number of data rows
  // Then the index data is stored
  // Then the index list data is stored
  static encodeIndex(indexList: IIndex[], indexData: TIndexData, tableSchema: ITableSchema): Buffer {
    const indexCount = indexList.length;
    const indexListData = this.getIndexListData(indexList);
    const indexDataData = this.getIndexDataData(indexData, tableSchema);
    const buffer = Buffer.alloc(4 + indexListData.length + indexDataData.length);
    buffer.writeUInt32BE(indexCount, 0);
    buffer.write(indexListData.toString(), 4);
    buffer.write(indexDataData.toString(), 4 + indexListData.length);
    return buffer;
  }

  // Parse the index data from binary to JSON
  protected static parseIndexData(data: Buffer, indexList: IIndex[], tableSchema: ITableSchema): TIndexData {
    const indexData: TIndexData = new Map();
    let offset = 0;
    for (const index of indexList) {
      const key: TIndexDataKey = {
        columnList: index.columnList,
        isUnique: index.isUnique,
      };
      const indexBtree = this.parseIndexBtree(data.slice(offset), tableSchema);
      indexData.set(key, indexBtree);
      offset += data.slice(offset).length;
    }
    return indexData;
  }

  // Encode the index data from JSON to binary
  protected static getIndexDataData(indexData: TIndexData, tableSchema: ITableSchema): Buffer {
    const data = [];
    for (const [key, indexBtree] of indexData) {
      const indexBtreeData = this.getIndexBtreeData(indexBtree, tableSchema);
      data.push(...indexBtreeData);
    }
    return Buffer.from(data);
  }

  // Parse the index btree from binary to JSON
  protected static parseIndexBtree(data: Buffer, tableSchema: ITableSchema): TIndexBtree {
    const indexBtree: TIndexBtree = {};
    let offset = 0;
    while (offset < data.length) {
      const keyLength = data[offset];
      offset += 1;
      const key = data.slice(offset, offset + keyLength).toString();
      offset += keyLength;
      const isLeaf = data[offset] === 1;
      offset += 1;
      if (isLeaf) {
        const rowCount = data.readUInt32BE(offset);
        offset += 4;
        const rowDataList: TRowData[] = [];
        for (let i = 0; i < rowCount; i++) {
          const rowData = this.parseRowData(data.slice(offset), tableSchema);
          offset += data.slice(offset).length;
          rowDataList.push(rowData);
        }
        indexBtree[key] = rowDataList;
      } else {
        const childBtree = this.parseIndexBtree(data.slice(offset), tableSchema);
        offset += data.slice(offset).length;
        indexBtree[key] = childBtree;
      }
    }
    return indexBtree;
  }

  // Encode the index btree from JSON to binary
  protected static getIndexBtreeData(indexBtree: TIndexBtree, tableSchema: ITableSchema): Buffer {
    const data = [];
    for (const key in indexBtree) {
      const child = indexBtree[key];
      data.push(Buffer.byteLength(key));
      data.push(...Buffer.from(key));
      if (Array.isArray(child)) {
        data.push(1);
        const buffer = Buffer.alloc(4);
        buffer.writeUInt32BE(child.length);
        data.push(...buffer);
        for (const rowData of child) {
          const rowDataData = this.getRowDataData(rowData, tableSchema);
          data.push(...rowDataData);
        }
      } else {
        data.push(0);
        const childData = this.getIndexBtreeData(child, tableSchema);
        data.push(...childData);
      }
    }
    return Buffer.from(data);
  }

  // Parse the row data from binary to JSON
  protected static parseRowData(data: Buffer, tableSchema: ITableSchema) {
    const rowData: TRowData = {};
    let offset = 0;
    for (const columnName in tableSchema) {
      const columnSchema = tableSchema[columnName];
      if (columnSchema.type === EColumnType.INT) {
        const columnValue = (data as any).readInt32BE(offset);
        offset += 4;
        rowData[columnName] = (columnValue === 0) ? null : columnValue;
      } else if (columnSchema.type === EColumnType.FLOAT) {
        const columnValue = (data as any).readFloatBE(offset);
        offset += 4;
        rowData[columnName] = (columnValue === 0) ? null : columnValue;
      } else if (columnSchema.type === EColumnType.STRING) {
        const columnValueLength = (data as any).readUInt16BE(offset);
        offset += 2;
        const columnValue = data.slice(offset, offset + columnValueLength).toString();
        offset += columnValueLength;
        rowData[columnName] = Buffer.from(columnValue)[0] === 0 ? null : columnValue;
      }
    }
    return rowData;
  }

  // Encode the row data from JSON to binary
  protected static getRowDataData(rowData: TRowData, tableSchema: ITableSchema): Buffer {
    const data = [];
    for (const columnName in tableSchema) {
      const columnSchema = tableSchema[columnName];
      const columnValue = rowData[columnName];
      data.push(...this.getColumnValueData(columnValue, columnSchema));
    }
    return Buffer.from(data);
  }

  // Parse the index list from binary to JSON
  protected static getIndexListData(indexList: IIndex[]): Buffer {
    const data = [];
    for (const index of indexList) {
      data.push(index.isUnique ? 1 : 0);
      const columnCount = index.columnList.length;
      data.push(columnCount);
      for (const columnName of index.columnList) {
        data.push(Buffer.byteLength(columnName));
        data.push(...Buffer.from(columnName));
      }
    }
    return Buffer.from(data);
  }

  // Encode the index list from JSON to binary
  protected static parseIndexListData(data: Buffer): IIndex[] {
    const indexList: IIndex[] = [];
    let offset = 0;
    while (offset < data.length) {
      const isUnique = data[offset] === 1;
      offset += 1;
      const columnCount = data[offset];
      offset += 1;
      const columnList: string[] = [];
      for (let i = 0; i < columnCount; i++) {
        const columnNameLength = data[offset];
        offset += 1;
        const columnName = data.slice(offset, offset + columnNameLength).toString();
        offset += columnNameLength;
        columnList.push(columnName);
      }
      const index: IIndex = new Index(columnList, isUnique);
      indexList.push(index);
    }
    return indexList;
  }

}

