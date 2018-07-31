import ErrorFactory from './Errors'

const parser = response =>
  response.json().then(json => {
    if (!response.ok) {
      throw ErrorFactory(response, json)
    }
    return json
  })

export default parser
