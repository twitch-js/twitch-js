import EventEmitter from 'eventemitter3'

export const resolveAfter = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const resolveOnEvent = <T>(
  emitter: EventEmitter,
  eventName: string,
): Promise<T> => new Promise(resolve => emitter.once(eventName, resolve))

export const resolveInSequence = (tasks: (() => Promise<any>)[]) =>
  tasks.reduce((p, task) => p.then(task), Promise.resolve())

export const rejectAfter = (ms: number, error: Error): Promise<never> =>
  new Promise((r, reject) => setTimeout(reject, ms, error.message))
