/** @ignore */
const delayReject = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(reject, ms, message))

/** @ignore */
const onceResolve = (emitter, eventName) =>
  new Promise(resolve => emitter.once(eventName, resolve))

export { delayReject, onceResolve }
