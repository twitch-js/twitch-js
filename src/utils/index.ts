import EventEmitter from 'eventemitter3'

export const resolveAfter = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const resolveOnEvent = <T>(
  emitter: EventEmitter<any>,
  eventName: string,
  timeout = 0,
): Promise<T> =>
  new Promise((resolve, reject) => {
    emitter.once(eventName, resolve)

    if (timeout)
      setTimeout(() => {
        emitter.removeListener(eventName, resolve)
        reject(new Error('no event emitted, timed out'))
      }, timeout)
  })

export const resolveInSequence = (tasks: (() => Promise<any>)[]) =>
  tasks.reduce((p, task) => p.then(task), Promise.resolve())

export const rejectAfter = (ms: number, error: Error): Promise<never> =>
  new Promise((r, reject) => setTimeout(reject, ms, error))
