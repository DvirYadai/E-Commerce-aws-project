import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Shop from "./pages/Shop";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Switch>
            <PrivateRoute exact path="/" component={Shop} />
            <PrivateRoute exact path="/cart" component={Cart} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
