import root from './__fixtures__/root'

const fetch = jest.fn().mockImplementation((url /*, options, qsOptions */) => {
  switch (url) {
    default:
      return Promise.resolve(root)
  }
})

export default fetch
