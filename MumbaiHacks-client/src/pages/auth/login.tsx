/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Layout } from '@/components/Layout'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { loginAccount } from '@/api/auth/login'
import { getLocalStorage, setLocalStorage } from '@/utility/helper'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function Login() {
  const navigate = useNavigate()
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await loginAccount({
        emailId: formState.email,
        password: formState.password,
      })

      if (res.status === 200) {
        informParent(res)
      } else {
        if ('message' in res) toast.error(res.message)
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const informParent = (res: any) => {
    const jwtToken = res.jwtToken
    setLocalStorage('jwt', jwtToken)
    console.log(getLocalStorage('jwt'))
    navigate('/seller-dashboard')
  }

  return (
    <Layout>
      <div className="flex justify-center items-center h-screen">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>
              Enter your information to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Your password"
                  value={formState.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                onClick={(e) => handleSubmit(e)}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="underline">
                Register Now
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
