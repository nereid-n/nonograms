export enum AUTH {
  LOGIN = 'LOGIN',
  CHECK_TOKEN = 'CHECK_TOKEN'
}

export interface auth {
  type: AUTH
}

export interface checkTokenType {
  type: AUTH
}

export interface loginData {
  email: string,
  password: string,
  remember_me: boolean
}

export interface authState {
  auth: boolean
}

export type AuthType = auth;