import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { getStorage, ref, getDownloadURL  } from "firebase/storage";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
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
const storage = getStorage(firebaseApp);

const CaForm = () => {
  const [response, setResponse] = useState([]);


  const openIdCard = (fileName)=>{
    console.log(fileName);

    getDownloadURL(ref(storage, `CAForm/${fileName}`)).then((url)=>{
        console.log(url);
        window.open(url, "_blank")
    })
    .catch((err)=>{
        console.log(err);
    })
  }



  const fetchResponse = async () => {
    const collectionData = await getDocs(collection(db, "ca-form"));

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
        <h1 className="m-3">CA Form Responses</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>College</th>
            <th>Branch</th>
            <th>Roll No</th>
            <th>ID Card</th>
          </tr>
        </thead>

        <tbody>
          {response.map((data, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{data.name}</td>
              <td>{data.email}</td>
              <td>{data.mobile}</td>
              <td>{data.college}</td>
              <td>{data.branch}</td>
              <td>{data.rollNo}</td>
              <td>{
                <Button onClick={()=>openIdCard(data.userId)}>Open ID Card</Button>
                }</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CaForm;
