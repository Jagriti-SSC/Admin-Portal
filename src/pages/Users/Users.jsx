import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${url}/auth/getAllUser`, {
        method: "GET",
      });
      console.log(response)
      console.log(url)
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center flex-column align-items-center">
      <h1 className="m-3">User List</h1>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>College</th>
            <th>Course</th>
            <th>Year</th>
            <th>Event List</th>
            <th>PreEvent List</th>
            <th>Guest Talk List</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.college}</td>
              <td>{user.course}</td>
              <td>{user.year}</td>
              <td>
                {user.event.map((event, eventIndex) => (
                  <div key={eventIndex}>{event.eventName} - {event.status}</div>
                ))}
              </td>
              <td>
                {user.preEvents.map((preEvent, preEventIndex) => (
                  <div key={preEventIndex}>{preEvent.eventName} - {preEvent.status}</div>
                ))}
              </td>
              <td>
                {user.guestTalks.map((guestTalk, guestTalkIndex) => (
                  <div key={guestTalkIndex}>{guestTalk.eventName} - {guestTalk.status}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Link to="/" className="btn btn-primary m-3">
        Back to Home
      </Link>
    </div>
  );
};

export default Users;
