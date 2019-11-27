export const resolveAfter = ms =>
  new Promise(resolve => setTimeout(resolve, ms))

export const resolveOnEvent = (emitter, eventName) =>
  new Promise(resolve => emitter.once(eventName, resolve))

export const resolveInSequence = tasks =>
  tasks.reduce((p, task) => p.then(task), Promise.resolve())

export const rejectAfter = (ms, message) =>
  new Promise((r, reject) => setTimeout(reject, ms, message))
