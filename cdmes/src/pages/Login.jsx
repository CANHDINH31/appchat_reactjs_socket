import { useState } from "react";
import { useDispatch } from "react-redux/es/exports";
import { login } from "../redux/userSlice";
import "./login.css";

export default function Login() {
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">CD Mesenger</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on CD Messenger.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox">
            <input
              placeholder="Username"
              type="email"
              required
              className="loginInput"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="loginButton" type="submit" onClick={handleLogin}>
              Log In
            </button>

            <button className="loginRegisterButton">
              Create a New Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
