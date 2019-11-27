import camelcaseKeys from 'camelcase-keys'

import ErrorFactory from './Errors'

const parser = response => {
  return response.json().then(json => {
    if (!response.ok) {
      throw ErrorFactory(response, json)
    }
    return camelcaseKeys(json, { deep: true })
  })
}

export default parser
