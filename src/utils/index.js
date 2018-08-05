const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const delayReject = (ms, message) =>
  new Promise((resolve, reject) => setTimeout(reject, ms, message))

const onceResolve = (emitter, eventName) =>
  new Promise(resolve => emitter.once(eventName, resolve))

export { delay, delayReject, onceResolve }
