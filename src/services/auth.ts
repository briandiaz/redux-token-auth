import axios from 'axios'
import { invertMapKeysAndValues } from './utility'
import {
  AuthHeaders,
  AuthResponse,
  DeviceStorage,
  SingleLayerStringMap,
} from '../types'

const authHeaderKeys: Array<string> = [
  'access-token',
  'token-type',
  'client',
  'expiry',
  'uid',
]

export const setAuthHeaders = (headers: AuthHeaders, authUrl: string): void => {
  if (authUrl === '/admin/api/v1/auth') {
    authHeaderKeys.forEach((key: string) => {
      axios.defaults.headers.common[`admin-${key}`] = headers[key]
    })
  } else {
    authHeaderKeys.forEach((key: string) => {
      axios.defaults.headers.common[key] = headers[key]
    })
  }
}

export const persistAuthHeadersInDeviceStorage = (Storage: DeviceStorage, headers: AuthHeaders,  authUrl: string): void => {
  if (authUrl === '/admin/api/v1/auth') {
    authHeaderKeys.forEach((key: string) => {
      Storage.setItem(`admin-${key}`, headers[key])
    })
  } else {
    authHeaderKeys.forEach((key: string) => {
      Storage.setItem(key, headers[key])
    })
  }
}

export const deleteAuthHeaders = (): void => {
  authHeaderKeys.forEach((key: string) => {
    delete axios.defaults.headers.common[key]
  })
}

export const deleteAuthHeadersFromDeviceStorage = async (Storage: DeviceStorage): Promise<void> => {
  authHeaderKeys.forEach((key: string) => {
    Storage.removeItem(key)
  })
}

export const getUserAttributesFromResponse = (
  userAttributes: SingleLayerStringMap,
  response: AuthResponse
): SingleLayerStringMap => {
  const invertedUserAttributes: SingleLayerStringMap = invertMapKeysAndValues(userAttributes)
  const userAttributesBackendKeys: string[] = Object.keys(invertedUserAttributes)
  const userAttributesToReturn: SingleLayerStringMap = {}
  Object.keys(response.data.data).forEach((key: string) => {
    if (userAttributesBackendKeys.indexOf(key) !== -1) {
      userAttributesToReturn[invertedUserAttributes[key]] = response.data.data[key]
    }
  })
  return userAttributesToReturn
}
