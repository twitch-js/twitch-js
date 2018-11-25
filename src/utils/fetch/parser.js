import camelcaseKeys from 'camelcase-keys'

import ErrorFactory from './Errors'

const parser = response => {
  // console.log(response)
  return response.json().then(json => {
    // console.log(json)
    if (!response.ok) {
      throw ErrorFactory(response, json)
    }
    return camelcaseKeys(json, { deep: true })
  })
}

export default parser
