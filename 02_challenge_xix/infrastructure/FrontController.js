'use strict'

class FrontController {
  _routeList = {}

  /**
   * @type {ILogger}
   * @private
   */
  _logger

  /**
   * @type {HTTPErrorHandler}
   * @private
   */
  _httpErrorHandler

  constructor(logger, httpErrorHandler) {
    this._logger = logger
    this._httpErrorHandler = httpErrorHandler
  }


  /**
   * @param {TRouteDeclaration[]} routeList
   */
  registerRoutes(routeList) {
    routeList.forEach(r => {
      const {method, path, controller, action} = r
      this._routeList[this._callExpression(method, path)] = async (req, res) => {
        try {
          const resolvedController = app.get(controller)
          if ('function' !== typeof resolvedController[action]) {
            throw new Error(`Wrong action ${controller}::${action}`)
          }

          try {
            await Promise.resolve(resolvedController[action](req, res))
          } catch (e) {
            this._httpErrorHandler.handle(e, req, req)
          }

        } catch (e) {
          this._logger.error('Cannot handle HTTP call: ' + e.message, e)
        }
      }
    })
  }

  async handle(req, res, x, y) {
    console.log(req.url)
  }

  _callExpression(method, path) {
    return `${method}: ${path}`
  }
}

module.exports = FrontController
