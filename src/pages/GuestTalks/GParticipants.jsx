import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Table from "react-bootstrap/Table";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

const url = process.env.REACT_APP_BASE_URL;

const GParticipant = () => {
  const location = useLocation();
  const { state } = location;
  const event = state ? state : null;
  const [participants, setParticipants] = useState([]);

  const handleStatusChange = async (_id, newStatus) => {
    try {
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant._id === _id ? { ...participant, status: newStatus } : participant
        )
      );

      const updateEventEndpoint = `${url}/admin/updateEvent/guestTalks`;

      const updatedParticipants = participants.reduce(
        (acc, participant) => {
          if (participant._id === _id) {
            if (event.teamEvent) {
              acc.teams.push(participant._id);
            } else {
              acc.individuals.push(participant._id);
            }
          }
          return acc;
        },
        { teams: [], individuals: [], status: newStatus }
      );

      const updatedEventData = {
        eventName: event.eventName,
        updatedBody: { participants: updatedParticipants },
      };

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
          guestTalks: [
            ...userData.guestTalks.map((eventData) =>
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
          if (event.teamEvent && event.participants.teams) {
            const teamPromises = event.participants.teams.map(async (team) => {
              const response = await fetch(`${url}/team/team`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: team }),
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
                  status: member.status,
                };
              });

              const membersData = await Promise.all(memberPromises);
              participantsData.push({
                _id: data._id,
                teamName: data.teamName,
                teamLeader: leaderData.name,
                members: membersData,
                status: event.participants.status,
              });
            });
            await Promise.all(teamPromises);
          } else if (!event.teamEvent && event.participants.individuals) {
            const userPromises = event.participants.individuals.map(async (user) => {
              const response = await fetch(`${url}/auth/userByID`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: user }),
              });
              const data = await response.json();
              participantsData.push({
                _id: data._id,
                ...data,
                status: event.participants.status,
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
      <h1 className="m-3">{`Participants for Guest Talk: ${event.eventName}`}</h1>
      {participants.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>{event.teamEvent ? "Team Name" : "Participant Name"}</th>
              {event.teamEvent && <th>Team Leader</th>}
              {event.teamEvent && <th>Team Members</th>}
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{event.teamEvent ? participant.teamName : participant.name}</td>
                {event.teamEvent && <td>{participant.teamLeader}</td>}
                {event.teamEvent && (
                  <td>
                    <ListGroup>
                      {participant.members.map((member, memberIndex) => (
                        <ListGroup.Item key={memberIndex}>{member.name}</ListGroup.Item>
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
          Back to Guest Talks
        </Button>
      </div>
    </div>
  );
};

export default GParticipant;
