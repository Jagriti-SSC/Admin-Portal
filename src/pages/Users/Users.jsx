import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const openImage = (imageURL) => {
    console.log(imageURL);
    try {
      window.open(imageURL, "_blank")
    }
    catch (error) {
      console.error(error);
    }
  }

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
            <th>Image</th>
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
              <td>{
                <Button onClick={() => openImage(user.imgUrl)}>Open Image</Button>
              }</td>
              <td>{user.college}</td>
              <td>{user.course}</td>
              <td>{user.year}</td>
              <td>
                {/* View events Button */}
                <Link to={`/uevent`} state= { user } className="btn btn-success mr-2">
                  View
                </Link>
              </td>
              <td>
                {/* View pre events Button */}
                <Link to={`/upreevent`} state= { user } className="btn btn-success mr-2">
                  View
                </Link>
              </td>
              <td>
                {/* View guest talks Button */}
                <Link to={`/uguesttalk`} state= { user } className="btn btn-success mr-2">
                  View
                </Link>
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
