import BetterQueue from 'better-queue'
import MemoryStore from 'better-queue-memory'
import setImmediate from 'core-js/library/fn/set-immediate'

import * as constants from './constants'

class Queue extends BetterQueue {
  rateLimiter = 0
  rateLimiterIntervalId

  constructor() {
    // Instantiate Better Queue.
    super(
      ({ fn }, cb) => {
        fn()
        cb(this.rateLimiter)
      },
      {
        store: new MemoryStore(),
        priority: ({ priority = 1 }, cb) => cb(null, priority),
        setImmediate,
        // Process queue only when rate-limiter is less than 1.
        precondition: cb => cb(null, this.rateLimiter < 1),
        preconditionRetryTimeout: constants.QUEUE_TICK_RATE,
      },
    )

    // Start rate-limiter burn down.
    this.rateLimiterIntervalId = setInterval(
      this.burnDownRateLimiter.bind(this),
      constants.QUEUE_TICK_RATE,
    )
  }

  incrementRateLimiter(weight) {
    return () => {
      this.rateLimiter = this.rateLimiter + 1 / weight
    }
  }

  burnDownRateLimiter() {
    this.rateLimiter = Math.max(this.rateLimiter - 1, 0)
  }

  push({ fn, priority, weight }) {
    return super
      .push({ fn, priority })
      .on('accepted', this.incrementRateLimiter(weight))
  }
}

export default Queue
