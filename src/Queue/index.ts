import { default as PQueue } from 'p-queue'

import * as constants from './constants'

type Options = {
  maxLength?: number
  tickInterval?: number
  onTaskQueued?: (taskId: string, task: any) => void
  onTaskFinished?: (taskId: string, result: any) => void
  onQueueDrained?: () => void
}

class Queue {
  private _q: PQueue

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

    this._q = new PQueue({ concurrency: 1 })
  }

  push = ({ fn, priority }) => {
    return this._q.add(fn, { priority })
  }
}

export default Queue
