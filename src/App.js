import { BrowserRouter, Routes, Route } from "react-router-dom";
import CaForm from "./pages/CAForm/CaForm";
import HomePage from "./pages/HomePage/HomePage";
import Newsletter from "./pages/Newsletter/Newsletter";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route exact path="/" element={<HomePage />} />
          <Route exact path="/ca" element={<CaForm />} />
          <Route exact path="/newsletter" element={<Newsletter />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
