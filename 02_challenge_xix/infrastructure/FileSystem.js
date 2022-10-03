'use strict'

const fs = require('fs')
const path = require('path')

class FileSystem {
  /**
   * @param filePath
   * @return {Promise<string>}
   */
  static async readFile(filePath) {
    return await fs.promises.readFile(filePath, {encoding: 'utf-8'})
  }

  /**
   * @param {string} dirPath
   * @return {Promise<{other: string[], dirList: string[], fileList: string[]}>}
   */
  static async listDir(dirPath) {
    const stat = await fs.promises.stat(dirPath)
    if (!stat || !stat.isDirectory()) {
      throw new Error(`${dirPath} is not a dir`)
    }

    const list = await fs.promises.readdir(dirPath)
    const result = {
      dirList: [],
      fileList: [],
      other: [],
    }
    await Promise.all(list.map(async fileName => {
      const filePath = path.resolve(dirPath, fileName)

      const stat = await fs.promises.stat(filePath)
      const select = new Map()
      select.set(true, 'other')
      select.set(stat.isFile(), 'fileList')
      select.set(stat.isDirectory(), 'dirList')

      result[select.get(true)].push(filePath)
    }))
    return result
  }

  /**
   * @param {string} dirPath
   * @return {Promise<string[]>}
   */
  static async listDirFilesRecursively(dirPath) {
    const {fileList, dirList} = await FileSystem.listDir(dirPath)

    if (dirList.length > 0) {
      await Promise.all(dirList.map(async subDirPath => {
        const fileList = await FileSystem.listDirFilesRecursively(subDirPath)
        fileList.concat(...fileList)
      }))
    }

    return fileList
  }
}

module.exports = FileSystem
