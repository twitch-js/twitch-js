import camelcaseKeys from 'camelcase-keys'
import { Response } from 'node-fetch'

import ErrorFactory from './Errors'

const parser = async <T = any>(response: Response): Promise<T> => {
  const json = await response.json()

  if (!response.ok) {
    throw ErrorFactory(response, json)
  }

  return camelcaseKeys(json, { deep: true }) as unknown as T
}

export default parser
