import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Table from "react-bootstrap/Table";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
var XLSX = require("xlsx");

const url = process.env.REACT_APP_BASE_URL;

const PParticipant = () => {

  const exportToExcel = () => {
    let sheetData = {};

    if (event.teamEvent) {
      sheetData = participants.map((participant, index) => {
        return {
          'Team Name': participant.teamName,
          'Team Leader Name': participant.teamLeader.name,
          'Team Leader Email': participant.teamLeader.email,
          'Status': participant.status,
        };
      });
    } else {
      sheetData = participants.map((participant, index) => {
        return {
          'Participant Name': participant.name,
          'Email ID': participant.email,
          'Status': participant.status,
        };
      });
    }
 
    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    const fileName = `${event.eventName}_Participants.xlsx`; // Filename based on event name
    XLSX.writeFile(wb, fileName);
  };

  const location = useLocation();
  const { state } = location;
  const event = state ? state : null;
  const [participants, setParticipants] = useState([]);

  const openImage = (imageURL) => {
    console.log(imageURL);
    try {
      window.open(imageURL, "_blank")
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleStatusChange = async (_id, newStatus) => {
    try {
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant._id === _id ? { ...participant, status: newStatus } : participant
        )
      );

      const updateEventEndpoint = `${url}/admin/updateEvent/preEvents`;
      const updatedEventData = {
        eventName: event.eventName,
        updatedBody: {
          participants: event.participants.map((participant) =>
            (event.teamEvent && participant.teams === _id) ||
            (!event.teamEvent && participant.individuals === _id)
              ? {
                  ...participant,
                  status: newStatus,
                }
              : participant
          ),
        },
      };

      console.log(JSON.stringify(updatedEventData));
      const response = await fetch(updateEventEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEventData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.status}`);
      }

      // Handle Team Events
      if (event.teamEvent) {
        const teamPromises = participants
          .filter((participant) => participant._id === _id)
          .map(async (teamParticipant) => {
            const teamResponse = await fetch(`${url}/team/team`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ _id: teamParticipant._id }),
            });

            const teamData = await teamResponse.json();

            // Extract team leader and member IDs
            const teamLeaderId = teamData.teamLeader;
            const memberIds = teamData.members.map((member) => member.member);

            // Update team leader's status
            await updateUserStatus(teamLeaderId, newStatus);

            // Update team members' status
            await Promise.all(memberIds.map((memberId) => updateUserStatus(memberId, newStatus)));
          });

        await Promise.all(teamPromises);
      } else {
        // Handle Individual Events
        const individualPromises = participants
          .filter((participant) => participant._id === _id)
          .map(async (individualParticipant) => {
            const userId = individualParticipant._id;
            await updateUserStatus(userId, newStatus);
          });

        await Promise.all(individualPromises);
      }

      console.log("Event status updated successfully");
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      // Fetch user by ID
      const userResponse = await fetch(`${url}/auth/userByID`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: userId }),
      });

      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user: ${userResponse.status}`);
      }

      const userData = await userResponse.json();

      // Update user status
      const updateUserEndpoint = `${url}/auth/updateUserByID`;
      console.log(userData)
      const updateUserBody = {
        _id: userId,
        newData: {
          preEvents: [
            ...userData.preEvents.map((eventData) =>
              eventData.eventName === event._id  // Use event._id here since the eventName for the user is the _id for the event
                ? { ...eventData, status: newStatus }
                : eventData
            ),
          ],
        },
      };
      const updateUserResponse = await fetch(updateUserEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUserBody),
      });
      console.log(JSON.stringify(updateUserBody));
      if (!updateUserResponse.ok) {
        throw new Error(`Failed to update user: ${updateUserResponse.status}`);
      }
    } catch (error) {
      console.error(`Error updating user status for ID ${userId}:`, error);
    }
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        let participantsData = [];

        if (event && event.participants) {
          if (event.teamEvent && event.participants.length > 0) {
            const teamPromises = event.participants.map(async (participant) => {
              const response = await fetch(`${url}/team/team`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: participant.teams }),
              });
              const data = await response.json();

              const leaderResponse = await fetch(`${url}/auth/userByID`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: data.teamLeader }),
              });
              const leaderData = await leaderResponse.json();

              const memberPromises = data.members.map(async (member) => {
                const memberResponse = await fetch(`${url}/auth/userByID`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ _id: member.member }),
                });

                const memberData = await memberResponse.json();
                return {
                  ...memberData,
                  status: participant.status,
                };
              });

              const membersData = await Promise.all(memberPromises);

              participantsData.push({
                _id: data._id,
                teamName: data.teamName,
                teamLeader: leaderData,
                members: membersData,
                status: participant.status,
              });
            });

            await Promise.all(teamPromises);
          } else if (!event.teamEvent && event.participants.length > 0) {
            const userPromises = event.participants.map(async (participant) => {
              const response = await fetch(`${url}/auth/userByID`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: participant.individuals }),
              });
              const data = await response.json();

              participantsData.push({
                _id: data._id,
                ...data,
                status: participant.status,
              });
            });

            await Promise.all(userPromises);
          }
        }

        setParticipants(participantsData);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    if (event) {
      fetchParticipants();
    }
  }, [event]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex justify-content-center flex-column align-items-center">
      <h1 className="m-3">{`Participants for Pre Event: ${event.eventName}`}</h1>
      {participants.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>{event.teamEvent ? "Team Name" : "Participant Name"}</th>
              {event.teamEvent && <th>Team Leader</th>}
              {event.teamEvent && <th>Team Members</th>}
              {!event.teamEvent && <th>Email ID</th>}
              {!event.teamEvent && <th>Image</th>}
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{event.teamEvent ? participant.teamName : participant.name}</td>
                {!event.teamEvent && <td>{participant.email}</td>}
                {!event.teamEvent && <td><Button onClick={() => openImage(participant.imgUrl)}>Open Image</Button></td>}
                {event.teamEvent && <td>{participant.teamLeader.name}: {participant.teamLeader.email} <Button onClick={() => openImage(participant.teamLeader.imgUrl)}>Open Image</Button></td>}                {event.teamEvent && (
                  <td>
                    <ListGroup>
                      {participant.members.map((member, memberIndex) => (
                        <ListGroup.Item key={memberIndex}>{member.name}: {member.email} <Button onClick={() => openImage(member.imgUrl)}>Open Image</Button></ListGroup.Item>
                        ))}
                    </ListGroup>
                  </td>
                )}
                <td>{participant.status}</td>
                <td>
                  <select
                    value={participant.status}
                    onChange={(e) =>
                      handleStatusChange(participant._id, e.target.value)
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
        <div>No participants found</div>
      )}
      <div className="d-flex justify-content-center flex-row align-items-center">
        <Button variant="primary" onClick={() => window.history.back()}>
          Back to Pre Events
        </Button>
        <Button variant="success" className="m-3" onClick={exportToExcel}>
          Export to Excel
        </Button>
      </div>
    </div>
  );
};

export default PParticipant;