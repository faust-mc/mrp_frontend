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
import FormModal from './FormModal'; // Import the modal



const UserRoles = () => {

  const { modules, setModules, accessPermissions, setAccessPermissions } = useModuleContext();
  const permissions = accessPermissions;
  const token = localStorage.getItem(ACCESS_TOKEN);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadRoleEdit, setLoadRoleEdit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [newRoleData, setNewRoleData] = useState({
    role_id: "",
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

          setData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
    };

  useEffect(() => {
    fetchData();
  }, []);


 const clearRoleState = () =>{
     setNewRoleData({
     role_id: "",
     role: "",
    area: [],
    modules: [],
    submodules: [],
    permissions: {}
  });

     }

const handleOpenModal = async (id = null) => {
    clearRoleState();
  if (id === null) {
    setModalOpen(true);
    setLoadRoleEdit(false);
    return;
  }

  try {
    setLoadRoleEdit(true);
    const response = await api.get(`/mrp/roleplain/${id}/`);

    const role_data = response.data;
    const transformedAreas = role_data.area.map((area) => ({
      label: area.location,
      value: area.location,
      id: area.id
    }));

    setNewRoleData({
      ...role_data,  // Copy the employee_data to retain its structure

      role: role_data.role,
      role_id: role_data.id,
      area: transformedAreas,
      permissions: {
        ...role_data.permissions,
        undefined: {
          ...(role_data.permissions?.undefined || {}),
          ...role_data.permissions.reduce((acc, perm) => {
            acc[perm.codename] = true;
            return acc;
          }, {}),
        },
      },
      modules: [
        ...role_data.modules.map(module => module.module) || [],
        ...role_data.submodules.map(submodule => submodule.submodule) || []
      ]
    });
  } catch (error) {
    console.error('Error fetching role data:', error);
  }

  setModalOpen(true);
};
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mrp/roles/', newRoleData);
      setModalOpen(false);
      fetchData();
      clearRoleState()

    } catch (error) {
      console.error("Error adding role:", error);
    }
  };


  const handleRoleEditSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await api.put(`/mrp/role/edit/${newRoleData.role_id}/`, newRoleData);

      const message = response.data.message;
      setModalMessage(message);
      setModalOpen(false);
      clearRoleState()

      setTimeout(() => {
        fetchData();
      }, 2000);

    } catch (error) {
      console.error("Error updating employee:", error);
    }
}


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
          <RolesTable data={data} table={tableRef} hasMore={true} handleOpenModal={handleOpenModal}/>
        </>
      )}

      {accessPermissions.some(permission => permission.codename === 'add_user') && (
        <div className="add-user">
          <button className="btn btn-primary" onClick={()=>handleOpenModal()}>Add New</button>
        </div>
      )}

      {/* Use AddEmployeeModal component here */}
      <FormModal
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        handleSubmit={loadRoleEdit?handleRoleEditSubmit : handleRoleSubmit}
        newData={newRoleData}
        handleInputChange={handleInputChange}
         setNewData={setNewRoleData}
         buttonLabel = {loadRoleEdit? "Update Role Group": "Add Role Group"}
        compo = {'Roles'}
      />
    </div>
  );
};

export default UserRoles;
