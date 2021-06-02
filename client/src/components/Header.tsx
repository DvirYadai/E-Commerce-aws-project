import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import IconButton from "@material-ui/core/IconButton";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

export default function Header() {
  const { logout } = useAuth();

  const logoutButton = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav>
      <h1>Hardware shop</h1>
      <Link to="/">Shop</Link>
      <Link to="/cart">
        <IconButton>
          <ShoppingCartIcon color="primary" />
        </IconButton>
      </Link>
      <button onClick={logoutButton}>Log out</button>
    </nav>
  );
}
