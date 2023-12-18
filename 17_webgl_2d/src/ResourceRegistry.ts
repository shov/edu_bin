export class ResourceRegistry {
    protected resources: Map<any, any> = new Map();

    register<T>(key: any, resource: T): T {
        this.resources.set(key, resource);
        return resource;
    }

    get<T>(key: any): T {
        return this.resources.get(key);
    }

    has(key: any): boolean {
        return this.resources.has(key);
    }

    remove(key: any): void {
        this.resources.delete(key);
    }

    clear(): void {
        this.resources.clear();
    }

    get size(): number {
        return this.resources.size;
    }

    get keys(): IterableIterator<any> {
        return this.resources.keys();
    }

    get values(): IterableIterator<any> {
        return this.resources.values();
    }

    get entries(): IterableIterator<[any, any]> {
        return this.resources.entries();
    }

    [Symbol.iterator](): IterableIterator<[any, any]> {
        return this.resources.entries();
    }
}