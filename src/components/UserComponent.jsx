// UserComponent.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { ACCESS_TOKEN } from '../constants';
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ActionableDataTable.css";
import "../styles/UserComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from '../utility_function/formatDate';
import { ModuleProvider, useModuleContext } from "./ModuleContext";
import { Button } from "react-bootstrap";
import UserTable from './UserTable';
import AddUser from './AddUser'; // Import the modal



const UserComponent = () => {

  const { modules, setModules, accessPermissions, setAccessPermissions } = useModuleContext();
  const permissions = accessPermissions;
  const token = localStorage.getItem(ACCESS_TOKEN);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    supervisor: "",
    mobile_number: "",
    supervisor: "",
    department: "",
    area: [],
    permissions: {}
  });
  
  const tableRef = useRef(null);


  const fetchData = async () => {
     

        try {
          const response = await api.get('/mrp/employees/');
          const employees = response.data.map((employee) => ({
            first_name: employee.user.first_name,
            last_name: employee.user.last_name,
            email: employee.user.email,
            employee_number: employee.id,
            user_role: employee.role[0].role,
            supervisor: employee.superior ? employee.superior.full_name : "-",
            last_login: employee.user.last_login ? employee.user.last_login : "-",
            mobile_number: employee.cellphone_number,
            agency: "Agency A",
            status: employee.user.is_active ? "Active" : "Disabled",
          }));
          setData(employees);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      
    };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(newEmployee);
  console.log('----')
  try {
    const config = {
      headers: { Authorization: `CTGI7a00fn ${token}` },
      withCredentials: true,
    };

    // Send POST request to add a new employee
    await api.post('/mrp/employees/', newEmployee, config);

    // Close modal and refresh user data
    setModalOpen(false);
    fetchData();
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};


  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="container-fluid mt-4 px-4">
      {accessPermissions.some(permission => permission.codename === 'view_user') && (
        <>
          <h3 className="text-center mb-4">User Details</h3>
          <UserTable data={data} table={tableRef} hasMore={true} />
        </>
      )}

      {accessPermissions.some(permission => permission.codename === 'add_user') && (
        <div className="add-user">
          <button className="btn btn-primary" onClick={handleOpenModal}>Add New</button>
        </div>
      )}

      {/* Use AddEmployeeModal component here */}
      <AddUser
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        handleSubmit={handleSubmit}
        newEmployee={newEmployee}
        handleInputChange={handleInputChange}
        setNewEmployee={setNewEmployee}
        
      />
    </div>
  );
};

export default UserComponent;
