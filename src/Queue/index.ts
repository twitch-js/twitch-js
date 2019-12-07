import PQueue from 'p-queue'

type Options = ConstructorParameters<typeof PQueue>[0]

class Queue {
  private _q: PQueue

  constructor(options: Options = {}) {
    this._q = new PQueue({
      intervalCap: 20,
      interval: 30000,
      carryoverConcurrencyCount: true,
      concurrency: 1,
      ...options,
    })
  }

  push = ({ fn, priority = 100 }) => {
    return this._q.add<void>(fn, { priority })
  }
}

export default Queue
