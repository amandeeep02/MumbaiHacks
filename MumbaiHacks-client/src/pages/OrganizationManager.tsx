import React, { useState } from 'react';
import axiosInstance from '@/utility/axiosInterceptor';
import { Container, TextField, Button, Typography, Paper, List, ListItem, ListItemText, AppBar, Tabs, Tab } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  button: {
    alignSelf: 'flex-start',
  },
  list: {
    marginTop: '20px',
  },
  appBar: {
    marginBottom: '20px',
  },
});

const OrganizationManager = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [organization, setOrganization] = useState({ name: '', description: '', businessType: '' });
  const [employee, setEmployee] = useState({ name: '', email: '', organizationId: '' });
  const [createdOrganization, setCreatedOrganization] = useState(null);
  const [employees, setEmployees] = useState([]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganization({ ...organization, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const createOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/organizations/add', {
        ...organization,
        userId: localStorage.getItem('currentUserId')
      });
      setCreatedOrganization(response.data.organization);
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  const addEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      axiosInstance.post('/organizations/addEmployee', {
        organizationId: employee.organizationId,
        employeeId: employee.email,
        userId: localStorage.getItem('currentUserId')
      }).then((response) => {
        setEmployees(response.data.employees);
      });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <Container className={classes.container}>
      <AppBar position="static" className={classes.appBar}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Add Organization" />
          <Tab label="Add Employees" />
        </Tabs>
      </AppBar>

      {activeTab === 0 && (
        <Paper className={classes.form} component="form" onSubmit={createOrganization}>
          <Typography variant="h6">Create Organization</Typography>
          <TextField
            label="Organization Name"
            name="name"
            value={organization.name}
            onChange={handleOrganizationChange}
            required
          />
          <TextField
            label="Organization Description"
            name="description"
            value={organization.description}
            onChange={handleOrganizationChange}
            required
          />
          <TextField
            label="Business Type"
            name="businessType"
            value={organization.businessType}
            onChange={handleOrganizationChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" className={classes.button}>
            Create Organization
          </Button>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper className={classes.form} component="form" onSubmit={addEmployee}>
          <Typography variant="h6">Add Employee</Typography>
          <TextField
            label="Organization ID"
            name="organizationId"
            value={employee.organizationId}
            onChange={handleEmployeeChange}
            required
          />
          <TextField
            label="Employee Name"
            name="name"
            value={employee.name}
            onChange={handleEmployeeChange}
            required
          />
          <TextField
            label="Employee Email"
            name="email"
            type="email"
            value={employee.email}
            onChange={handleEmployeeChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" className={classes.button}>
            Add Employee
          </Button>
        </Paper>
      )}

      {createdOrganization && (
        <Paper className={classes.form}>
          <Typography variant="h6">Created Organization</Typography>
          <Typography>Name: {createdOrganization.name}</Typography>
          <Typography>Description: {createdOrganization.description}</Typography>
          <Typography>Business Type: {createdOrganization.businessType}</Typography>
        </Paper>
      )}

      {employees.length > 0 && (
        <Paper className={classes.list}>
          <Typography variant="h6">Employees</Typography>
          <List>
            {employees.map((emp, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${emp.name} (${emp.email})`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default OrganizationManager;