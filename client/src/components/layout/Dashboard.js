import React, { Component } from "react";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import axios from "axios";
import "../styleSheets/Dashboard.css";
import classnames from "classnames";
import ShopDistance from "../layout/ShopDistance";
import { getDistance } from 'geolib';
import SweetAlert from 'react-bootstrap-sweetalert';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      users: [],
      fixedlatitude: 37.7577,
      fixedlongitude: -122.4376,
      latitude: 37.7577,
      longitude: -122.4376,
      findAddress: "",
      holderClass: "",
      currentShop: false,
      user: {},
      viewport: {
        width: "98.5vw",
        height: "80vh",
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8
      },
      errors: "",
      cartItem: null
    }
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
  }

  componentDidMount = () => {
    axios.get('/api/users/userdetails/' + this.props.auth.user.id)
      .then(res => {
        axios.get('/api/users')
          .then(response => {
            const newUsers = response.data.users.map(user => {
              user.distance = getDistance(
                { latitude: res.data.coordinates[0], longitude: res.data.coordinates[1] },
                { latitude: user.address.latitude, longitude: user.address.longitude }
              );
              user.distance /= 1000;
              return user;
            }
            );
            const newAddress = "100, Dellbrook Ave, Midtown Terrace, San Francisco, San Francisco County, California, 94127, USA";
            this.setState({
              latitude: res.data.coordinates[0],
              longitude: res.data.coordinates[1],
              fixedlatitude: res.data.coordinates[0],
              fixedlongitude: res.data.coordinates[1],
              users: newUsers,
              findAddress: newAddress,
              holderClass: "active"
            })
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  onShopClicked = (e) => {
    this.setState({
      cartItem: e.data
    });
    const getAlert = () => (
      <SweetAlert
        info
        showCancel
        confirmBtnText="Buy Now"
        confirmBtnBsStyle="default"
        cancelBtnBsStyle="default"
        cancelBtnText="Add To Cart"
        title="Buy Now"
        onConfirm={this.onBuyNow}
        onCancel={this.onAddToCart}
      >
        Or Add Vaccine From This Shop To Cart ?
  </SweetAlert>
    );
    this.setState({
      alert: getAlert()
    });
  }

  onAddToCart = () => {
    const newItem = {
      id: this.props.auth.user.id,
      shopkeeperId: this.state.cartItem.id,
      shopName: this.state.cartItem.shopname,
      shopAddress: this.state.cartItem.address,
      price: this.state.cartItem.price,
      available: this.state.cartItem.available,
      shippingAddress: this.state.findAddress,
      latitude: this.state.fixedlatitude,
      longitude: this.state.fixedlongitude
    };
    axios.put('/api/shopping/cart', newItem)
      .then(res => window.location.reload(false))
      .catch(err => console.log(err.response.data));

    this.setState({
      alert: null,
      cartItem: null
    });
  }

  onBuyNow = () => {
    const newItem = {
      id: this.props.auth.user.id,
      shopkeeperId: this.state.cartItem.id,
      shopName: this.state.cartItem.shopname,
      shopAddress: this.state.cartItem.address,
      price: this.state.cartItem.price,
      available: this.state.cartItem.available,
      shippingAddress: this.state.findAddress,
      latitude: this.state.fixedlatitude,
      longitude: this.state.fixedlongitude
    };
    axios.put('/api/shopping/cart', newItem)
      .then(res => {
        this.props.history.push('/cart?user=' + this.props.auth.user.id);
        window.location.reload(false);
      })
      .catch(err => console.log(err.response.data));

    this.setState({
      alert: null,
      cartItem: null
    });
  }

  onChangeState = (e) => {
    console.log(process.env);
    axios.get('https://us1.locationiq.com/v1/reverse.php?key=' + process.env.REACT_APP_GEOCODE_API_KEY + '&format=json&lat=' + e.lngLat[1] + '&lon=' + e.lngLat[0])
      .then((res) => {
        this.setState({
          fixedlatitude: e.lngLat[1],
          fixedlongitude: e.lngLat[0],
          findAddress: res.data.display_name,
          holderClass: "active"
        });
        const newUsers = this.state.users.map(user => {
          user.distance = getDistance(
            { latitude: e.lngLat[1], longitude: e.lngLat[0] },
            { latitude: user.address.latitude, longitude: user.address.longitude }
          );
          user.distance /= 1000;
          return user;
        });
        this.setState({
          users: newUsers
        });
      })
  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
      errors: ""
    })
  }

  onFindLocation = (e) => {
    e.preventDefault();
    axios.get('https://us1.locationiq.com/v1/search.php?key=' + process.env.REACT_APP_GEOCODE_API_KEY + '&format=json&q=' + this.state.findAddress)
      .then(res => {
        this.setState({
          fixedlongitude: parseFloat(res.data[0].lon),
          fixedlatitude: parseFloat(res.data[0].lat),
          latitude: parseFloat(res.data[0].lat),
          longitude: parseFloat(res.data[0].lon),
          errors: ""
        });
        const newUsers = this.state.users.map(user => {
          user.distance = getDistance(
            { latitude: parseFloat(res.data[0].lat), longitude: parseFloat(res.data[0].lon) },
            { latitude: user.address.latitude, longitude: user.address.longitude }
          );
          user.distance /= 1000;
          return user;
        });
        this.setState({
          users: newUsers
        });
      })
      .catch(err => this.setState({ errors: "Invalid Address. Please Try Again!" }));
  };

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationErrors);
    }
    else {
      alert('geolocation not supported');
    }
  };

  getCoordinates = (position) => {
    axios.get('https://us1.locationiq.com/v1/reverse.php?key=' + process.env.REACT_APP_GEOCODE_API_KEY + '&format=json&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude)
      .then((response) => {
        this.setState({
          holderClass: "active",
          findAddress: response.data.display_name,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          fixedlatitude: position.coords.latitude,
          fixedlongitude: position.coords.longitude
        });
        const newUsers = this.state.users.map(user => {
          user.distance = getDistance(
            { latitude: position.coords.latitude, longitude: position.coords.longitude },
            { latitude: user.address.latitude, longitude: user.address.longitude }
          );
          user.distance /= 1000;
          return user;
        });
        this.setState({
          users: newUsers
        });
      })
      .catch(err => console.log(err));
  }

  handleLocationErrors = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
      default:
        alert("An unknown error occured");
    }
  }

  render() {
    return (
      <div style={{ margin: "0px", marginLeft: "3.5px", marginTop: "1px", minHeight: "70vh" }}
        className="container valign-wrapper">
        <div className="row">
          <div className="col s12" >
            <ReactMapGL
              {...this.state.viewport}
              latitude={this.state.latitude}
              longitude={this.state.longitude}
              mapboxApiAccessToken={process.env.REACT_APP_API_ACCESS_TOKEN}
              onViewportChange={(viewport) => this.setState({
                viewport: viewport,
                latitude: viewport.latitude,
                longitude: viewport.longitude
              })}
              mapStyle={"mapbox://styles/" + process.env.REACT_APP_MAP_API_KEY } 
              onClick={this.onChangeState}
            >
              <Marker
                latitude={this.state.fixedlatitude}
                longitude={this.state.fixedlongitude}
              >
                <i class="material-icons" style={{ color: "red" }}>place</i>
              </Marker>
              {
                this.state.users.map(user => (
                  <Marker
                    latitude={user.address.latitude}
                    longitude={user.address.longitude}
                  >
                    <i class="material-icons"
                      onMouseEnter={(e) => this.setState({ currentShop: true, user: user })}
                      onMouseLeave={(e) => this.setState({ currentShop: false, user: {} })}
                    >business_center
                </i>
                  </Marker>
                ))
              }
              {
                this.state.currentShop ? (
                  <Popup latitude={this.state.user.address.latitude}
                    longitude={this.state.user.address.longitude}
                  >
                    <div style={{ margin: "5px" }}>
                      <p>Available : {this.state.user.available}</p>
                    </div>
                  </Popup>
                ) : null
              }
            </ReactMapGL>
            <label
              class="btn-floating halfway-fab waves-effect waves-light red"
              style={{ bottom: "135px", right: "43px", height: "50px", width: "50px" }}
              onClick={this.getLocation}
            >
              <i class="large material-icons" style={{ fontSize: "2rem", paddingTop: "4px" }}>
                my_location
                </i>
            </label>
          </div>
          <div className="col s12" style={{ marginTop: "1rem" }}>
            <div className="col s10" style={{ marginLeft: "1rem", marginRight: "1rem" }}>
              <form>
                <div class="input-field">
                  <input
                    onChange={this.onChange}
                    value={this.state.findAddress}
                    id="findAddress"
                    type="text"
                    className={classnames("", {
                      invalid: this.state.errors
                    })}
                  />
                  <label htmlFor="findAddress" className={this.state.holderClass}>
                    <i className="material-icons">search</i>
                  </label>
                  <span className="red-text">{this.state.errors}</span>
                </div>
              </form>
            </div>
            <div className="col s1" style={{ marginLeft: "1.5rem" }}>
              <button
                style={{
                  width: "220px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem"
                }}
                onClick={this.onFindLocation}
                className="btn btn-large waves-effect waves-light hoverable red accent-3"
              >
                Find Location
              </button>
            </div>
          </div>
          <div className="col s12">
            <ShopDistance
              users={this.state.users}
              onShopClicked={this.onShopClicked.bind(this)}
              alert={this.state.alert}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);