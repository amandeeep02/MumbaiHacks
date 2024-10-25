/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorResponse, IUser } from '@/types/interface'
import { postRequest } from '@/utility/generalServices'
import { AxiosResponse } from 'axios'

interface CreateAccountResponse {
  // jwtToken: string
  status: number
  message: string
  // user: any
}

export const createAccount = async (
  data: IUser
): Promise<CreateAccountResponse | IErrorResponse> => {
  try {
    const response: AxiosResponse<CreateAccountResponse> = await postRequest(
      '/auth/signup',
      {
        ...data,
      }
    )
    if (response.status !== 200) {
      throw new Error(
        response.data && 'error' in response.data
          ? (response?.data?.error as string)
          : 'Failed to create account'
      )
    }
    return {
      // jwtToken: response.data.jwtToken,
      status: response.status,
      message: response.data.message,
      // user: response.data.user,
    }
  } catch (error: any) {
    return {
      message: error.message || 'Error creating account',
      status: error.response?.status || 500,
    }
  }
}
