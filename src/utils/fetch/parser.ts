import camelcaseKeys from 'camelcase-keys'
import { Response } from 'node-fetch'

import * as Errors from './Errors'

const parser = async <T = any>(response: Response): Promise<T> => {
  try {
    const json = await response.json()

    if (!response.ok) {
      const ErrorClass =
        response.status === 401 ? Errors.AuthenticationError : Errors.FetchError

      throw new ErrorClass(response, json)
    }

    return (camelcaseKeys(json, { deep: true }) as unknown) as T
  } catch (error) {
    throw new Errors.FetchError(response, error)
  }
}

export default parser
