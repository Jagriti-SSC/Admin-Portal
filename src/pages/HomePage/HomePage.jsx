import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
const HomePage = () => {
  const navigate = useNavigate();

  const buttons = [
    { label: "CA Form Responses", path: "/ca", color: "#3498db" },
    { label: "Newsletter Responses", path: "/newsletter", color: "#2ecc71" },
    { label: "User List", path: "/users", color: "#e74c3c" },
    { label: "Event List", path: "/events", color: "#f39c12" },
    { label: "Pre-event List", path: "/preevents", color: "#9b59b6" },
    { label: "Guest Talk List", path: "/guesttalks", color: "#1abc9c" },
  ];

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

    <Container className="text-center mt-5">
      <h1 className="mb-4">Admin Portal</h1>
      <Row className="justify-content-center">
        {buttons.map((button, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-3">
            <Card
              className="hover-card"
              style={{ backgroundColor: button.color }}
              onClick={() => navigate(button.path)}
            >
              <Card.Body>
                <Card.Title>{button.label}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;
