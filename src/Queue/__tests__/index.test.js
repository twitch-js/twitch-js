import Queue from '../'

const once = (emitter, event, timeout = 1000) =>
  Promise.race([
    new Promise((resolve, reject) => setTimeout(reject, timeout)),
    new Promise(resolve =>
      emitter.on(event, message => {
        resolve(message)
        emitter.off(event)
      }),
    ),
  ])

describe('Chat/Queue', () => {
  test('should call fn on push', done => {
    const queue = new Queue()
    queue.push({ fn: done })
  })

  test('should call multiple fn on push', done => {
    expect.assertions(2)

    const fnOne = jest.fn()
    const fnTwo = jest.fn()

    const queue = new Queue()

    queue._q.on('drain', () => {
      expect(fnOne).toHaveBeenCalledTimes(1)
      expect(fnTwo).toHaveBeenCalledTimes(1)
      done()
    })

    queue.push({ fn: fnOne })
    queue.push({ fn: fnTwo })
  })

  test.skip(
    'should queue fn calls',
    done => {
      jest.useFakeTimers()
      const times = []

      const fn = jest.fn(() => {
        times.push(new Date())
      })

      const queue = new Queue({ maxLength: 5, tickInterval: 2000 })

      queue._q.on('drain', () => {
        console.log(times)
        done()
      })

      for (let i = 1; i <= 10; i++) {
        queue.push({ fn })
      }

      jest.advanceTimersByTime(20001)
    },
    10000,
  )
})
