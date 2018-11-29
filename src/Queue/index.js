import BetterQueue from 'better-queue'
import MemoryStore from 'better-queue-memory'
import setImmediate from 'core-js/library/fn/set-immediate'
// import { get } from 'lodash'

import * as constants from './constants'

const EMPTY_INTERVAL_ID = -1

class Queue {
  _q

  _maxLength = 20
  _length = 0

  _tickInterval = 30000
  _tickIntervalId = EMPTY_INTERVAL_ID

  constructor({ maxLength = 20, tickInterval = 30000 } = {}) {
    this._tickInterval = tickInterval
    this._maxLength = maxLength

    this._q = new BetterQueue(
      ({ fn }, cb) => {
        fn()
        cb()
      },
      {
        store: new MemoryStore(),
        setImmediate,
        priority: this._handlePriority,
        precondition: this._handlePrecondition,
        preconditionRetryTimeout: constants.QUEUE_TICK_RATE,
      },
    )

    this._q.on('drain', this._handleQueueDrained)
  }

  push({ fn, priority }) {
    return this._q.push({ fn, priority }).on('finish', this._handleTaskFinish)
  }

  _handlePriority = ({ priority = 1 }, cb) => cb(null, priority)

  _handlePrecondition = cb => {
    cb(null, this._length < this._maxLength)
  }

  _handleTaskFinish = () => {
    if (this._tickIntervalId === EMPTY_INTERVAL_ID) {
      this._tickIntervalId = setInterval(this._tick, this._tickInterval)
    }

    this._length = this._length + 1
  }

  _tick = () => {
    this._length = Math.max(0, this._length - this._maxLength)
  }

  _handleQueueDrained = () => {
    clearInterval(this._tickIntervalId)
    this._tickIntervalId = EMPTY_INTERVAL_ID
  }
}

export default Queue
