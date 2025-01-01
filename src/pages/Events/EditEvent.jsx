import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const url = process.env.REACT_APP_BASE_URL;

const EditEvent = () => {
    const location = useLocation();
    const { state } = location;
    const event = state ? state : null;
    const [newEventName, setNewEventName] = useState(event.eventName || "");
    const [newEventLink, setNewEventLink] = useState(event.link || "");
    const [newEventImage, setNewEventImage] = useState(null);
    const [newEventOverview, setNewEventOverview] = useState(event.overview || "");
    const [newEventStatus, setNewEventStatus] = useState(event.status ?? true);
    const [newEventType, setNewEventType] = useState(event.teamEvent ?? true);
    const [newEventTimeline, setNewEventTimeline] = useState(event.timeline || "");
    const [newContacts, setNewContacts] = useState(event.contacts || []);

    useEffect(() => {
        // Additional logic if needed when the component mounts
    }, []);

    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...newContacts];
        updatedContacts[index][field] = value;
        setNewContacts(updatedContacts);
    };

    const handleAddContact = () => {
        setNewContacts([...newContacts, { name: "", mobile: "" }]);
    };

    const handleRemoveContact = (index) => {
        const updatedContacts = newContacts.filter((_, i) => i !== index);
        setNewContacts(updatedContacts);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setNewEventImage(file);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            // If a new image is selected, upload the new image and get the URL
            let newImageUrl = event.imageURL;
            if (newEventImage) {
                newImageUrl = await uploadImage();
            }

            // Build the JSON object with the obtained newImageUrl
            const updatedEventData = {
                eventName: newEventName,
                updatedBody: {
                    link: newEventLink,
                    imageURL: newImageUrl,  // Update only if a new image is selected
                    overview: newEventOverview,
                    status: newEventStatus,
                    teamEvent: newEventType,
                    timeline: newEventTimeline,
                    contacts: newContacts,
                },
            };

            // PUT request to update the event
            await fetch(`${url}/admin/updateEvent/events`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ eventName: event.eventName, updatedBody: updatedEventData.updatedBody }),
            });
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const uploadImage = async () => {
        // Ensure that newEventImage is not null before attempting to upload
        if (!newEventImage) {
            throw new Error("No image selected");
        }

        // Upload the new image to Firebase Storage
        const storageRef = ref(storage, `events/${newEventImage.name}`);
        await uploadBytes(storageRef, newEventImage);

        // Get the download URL of the uploaded new image
        const newImageUrl = await getDownloadURL(storageRef);
        console.log("New Image URL:", newImageUrl);
        return newImageUrl;
    };

    return (
        <div className="container">
            <h1>Edit Event</h1>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label className="form-label">Event Name:</label>
                    <input type="text" className="form-control" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Event Link:</label>
                    <input type="text" className="form-control" value={newEventLink} onChange={(e) => setNewEventLink(e.target.value)}/>
                </div>

                <div className="mb-3">
                    <label className="form-label">Event Image:</label>
                    <input type="file" className="form-control" onChange={handleImageUpload} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Event Overview:</label>
                    <textarea className="form-control" value={newEventOverview} onChange={(e) => setNewEventOverview(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Event Status:</label>
                    <select className="form-select" value={newEventStatus ? "true" : "false"} onChange={(e) => setNewEventStatus(e.target.value === "true")} required>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Event Type:</label>
                    <select className="form-select" value={newEventType ? "true" : "false"} onChange={(e) => setNewEventType(e.target.value === "true")} required>
                        <option value="true">Team</option>
                        <option value="false">Individual</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Timeline:</label>
                    <textarea className="form-control" value={newEventTimeline} onChange={(e) => setNewEventTimeline(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contacts:</label>
                    {newContacts.map((contact, index) => (
                        <div key={index} className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                value={contact.name}
                                onChange={(e) => handleContactChange(index, "name", e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Mobile"
                                value={contact.mobile}
                                onChange={(e) => handleContactChange(index, "mobile", e.target.value)}
                                required
                            />
                            <button type="button" className="btn btn-danger" onClick={() => handleRemoveContact(index)}>
                                Remove Contact
                            </button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary" onClick={handleAddContact}>
                        Add Contact
                    </button>
                </div>

                <button type="submit" className="btn btn-primary">
                    Update Event
                </button>
            </form>
            <Link to={`/events`} className="btn btn-primary m-3">
                Back to Event Details
            </Link>
        </div>
    );
};

export default EditEvent;
