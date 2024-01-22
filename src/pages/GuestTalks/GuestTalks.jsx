import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

const GuestTalks = () => {
  const [guestTalks, setGuestTalks] = useState([]);

  useEffect(() => {
    fetchGuestTalksData();
  }, []);

  const fetchGuestTalksData = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${url}/admin/GuestTalks`, {
        method: "GET",
      });
      console.log(response);
      console.log(url);
      const data = await response.json();
      // Check if data is an array before setting state
      if (Array.isArray(data)) {
        setGuestTalks(data);
      } else {
        console.error("Error: Response data is not an array", data);
      }
    } catch (error) {
      console.error("Error fetching guest talks data:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center flex-column align-items-center">
      <h1 className="m-3">Guest Talk List</h1>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Guest Talk Name</th>
            <th>Link</th>
            <th>Image URL</th>
            <th>Overview</th>
            <th>Status</th>
            <th>Contacts List</th>
            <th>Participants List</th>
          </tr>
        </thead>
        <tbody>
          {guestTalks.map((guestTalk, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{guestTalk.guestTalkName}</td>
              <td>{guestTalk.link}</td>
              <td>{guestTalk.imageURL}</td>
              <td>{guestTalk.overview}</td>
              <td>{guestTalk.status}</td>
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

export default GuestTalks;
