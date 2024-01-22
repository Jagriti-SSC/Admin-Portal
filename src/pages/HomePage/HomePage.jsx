import React from "react";
import {Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
    const navigate = useNavigate();
  return (
      
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h1 className="m-2">Admin Portal</h1>
        <Button className="m-1" variant="primary" onClick={()=> {navigate("/ca")}}>
          CA Form Responses
        </Button>
        <Button className="m-1" variant="primary" onClick={()=> {navigate("/newsletter")}}>
          Newsletter Responses
        </Button>
        <Button className="m-1" variant="primary" onClick={()=> {navigate("/users")}}>
          User List
        </Button>
        <Button className="m-1" variant="primary" onClick={()=> {navigate("/events")}}>
          Event List
        </Button>
        <Button className="m-1" variant="primary" onClick={()=> {navigate("/preevents")}}>
          Pre-event List
        </Button>
        <Button className="m-1" variant="primary" onClick={()=> {navigate("/guesttalks")}}>
          Guest Talk List
        </Button>
     
    </div>
  );
};

export default HomePage;
