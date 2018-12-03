import BetterQueue from 'better-queue'
import MemoryStore from 'better-queue-memory'
import setImmediate from 'core-js/library/fn/set-immediate'

import * as constants from './constants'

class Queue {
  _q

  _maxLength
  _length = 0

  _timestamp = new Date()
  _tickInterval

  _callbacks = {}

  constructor(options = {}) {
    const {
      maxLength = 20,
      tickInterval = 30000,
      onTaskQueued = () => {},
      onTaskFinished = () => {},
      onQueueDrained = () => {},
    } = options

    this._maxLength = maxLength
    this._tickInterval = tickInterval

    this._callbacks = { onTaskQueued, onTaskFinished, onQueueDrained }

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

  push = ({ fn, priority }) => {
    return this._q
      .push({ fn, priority })
      .on('accepted', this._handleTaskQueued)
      .on('finish', this._handleTaskFinished)
  }

  _handlePriority = ({ priority = 1 }, cb) => cb(null, priority)

  _handlePrecondition = cb => {
    const now = new Date()
    if (now - this._timestamp > this._tickInterval) {
      this._timestamp = now
      this._length = Math.max(0, this._length - this._maxLength)
    }

    cb(null, this._length < this._maxLength)
  }

  _handleTaskQueued = (taskId, task) => {
    this._callbacks.onTaskQueued(taskId, task)
  }

  _handleTaskFinished = (taskId, result) => {
    const now = new Date()
    if (now - this._timestamp > this._tickInterval) {
      this._timestamp = new Date()
    }

    this._length = this._length + 1

    this._callbacks.onTaskFinished(taskId, result)
  }

  _handleQueueDrained = () => {
    this._callbacks.onQueueDrained()
  }
}

export default Queue
