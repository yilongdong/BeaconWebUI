export type UserLoginType = {
  username: string
  password: string
  project: string
}

export type UserType = {
  username: string
  password: string
  project: string
  role: string
  roleId: string
  permissions: string | string[]
}
