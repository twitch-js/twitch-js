import Queue from '../'

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

  test.only(
    'should queue fn calls',
    () => {
      const fn = jest.fn()

      const onTaskFinished = () => {
        // console.log(new Date())
      }

      const queue = new Queue({
        maxLength: 3,
        tickInterval: 2000,
        onTaskFinished,
      })

      for (let i = 1; i <= 10; i++) {
        queue.push({ fn })
      }
    },
    10000,
  )
})
