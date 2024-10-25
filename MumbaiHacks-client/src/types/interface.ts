export interface IErrorResponse {
  message: string
  status: number
}

export interface IUser {
  _id?: string
  firstName: string
  lastName: string
  role?: string
  emailId: string
  password: string
  confirmPassword: string
  location: string
  phone: string
}
