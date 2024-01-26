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
                  _id: event.eventName,
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

  const handleStatusChange = async (_id, newStatus) => {
    try {
      // Update the status locally in the component
      setUserEvents((prevUserEvents) =>
        prevUserEvents.map((event) =>
          event._id === _id
            ? { ...event, status: newStatus }
            : { ...event }
        )
      );
  
      // Prepare the data for the API call
      const updateUserEndpoint = `${url}/auth/updateUser`;
  
      // Create a new array with the updated event and keep the rest
      const updatedEvents = userEvents.map((event) => ({
        eventName: event._id, // Use _id as eventName
        status: event._id === _id ? newStatus : event.status,
      }));

      const updatedUser = {
        email: user.email,
        newData: { preEvents: updatedEvents },
      };
  
      // Make the API call to update the status in the backend
      const response = await fetch(updateUserEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      console.log(JSON.stringify(updatedUser));
      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }
  
      console.log("User status updated successfully");
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

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
                <td>
                  <select
                    value={userEvent.status}
                    onChange={(e) =>
                      handleStatusChange(userEvent._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    {/* Add other status options as needed */}
                  </select>
                </td>
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