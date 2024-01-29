import { BrowserRouter, Routes, Route } from "react-router-dom";
import CaForm from "./pages/CAForm/CaForm";
import HomePage from "./pages/HomePage/HomePage";
import Newsletter from "./pages/Newsletter/Newsletter";
import Users from "./pages/Users/Users";
import Events from "./pages/Events/Events";
import PreEvents from "./pages/PreEvents/PreEvents";
import GuestTalks from "./pages/GuestTalks/GuestTalks";
import AddEvent from "./pages/Events/AddEvent";
import EditEvent from "./pages/Events/EditEvent";
import EParticipant from "./pages/Events/EParticipants";
import AddGuestTalk from "./pages/GuestTalks/AddGuestTalk";
import EditGuestTalk from "./pages/GuestTalks/EditGuestTalk";
import GParticipants from "./pages/GuestTalks/GParticipants";
import AddPreEvent from "./pages/PreEvents/AddPreEvent";
import EditPreEvent from "./pages/PreEvents/EditPreEvent";
import PParticipants from "./pages/PreEvents/PParticipants";
import Login from "./Login";
import { useEffect, useState } from "react";


function App() {

  const [logged, setLogged] = useState(false);
  useEffect(()=>{
    console.log(sessionStorage.getItem("jagritisession76"))
    if(sessionStorage.getItem("jagritisession76") === null) {
      setLogged(false);
      if (window.location.href === "http://localhost:3000/") console.log(window.location.href)
      else window.location.href = "/";
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={logged ? <HomePage /> : <Login setLogged={setLogged}/>}  />
          <Route exact path="/ca" element={<CaForm />} />
          <Route exact path="/newsletter" element={<Newsletter />} />
          <Route exact path="/users" element={<Users />} />
          <Route exact path="/events" element={<Events />} />
          <Route exact path="/preevents" element={<PreEvents />} />
          <Route exact path="/guesttalks" element={<GuestTalks />} />
          <Route exact path="/addevent" element={<AddEvent />} />
          <Route exact path="/editevent" element={<EditEvent />} />
          <Route exact path="/eparticipants" element={<EParticipant />} />
          <Route exact path="/addguesttalk" element={<AddGuestTalk />} />
          <Route exact path="/editguesttalk" element={<EditGuestTalk />} />
          <Route exact path="/gparticipants" element={<GParticipants />} />
          <Route exact path="/addpreevent" element={<AddPreEvent />} />
          <Route exact path="/editpreevent" element={<EditPreEvent />} />
          <Route exact path="/pparticipants" element={<PParticipants />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
