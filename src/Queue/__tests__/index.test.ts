import Queue from '../index'

describe('Chat/Queue', () => {
  test('should call fn on push', done => {
    const queue = new Queue()
    queue.push({ fn: done })
  })

  test('should call multiple fn on push', async () => {
    expect.assertions(2)

    const fnOne = jest.fn()
    const fnTwo = jest.fn()

    const queue = new Queue()

    await Promise.all([
      queue._q.onEmpty,
      queue.push({ fn: fnOne }),
      queue.push({ fn: fnTwo }),
    ])

    expect(fnOne).toHaveBeenCalledTimes(1)
    expect(fnTwo).toHaveBeenCalledTimes(1)
  })

  describe('rate-limiting', () => {
    const NativeDate = Date
    let d = new Date()

    beforeAll(() => {
      Object.assign(Date, NativeDate)
      global.Date = jest.fn(() => new NativeDate(d.toISOString()))
      global.Date.now = () => d.getMilliseconds()
    })

    afterAll(() => {
      global.Date = NativeDate
    })

    test('should limit rate of fn calls', async () => {
      const maxLength = 3
      const tickInterval = 2000
      const totalCalls = 10

      let numberOfTasksFinished = 0

      const fn = () => {
        numberOfTasksFinished++

        if (numberOfTasksFinished % maxLength === 0) {
          d.setMilliseconds(d.getMilliseconds() + tickInterval + 1)
        }
      }

      const queue = new Queue({
        maxLength,
        tickInterval,
      })

      let calls = []

      for (let i = 1; i <= totalCalls; i++) {
        calls.push(queue.push({ fn }))
      }

      await Promise.all([...calls, queue._q.onEmpty])

      expect(numberOfTasksFinished).toEqual(totalCalls)
    })
  })
})
