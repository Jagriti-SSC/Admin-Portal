import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

const PreEvents = () => {
  const [preEvents, setPreEvents] = useState([]);

  useEffect(() => {
    fetchPreEventsData();
  }, []);

  const fetchPreEventsData = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${url}/admin/preEvent`, {
        method: "GET",
      });
      console.log(response);
      console.log(url);
      const data = await response.json();
      // Check if data is an array before setting state
      if (Array.isArray(data)) {
        setPreEvents(data);
      } else {
        console.error("Error: Response data is not an array", data);
      }
    } catch (error) {
      console.error("Error fetching preEvents data:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center flex-column align-items-center">
      <h1 className="m-3">Pre Event List</h1>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Pre Event Name</th>
            <th>Link</th>
            <th>Image URL</th>
            <th>Overview</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {preEvents.map((preEvent, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{preEvent.preEventName}</td>
              <td>{preEvent.link}</td>
              <td>{preEvent.imageURL}</td>
              <td>{preEvent.overview}</td>
              <td>{preEvent.status}</td>
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

export default PreEvents;
