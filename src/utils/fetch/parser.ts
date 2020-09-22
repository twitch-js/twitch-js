import camelcaseKeys from 'camelcase-keys'

import * as Errors from './Errors'

const parser = async <T>(response: Response): Promise<T> => {
  const json = await response.json()

  if (!response.ok) {
    const ErrorClass =
      response.status === 401 ? Errors.AuthenticationError : Errors.FetchError

    throw new ErrorClass(response, json)
  }

  return (camelcaseKeys(json, { deep: true }) as unknown) as T
}

export default parser
