'use strict'

const Bus = require('./Bus')
const FileSystem = require('./FileSystem')

class App {
  /**
   * @type {ILogger}
   * @private
   */
  _logger

  /**
   * @type {Bus}
   * @private
   */
  _bus

  /**
   * @type {Container}
   * @private
   */
  _container

  /**
   * @param {ILogger} logger
   * @param {Bus} bus
   * @param {Container} container
   */
  constructor(logger, bus, container) {
    this._logger = logger
    this._bus = bus
    this._container = container

    bus.on(Bus.EVENTS.INIT_RUN, () => {
      logger.log('Init...')
    })
    bus.on(Bus.EVENTS.INIT_DONE, () => {
      logger.log('Init settled.')
    })
    bus.on(Bus.EVENTS.BOOT_RUN, () => {
      logger.log('Boot...')
    })
    bus.on(Bus.EVENTS.BOOT_DONE, () => {
      logger.log('Booted')
    })
    bus.on(Bus.EVENTS.START_RUN, () => {
      logger.log('Starting...')
    })
    bus.on(Bus.EVENTS.START_DONE, () => {
      logger.log('Started!')
    })
  }

  init() {
    ;(async () => {
      this._bus.emit(Bus.EVENTS.INIT_RUN)

      const container = this._container

      // App Facade
      /** @type {IApp} */
      global.app = {
        get(key) {
          return container.get(key)
        }
      }

      // Container: infrastructure registration
      container.register('httpErrorHandler', require('./HTTPErrorHandler'))
        .singleton()

      container.register('frontController', require('./FrontController'))
        .dependencies('logger', 'httpErrorHandler')
        .singleton()

      // DI: app registration
      try {
        const fileList = await FileSystem.listDirFilesRecursively(APP_PATH)
        await Promise.all(fileList.map(async filePath => {
          const exp = new RegExp(`^${APP_PATH.replace(/\//g, '\\/')}\/(?<reference>[^.]+)\.js$`)
          const matchList = filePath.match(exp)
          if (!matchList) {
            return
          }

          const dependencyList = []
          const content = await FileSystem.readFile(filePath)
          const depExp = /@Inject\s*\(\s*(?<dep>[a-zA-Z][a-zA-Z0-9_.]+)\s*\).*$/mg
          content.replace(depExp, (_, dep) => {
            dependencyList.push(dep.trim())
          })

          const key = 'app.' + matchList.groups.reference.replace(/\//g, '.')

          container.register(key, require(filePath))
            .dependencies(...dependencyList)
        }))
      } catch (e) {
        this._logger.error('DI failed: ' + e.message, e)
      }

      this._bus.emit(Bus.EVENTS.INIT_DONE)
    })()
    return this
  }

  boot() {
    this._bus.on(Bus.EVENTS.INIT_DONE, async () => {
      this._bus.emit(Bus.EVENTS.BOOT_RUN)

      // Register HTTP routes

      /** @type {FrontController} */
      const frontController = this._container.get('frontController')

      frontController.registerRoutes(require('../app/http/routes'))

      // TODO DB pool

      this._bus.emit(Bus.EVENTS.BOOT_DONE)
    })

    return this
  }

  start() {
    this._bus.on(Bus.EVENTS.BOOT_DONE, async () => {
      this._bus.emit(Bus.EVENTS.START_RUN)

      // Run HTTP server
      const http = require('http')

      /** @type {FrontController} */
      const frontController = this._container.get('frontController')

      const server = http.createServer(async (...args) => {
        return frontController.handle(...args)
      })

      server.on('error', e => {
        this._logger.error(e.message)
      })

      server.listen(Number(process.env.PORT), () => {
        this._logger.info(`HTTP is listening on ${process.env.PORT}...`)
      })

      this._bus.emit(Bus.EVENTS.START_DONE)
    })

    return this
  }
}

module.exports = App
