import BetterQueue from 'better-queue'
import MemoryStore from 'better-queue-memory'
import setImmediate from 'core-js-pure/stable/set-immediate'

import * as constants from './constants'

type Options = {
  maxLength?: number
  tickInterval?: number
  onTaskQueued?: (taskId: string, task: any) => void
  onTaskFinished?: (taskId: string, result: any) => void
  onQueueDrained?: () => void
}

class Queue {
  private _q: BetterQueue

  private _maxLength: number
  private _length = 0

  private _timestamp: number = Date.now()
  private _tickInterval: number

  private _callbacks: Pick<
    Options,
    'onTaskQueued' | 'onTaskFinished' | 'onQueueDrained'
  > = {}

  constructor(options?: Options) {
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
        // @ts-ignore this is an option.
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
      .on(
        // @ts-ignore this is an event.
        'accepted',
        this._handleTaskQueued,
      )
      .on('finish', this._handleTaskFinished)
  }

  private _handlePriority: BetterQueue.QueueOptions<any, any>['priority'] = (
    { priority = 1 },
    cb,
  ) => cb(null, priority)

  private _handlePrecondition: BetterQueue.QueueOptions<
    any,
    any
  >['precondition'] = cb => {
    const now = Date.now()
    if (now - this._timestamp > this._tickInterval) {
      this._timestamp = now
      this._length = Math.max(0, this._length - this._maxLength)
    }

    cb(null, this._length < this._maxLength)
  }

  private _handleTaskQueued: Options['onTaskQueued'] = (taskId, task) => {
    this._callbacks.onTaskQueued(taskId, task)
  }

  private _handleTaskFinished: Options['onTaskFinished'] = (taskId, result) => {
    const now = Date.now()
    if (now - this._timestamp > this._tickInterval) {
      this._timestamp = Date.now()
    }

    this._length = this._length + 1

    this._callbacks.onTaskFinished(taskId, result)
  }

  private _handleQueueDrained = () => {
    this._callbacks.onQueueDrained()
  }
}

export default Queue
