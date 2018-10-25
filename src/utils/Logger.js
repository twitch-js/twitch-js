const { Signale } = require('signale')

import { EventEmitter } from 'eventemitter3'

import * as constants from '../Chat/constants'

class Logger extends EventEmitter {
  clientInit() {
    const log = new Signale({ interactive: true })
  }
}

export default Logger
