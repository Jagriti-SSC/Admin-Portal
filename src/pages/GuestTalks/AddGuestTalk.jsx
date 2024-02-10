import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Link } from "react-router-dom";

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

const AddGuestTalk = () => {
    const [eventName, setEventName] = useState("");
    const [eventLink, setEventLink] = useState("");
    const [eventImage, setEventImage] = useState(null);
    const [eventOverview, setEventOverview] = useState("");
    const [eventStatus, setEventStatus] = useState(true);
    const eventType = false;
    const [eventTimeline, setEventTimeline] = useState("");
    const [contacts, setContacts] = useState([{ name: "", mobile: "" }]);

    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...contacts];
        updatedContacts[index][field] = value;
        setContacts(updatedContacts);
    };

    const handleAddContact = () => {
        setContacts([...contacts, { name: "", mobile: "" }]);
    };

    const handleRemoveContact = (index) => {
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setEventImage(file);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            // Upload the image and get the URL
            const imageUrl = await uploadImage();

            // Build the JSON object with the obtained imageUrl
            const eventData = {
                eventName,
                link: eventLink,
                imageURL: imageUrl,
                overview: eventOverview,
                status: eventStatus,
                teamEvent: eventType,
                timeline: eventTimeline,
                contacts: contacts,
            };

            console.log(eventData);

            // POST request
            await fetch(`${url}/admin/createEvent/addGuestTalks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventData),
            });

            // Optionally, you can make a GET request to verify the data
            const response = await fetch(`${url}/admin/GuestTalks`, {
                method: "GET",
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const uploadImage = async () => {
        // Ensure that eventImage is not null before attempting to upload
        if (!eventImage) {
            throw new Error("No image selected");
        }

        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `guest-talks/${eventImage.name}`);
        await uploadBytes(storageRef, eventImage);

        // Get the download URL of the uploaded image
        const imageUrl = await getDownloadURL(storageRef);

        return imageUrl;
    };

    return (
        <div className="container">
            <h1>Create New Guest Talk</h1>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label className="form-label">Guest Talk Name:</label>
                    <input type="text" className="form-control" onChange={(e) => setEventName(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Guest Talk Link:</label>
                    <input type="text" className="form-control" onChange={(e) => setEventLink(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Guest Talk Image:</label>
                    <input type="file" className="form-control" onChange={handleImageUpload} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Guest Talk Overview:</label>
                    <textarea className="form-control" onChange={(e) => setEventOverview(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Guest Talk Status:</label>
                    <select className="form-select" onChange={(e) => setEventStatus(e.target.value === "true")} required>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Guest Talk Type:</label>
                    <p>Individual</p>
                </div>

                <div className="mb-3">
                    <label className="form-label">Timeline:</label>
                    <textarea className="form-control" onChange={(e) => setEventTimeline(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contacts:</label>
                    {contacts.map((contact, index) => (
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
                    Create Guest Talk
                </button>
            </form>
            <Link to="/guesttalks" className="btn btn-primary m-3">
                Back to Guest Talks
            </Link>
        </div>
    );
};

export default AddGuestTalk;
