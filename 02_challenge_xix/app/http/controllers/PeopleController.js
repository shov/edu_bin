'use strict'

class PeopleController {

  '@Inject logger'

  constructor(logger) {
    /**
     * @type {ILogger}
     * @private
     */
    this._logger = logger
  }

  async listPeople(req, res) {
    this._logger.log('got request listPeople')
    res.status(200).send('')
  }
}

module.exports = PeopleController
