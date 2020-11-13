import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./redux/utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./redux/actions/authActions";
import { Provider } from "react-redux";
import store from "./redux/store";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import Dashboard from "./components/layout/Dashboard";
import Profile from "./components/user/Profile";
import Location from "./components/user/Location";
import Footer from "./components/layout/Footer";
import ShopDetails from "./components/user/ShopDetails";
import Orders from "./components/user/Orders";
import Cart from "./components/user/Cart";
import ShopOrders from "./components/user/ShopOrders";

if (localStorage.jwtToken) {
  
  const token = localStorage.jwtToken;
  setAuthToken(token);
  
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/userlocation" component={Location} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/profile" component={Profile} />
              <PrivateRoute exact path="/shop" component={ShopDetails} />
              <PrivateRoute exact path="/cart" component={Cart} />
              <PrivateRoute exact path="/orders" component={Orders} />
              <PrivateRoute exact path="/shop/orders" component={ShopOrders} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;