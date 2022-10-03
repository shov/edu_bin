'use strict'

const {EventEmitter} = require('events')

/**
 * @implements {NodeJS.EventEmitter}
 */
class Bus extends EventEmitter {
  static EVENTS = {
    INIT_RUN: 'init-run',
    INIT_DONE: 'init-done',
    BOOT_RUN: 'init-run',
    BOOT_DONE: 'boot-done',
    START_RUN: 'start-run',
    START_DONE: 'start-done',
  }
}

module.exports = Bus
