import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const history = useHistory();

  const loginButton = async () => {
    try {
      const res = await login();
      console.log(res);
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button onClick={loginButton}>login</button>
    </div>
  );
}
