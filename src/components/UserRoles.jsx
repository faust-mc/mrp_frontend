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
import RolesTable from './RolesTable';
import AddUser from './AddUser'; // Import the modal



const UserRoles = () => {

  const { modules, setModules, accessPermissions, setAccessPermissions } = useModuleContext();
  const permissions = accessPermissions;
  const token = localStorage.getItem(ACCESS_TOKEN);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newData, setNewData] = useState({
    role: "",
    area: [],
    modules: [],
    submodules: [],
    permissions: {}
  });
  
  const tableRef = useRef(null);


  const fetchData = async () => {
        
        try {
          const response = await api.get(`/mrp/roles/`);
          console.log(response)
          setData(response.data);
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
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {


      await api.post('/mrp/roles/', newData);
      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="container-fluid mt-4 px-4">
      {accessPermissions.some(permission =>
          permission.codename === 'view_roles' ||
          permission.codename === 'add_roles' ||
          permission.codename === 'delete_roles' ||
          permission.codename === 'edit_roles'
        ) && (
        <>
          <h3 className="text-center mb-4">Role Groups</h3>
          <RolesTable data={data} table={tableRef} hasMore={true} />
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
        newData={newData}
        handleInputChange={handleInputChange}
         setNewData={setNewData}
        compo = {'Roles'}
      />
    </div>
  );
};

export default UserRoles;
