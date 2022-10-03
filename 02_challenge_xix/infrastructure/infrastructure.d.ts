declare interface ILogger {
    log(message: string, values?: any[]): void

    info(message: string, values?: any[]): void

    warn(message: string, values?: any[]): void

    error(message: string, values?: any[]): void
}

declare interface IContainer {
    register(key: string, subject: any): IContainerRegistration

    get(key: string): any
}

declare interface IContainerRegistration {
    dependencies(...depList: string[]): IContainerRegistration

    singleton(): IContainerRegistration

    instance(): IContainerRegistration
}

declare type TContainerEntry = {
    singleton: boolean,
    subject: any,
    instance: any,
    dependencyList: string[]
}

declare var ROOT_PATH: string
declare var APP_PATH: string

declare interface IApp {
    get(key): any
}

declare var app: IApp

declare type TRouteDeclaration = {
    path: string,
    method: 'get' | 'post' | 'patch' | 'put' | 'delete',
    controller: 'string',
    action: 'string',
}
