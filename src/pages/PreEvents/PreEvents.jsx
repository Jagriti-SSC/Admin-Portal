import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { ListGroup } from "react-bootstrap";

const PreEvents = () => {
  const [events, setPreEvents] = useState([]);
  const url = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    fetchPreEventsData();
  },);

  const openImage = (imageURL) => {
    console.log(imageURL);
    try {
      window.open(imageURL, "_blank")
    }
    catch (error) {
      console.error(error);
    }
  }

  const fetchPreEventsData = async () => {
    try {
      const response = await fetch(`${url}/admin/preEvents`, {
        method: "GET",
      });
      console.log(response);
      console.log(url);
      const data = await response.json();
      // Check if data is an array before setting state
      const eventData = data.result || data;

      if (Array.isArray(eventData)) {
        setPreEvents(eventData);
      } else {
        console.error("Error: Response data is not an array", data);
      }
    } catch (error) {
      console.error("Error fetching events data:", error);
    }
  };

  const handleDelete = async (eventName) => {
    try {
      const deletePreEvent = `${url}/admin/deleteEvent/preEvents`;

      // Send a DELETE request with the event name
      const response = await fetch(deletePreEvent, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventName: eventName }),
      });

      if (response.ok) {
        console.log(`Pre Event with Name ${eventName} deleted successfully.`);
        // Fetch the updated events data after deletion
        fetchPreEventsData();
      } else {
        console.error(`Failed to delete event with Name ${eventName}`);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
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
            <th>Image</th>
            <th>Overview</th>
            <th>Status</th>
            <th>Type</th>
            <th>Timeline</th>
            <th>Contacts</th>
            <th>Participants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{event.eventName}</td>
              <td>{event.link}</td>
              <td>{
                <Button onClick={() => openImage(event.imageURL)}>Open Image</Button>
              }</td>
              <td>{event.overview}</td>
              <td>{event.status ? 'Active' : 'Inactive'}</td>
              <td>{event.teamEvent ? 'Team' : 'Individual'}</td>
              <td>{event.timeline}</td>
              <td>
                <ListGroup>
                {event.contacts.map((contact, contactIndex) => (
                  <ListGroup.Item key={contactIndex}>{contact.name} - {contact.mobile}</ListGroup.Item>
                ))}
                </ListGroup>
              </td>
              <td>
                {/* View Participants Button */}
                <Link to={`/pparticipants`} state= { event } className="btn btn-success mr-2">
                  View
                </Link>
              </td>
              <td>
                {/* Edit Button */}
                <Link to={`/editpreevent`} state= { event } className="btn btn-info mr-2">
                  Edit
                </Link>
                {/* Delete Button */}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(event.eventName)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-center flex-row align-items-center">
        <Link to="/addpreevent" className="btn btn-primary m-3">
          Add Pre Events
        </Link>
        <Link to="/" className="btn btn-primary m-3">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PreEvents;
