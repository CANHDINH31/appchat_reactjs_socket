import Home from "./pages/Home";
import Login from "./pages/Login";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
function App() {
  const currentUser = useSelector((state) => state.user.currentUser);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={currentUser === null ? <Navigate to="/login" /> : <Home />}
          />

          <Route
            path="/login"
            element={currentUser === null ? <Login /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
