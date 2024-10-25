/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorResponse } from '@/types/interface'
import { postRequest } from '@/utility/generalServices'
import { AxiosResponse } from 'axios'

interface LoginResponse {
  jwtToken: string
  status: number
  user: any
}

export const loginAccount = async (data: {
  emailId: string
  password: string
}): Promise<LoginResponse | IErrorResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await postRequest(
      '/auth/signin',
      {
        ...data,
      }
    )
    if (response.status !== 200) {
      throw new Error(
        'message' in response.data
          ? (response.data.message as string)
          : 'Failed to login'
      )
    }
    return {
      jwtToken: response.data.jwtToken,
      status: response.status,
      user: response.data.user,
    }
  } catch (error: any) {
    return {
      message: error.message || 'Error logging in',
      status: error.response?.status || 500,
    }
  }
}
