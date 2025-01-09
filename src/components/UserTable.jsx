import { formatDate } from '../utility_function/formatDate';
import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ActionableDataTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button, Form } from "react-bootstrap";
import {
  faEdit,
  faUndo,
  faToggleOn,
  faSync,
  faCopy,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";


function UserTable({data, tableRef, hasMore}) {
const [isResponsive, setIsResponsive] = useState(true);

 const [sortConfig, setSortConfig] = useState({ key: 'id', direction: '' });
    const [currentPage, setCurrentPage] = useState(1); // State to keep track of the current page
 const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        // Fetch sorted tickets from parent component
        getTickets(key, currentPage, direction);
    };

    const handleNextPage = () => {
        if (hasMore) { // Only move to the next page if there are more tickets
            setCurrentPage(prevPage => {
                const nextPage = prevPage + 1;
                getTickets(sortConfig.key, nextPage, sortConfig.direction);
                return nextPage;
            });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => {
                const prev = prevPage - 1;
                getTickets(sortConfig.key, prev, sortConfig.direction);
                return prev;
            });
        }
    };




  return (
     <div className="table-responsive1">
            <table
              ref={tableRef} // Attach the ref to the table
              id="dataTable"
              className="table table-hover table-striped"
            >
              <thead className="thead-dark">
                <tr>
                  <th scope="col" onClick={() => handleSort('user__first_name')} style={{ cursor: 'pointer' }}>
                  First Name
                  </th>
                  <th scope="col" onClick={() => handleSort('user__last_name')} style={{ cursor: 'pointer' }}>
                  Last Name
                  </th>
                  <th scope="col" onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                  Email
                  </th>
                  <th scope="col" onClick={() => handleSort('user__employee_id')} style={{ cursor: 'pointer' }}>
                  Emp. No
                  </th>
                  <th scope="col" onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                  User Role
                  </th>
                  <th scope="col" onClick={() => handleSort('user__superior_id')} style={{ cursor: 'pointer' }}>
                  Imm. Sup.
                  </th>
                  <th scope="col" onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                  Email Notif
                  </th>
                  <th scope="col" onClick={() => handleSort('last_login')} style={{ cursor: 'pointer' }}>
                  Last Login
                  </th>
                  <th scope="col" onClick={() => handleSort('cellphone_number')} style={{ cursor: 'pointer' }}>
                  Mobile Number
                  </th>
                  <th scope="col" onClick={() => handleSort('agency')} style={{ cursor: 'pointer' }}>
                  Agency
                  </th>
                  <th scope="col" onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status
                  </th>
                  <th>Action
                  </th>
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
                        <FontAwesomeIcon icon={faEdit} title="Edit" className="action-icon" />
                        <FontAwesomeIcon icon={faUndo} title="Return" className="action-icon" />
                        <FontAwesomeIcon icon={faToggleOn} title="Toggle" className="action-icon" />
                        <FontAwesomeIcon icon={faSync} title="Refresh" className="action-icon" />
                        <FontAwesomeIcon icon={faCopy} title="Copy" className="action-icon" />
                        <FontAwesomeIcon icon={faEnvelope} title="Email" className="action-icon" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <div className="pagination-controls">
                <button
                    className="btn btn-secondary"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1} // Disable if on the first page
                >
                    Previous
                </button>
                <span> Page {currentPage} </span>
                <button
                    className="btn btn-secondary"
                    onClick={handleNextPage}
                    disabled={!hasMore} // Disable if there are no more tickets
                >
                    Next
                </button>
            </div>*/}
          </div>
    );
}

export default UserTable