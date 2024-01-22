import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
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

// Create an instance of the imported firebase utility

const db = getFirestore(firebaseApp);

const Newsletter = () => {
  const [response, setResponse] = useState([]);

  const fetchResponse = async () => {
    const collectionData = await getDocs(collection(db, "newsletter"));

    setResponse([]);
    collectionData.forEach((doc) => {
      setResponse((prev) => {
        return [...prev, doc.data()];
      });
      // console.log(doc.data());
    });
  };

  useEffect(() => {
    fetchResponse();
  }, []);


  return (
    <div className="d-flex justify-content-center flex-column align-items-center">
      <h1 className="m-3">Newsletter Responses</h1>
      <h4>Total Responses: {response.length}</h4>
      <Table striped bordered hover>
        <thead className="text-center">
          <tr>
            <th>Email</th>
          </tr>
        </thead>
        <tbody className="text-center">

            {response.map((data, index)=> (
                <tr>
                    <td>{data.email}</td>
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

export default Newsletter;
