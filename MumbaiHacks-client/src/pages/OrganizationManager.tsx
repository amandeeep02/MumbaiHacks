import React, { useState, useEffect } from 'react'
import axiosInstance from '@/utility/axiosInterceptor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Building2, Users, Plus, CheckCircle, Briefcase } from "lucide-react"
import { motion } from "framer-motion"
import { getRequest } from '@/utility/generalServices'
import { postRequest } from '@/utility/generalServices'

export default function OrganizationManager() {
  const [organization, setOrganization] = useState({ name: '', description: '', businessType: '' })
  const [employee, setEmployee] = useState({ name: '', email: '', organizationId: '' })
  const [createdOrganization, setCreatedOrganization] = useState(null)
  const [employees, setEmployees] = useState([])
  const [userOrganization, setUserOrganization] = useState(null)

  useEffect(() => {
    fetchUserOrganization()
  }, [])

  const fetchUserOrganization = async () => {
    try {
      const response = await postRequest('/organizations/user-organizations', {
                userId: localStorage.getItem('currentUserId') 
      })
      setUserOrganization(response.data)
    } catch (error) {
      console.error('Error fetching user organization:', error)
    }
  }

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganization({ ...organization, [e.target.name]: e.target.value })
  }

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value })
  }

  const createOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
//       const response = await axiosInstance.post('/organizations/add', {
//         ...organization,
//         userId: localStorage.getItem('currentUserId')
//       })

// const response = await postRequest

      setCreatedOrganization(response.data)
      fetchUserOrganization() 
    } catch (error) {
      console.error('Error creating organization:', error)
    }
  }

  const addEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.post('/organizations/addEmployee', {
        organizationId: employee.organizationId,
        employeeId: employee.email,
        userId: localStorage.getItem('currentUserId')
      })
      setEmployees(response.data.employees)
    } catch (error) {
      console.error('Error adding employee:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Organization Manager</h1>
      <Tabs defaultValue="your-organization" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="your-organization">
            <Briefcase className="mr-2 h-4 w-4" />
            Your Organization
          </TabsTrigger>
          <TabsTrigger value="create-organization">
            <Building2 className="mr-2 h-4 w-4" />
            Create Organization
          </TabsTrigger>
          <TabsTrigger value="employees">
            <Users className="mr-2 h-4 w-4" />
            Employees
          </TabsTrigger>
        </TabsList>
        <TabsContent value="your-organization">
          <Card>
            <CardHeader>
              <CardTitle>Your Organization</CardTitle>
              <CardDescription>Details of your current organization</CardDescription>
            </CardHeader>
            <CardContent>
              {userOrganization ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {userOrganization.name}</p>
                  <p><strong>Description:</strong> {userOrganization.description}</p>
                  <p><strong>Business Type:</strong> {userOrganization.businessType}</p>
                </div>
              ) : (
                <p>You don't have an organization yet. Create one in the "Create Organization" tab.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create-organization">
          <Card>
            <CardHeader>
              <CardTitle>Create Organization</CardTitle>
              <CardDescription>Add a new organization to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createOrganization} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input id="name" name="name" value={organization.name} onChange={handleOrganizationChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Organization Description</Label>
                  <Input id="description" name="description" value={organization.description} onChange={handleOrganizationChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input id="businessType" name="businessType" value={organization.businessType} onChange={handleOrganizationChange} required />
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Create Organization
                </Button>
              </form>
            </CardContent>
          </Card>
          {createdOrganization && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Created Organization</CardTitle>
                  <CardDescription>Details of the newly created organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {createdOrganization.name}</p>
                    <p><strong>Description:</strong> {createdOrganization.description}</p>
                    <p><strong>Business Type:</strong> {createdOrganization.businessType}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Add Employee</CardTitle>
              <CardDescription>Add a new employee to an organization</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addEmployee} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationId">Organization ID</Label>
                  <Input id="organizationId" name="organizationId" value={employee.organizationId} onChange={handleEmployeeChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeName">Employee Name</Label>
                  <Input id="employeeName" name="name" value={employee.name} onChange={handleEmployeeChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeEmail">Employee Email</Label>
                  <Input id="employeeEmail" name="email" type="email" value={employee.email} onChange={handleEmployeeChange} required />
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
              </form>
            </CardContent>
          </Card>
          {employees.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Employees</CardTitle>
                  <CardDescription>List of employees in the organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {employees.map((emp, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{emp.name} ({emp.email})</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}