import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { ACCESS_TOKEN } from '../constants';
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ActionableDataTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from '../utility_function/formatDate';

import {
  faEdit,
  faUndo,
  faToggleOn,
  faSync,
  faCopy,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const UserComponent = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const [data, setData] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // State to track loading
  const [isResponsive, setIsResponsive] = useState(true); // Track if the table should be responsive
  const tableRef = useRef(null); // Reference to the table DOM element

  // Function to update the 'responsive' option based on the window width
  const handleResize = () => {
    console.log(window.innerWidth);
    if (window.innerWidth < 768) {
      setIsResponsive(true); // Make the table non-responsive on small screens
    } else {
      setIsResponsive(false); // Make the table responsive on larger screens
    }
  };

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      if (token) {
        const config = {
          headers: { Authorization: `CTGI7a00fn ${token}` },
          withCredentials: true,
        };

        try {
          const response = await api.get('/mrp/employees/', config);
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
      } else {
        console.error('No access token found');
      }
    };

    fetchData();
  }, [token]); // Run this effect once when component mounts

  useEffect(() => {
    handleResize(); // Check initial window size
    window.addEventListener('resize', handleResize); // Update responsive state on window resize

    // Initialize DataTable only when data is loaded
    if (data.length > 0) {
      const table = $(tableRef.current).DataTable({
        responsive: isResponsive, // Set responsive based on the current state
        paging: true,
        searching: true,
        info: true,
        order: [[0, "asc"]],
      });

      // Cleanup DataTable on component unmount
      return () => {
        table.destroy();
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup event listener
    };
  }, [data, isResponsive]); // Re-run the effect when 'data' or 'isResponsive' changes

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="container-fluid mt-4 px-4">
      <h3 className="text-center mb-4">User Details</h3>
      <div className="table-responsive1">
        <table
          ref={tableRef} // Attach the ref to the table
          id="dataTable"
          className="table table-hover table-striped"
        >
          <thead className="thead-dark">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Emp. No</th>
              <th>User Role</th>
              <th>Imm. Sup.</th>
              <th>Email Notif</th>
              <th>Last Login</th>
              <th>Mobile Number</th>
              <th>Agency</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.first_name}</td>
                <td>{row.last_name}</td>
                <td>{row.email}</td>
                <td>{row.employee_number}</td>
                <td>{row.user_role}</td>
                <td>{row.supervisor}</td>
                <td>{row.email}</td>
                <td>{row.last_login ? formatDate(row.last_login.toString()) : "N/A"}</td>
                <td>{row.mobile_number}</td>
                <td>{row.agency}</td>
                <td>{row.status}</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <FontAwesomeIcon
                      icon={faEdit}
                      title="Edit"
                      className="action-icon"
                    />
                    <FontAwesomeIcon
                      icon={faUndo}
                      title="Return"
                      className="action-icon"
                    />
                    <FontAwesomeIcon
                      icon={faToggleOn}
                      title="Toggle"
                      className="action-icon"
                    />
                    <FontAwesomeIcon
                      icon={faSync}
                      title="Refresh"
                      className="action-icon"
                    />
                    <FontAwesomeIcon
                      icon={faCopy}
                      title="Copy"
                      className="action-icon"
                    />
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      title="Email"
                      className="action-icon"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserComponent;
