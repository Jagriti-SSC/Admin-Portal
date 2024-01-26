import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const url = process.env.REACT_APP_BASE_URL;

const UserPreEvents = () => {
  const location = useLocation();
  const { state } = location;
  const user = state ? state : null;
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    const fetchUserEvents = async () => {
        try {
          let eventsData = [];
      
          if (user && user.preEvents) {
            const eventPromises = user.preEvents.map(async (event) => {
              try {
                const response = await fetch(`${url}/admin/getPreEventByID`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ _id: event.eventName }),
                });
      
                if (!response.ok) {
                  throw new Error(`Failed to fetch pre event: ${response.status}`);
                }
      
                const eventData = await response.json();
                eventsData.push({
                  eventName: eventData.eventName,
                  status: event.status,
                });
              } catch (error) {
                console.error(`Error fetching pre event details: ${error.message}`);
                // Handle the error as needed, e.g., you can push a placeholder data
                eventsData.push({
                  eventName: "Invalid Pre Event",
                  status: "Error",
                });
              }
            });
      
            await Promise.all(eventPromises);
          }
      
          setUserEvents(eventsData);
        } catch (error) {
          console.error("Error fetching user pre events:", error);
        }
      };      

    if (user) {
      fetchUserEvents();
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex justify-content-center flex-column align-items-center">
      <h1 className="m-3">{`Pre Events for User: ${user.name}`}</h1>
      {userEvents.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Pre Event Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {userEvents.map((userEvent, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{userEvent.eventName}</td>
                <td>{userEvent.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No pre events found for the user</div>
      )}
      <div className="d-flex justify-content-center flex-row align-items-center">
        <Button variant="primary" onClick={() => window.history.back()}>
          Back to Users
        </Button>
      </div>
    </div>
  );
};

export default UserPreEvents;