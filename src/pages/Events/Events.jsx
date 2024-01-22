import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${url}/admin/event`, {
        method: "GET",
      });
      console.log(response);
      console.log(url);
      const data = await response.json();
      // Check if data is an array before setting state
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error("Error: Response data is not an array", data);
      }
    } catch (error) {
      console.error("Error fetching events data:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center flex-column align-items-center">
      <h1 className="m-3">Event List</h1>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Event Name</th>
            <th>Link</th>
            <th>Image URL</th>
            <th>Overview</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{event.eventName}</td>
              <td>{event.link}</td>
              <td>{event.imageURL}</td>
              <td>{event.overview}</td>
              <td>{event.status}</td>
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

export default Events;
