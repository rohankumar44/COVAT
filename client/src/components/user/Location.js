import React, { Component } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl';
import classnames from "classnames";
import axios from "axios";
import SweetAlert from 'react-bootstrap-sweetalert';

export default class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            errors: {},
            holderClass: "",
            locality: "",
            landmark: "",
            State: "",
            pin: "",
            country: "",
            fixedlatitude: 37.7577,
            fixedlongitude: -122.4376,
            latitude: 37.7577,
            longitude: -122.4376,
            viewport: {
                width: 400,
                height: 400,
                latitude: 37.7577,
                longitude: -122.4376,
                zoom: 8
            }
        }
        this.getLocation = this.getLocation.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
    }

    componentDidMount = () => {
        const query = new URLSearchParams(this.props.location.search);
        const id = query.get('user')

        axios.get('/api/users/userdetails/' + id)
            .then(res => {
                const newState = res.data.address;
                this.setState({
                    fixedlatitude: newState.latitude,
                    latitude: newState.latitude,
                    fixedlongitude: newState.longitude,
                    longitude: newState.longitude,
                    locality: newState.locality,
                    landmark: newState.landmark,
                    State: newState.state,
                    country: newState.country,
                    pin: newState.pin,
                    holderClass: "active"
                })
            });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationErrors);
        }
        else {
            alert('geolocation not supported');
        }
    }
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
    getCoordinates = (position) => {
        let state = "", country = "", pincode = "", locality = "";
        axios.get('https://us1.locationiq.com/v1/reverse.php?key=' + process.env.REACT_APP_GEOCODE_API_KEY + '&format=json&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude)
            .then((response) => {
                for (var key in response.data.address) {
                    if (key == "state" || key == "city") {
                        if (state) state += ", ";
                        state += response.data.address[key];
                    } else if (key == "country") {
                        country = response.data.address[key];
                        break;
                    } else if (key == "postcode") {
                        pincode = response.data.address[key];
                    }
                    else {
                        if (locality) locality += ", ";
                        locality += response.data.address[key];
                    }
                }
                this.setState({
                    locality: locality,
                    holderClass: "active",
                    State: state,
                    country: country,
                    pin: pincode
                });
            })
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            fixedlatitude: position.coords.latitude,
            fixedlongitude: position.coords.longitude
        })
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

    onChangeState = (e) => {

        let state = "", country = "", pincode = "", locality = "";
        axios.get('https://us1.locationiq.com/v1/reverse.php?key=' + process.env.REACT_APP_GEOCODE_API_KEY + '&format=json&lat=' + e.lngLat[1] + '&lon=' + e.lngLat[0])
            .then((response) => {
                for (var key in response.data.address) {
                    if (key == "state" || key == "city") {
                        if (state) state += ", ";
                        state += response.data.address[key];
                    } else if (key == "country") {
                        country = response.data.address[key];
                        break;
                    } else if (key == "postcode") {
                        pincode = response.data.address[key];
                    }
                    else {
                        if (locality) locality += ", ";
                        locality += response.data.address[key];
                    }
                }
                this.setState({
                    locality: locality,
                    holderClass: "active",
                    State: state,
                    country: country,
                    pin: pincode
                });
            })

        this.setState({
            fixedlatitude: e.lngLat[1],
            fixedlongitude: e.lngLat[0]
        });
    }

    onCancelDelete = () => {
        this.setState({
            alert: null
        });
    }

    changeAlert = (e) => {
        e.preventDefault();
        const getAlert = () => (
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes"
                confirmBtnBsStyle="default"
                cancelBtnBsStyle="default"
                title="Are you sure?"
                onConfirm={this.onSubmit}
                onCancel={this.onCancelDelete}
            >
                Do you want to save this location?
        </SweetAlert>
        );
        this.setState({
            alert: getAlert()
        });
    }


    onSubmit = () => {
        const query = new URLSearchParams(this.props.location.search);
        const _id = query.get('user')
        const location = {
            id: _id,
            address: {
                locality: this.state.locality,
                landmark: this.state.landmark,
                state: this.state.State,
                country: this.state.country,
                pin: this.state.pin,
                latitude: this.state.fixedlatitude,
                longitude: this.state.fixedlongitude
            }
        }
        axios.put('/api/users/updatedetails', location)
            .then(res => {
                this.props.history.push({
                    pathname: '/login',
                    state: { detail: "yes" }
                });
            })
            .catch(err => this.setState({ errors: err.response.data, alert: null })
            );
    }
    onFindLocation = (e) => {
        e.preventDefault();
        const address = this.state;
        const newAddress = address.locality + ", " + address.landmark + ", " + address.State +
        ", " + address.pin + ", " + address.country;
        axios.get('https://us1.locationiq.com/v1/search.php?key=' + process.env.REACT_APP_GEOCODE_API_KEY + '&format=json&q=' + newAddress)
            .then(res => {
                this.setState({
                    fixedlongitude: parseFloat(res.data[0].lon),
                    fixedlatitude: parseFloat(res.data[0].lat),
                    latitude: parseFloat(res.data[0].lat),
                    longitude: parseFloat(res.data[0].lon)
                })
            })
            .catch(err => console.log(err.response.data));
    }
    render() {
        const str = " ";
        const { errors } = this.state;
        return (
            <div style={{ marginTop: "15vh" }} className="container valign-wrapper">
                <div className="row">
                    <div className="col s6">
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
                            mapStyle={"mapbox://styles/" + process.env.REACT_APP_MAP_API_KEY}
                            onClick={this.onChangeState}
                        >
                            <Marker
                                latitude={this.state.fixedlatitude}
                                longitude={this.state.fixedlongitude}
                            >
                                <i class="material-icons" style={{ color: "red" }}>place</i>
                            </Marker>
                        </ReactMapGL>
                        <button
                            style={{
                                width: 400,
                                borderRadius: "3px",
                                marginTop: "2rem",
                                lineHeight: "0px",
                            }}
                            onClick={this.getLocation}
                            className="btn btn-large waves-effect waves-light hoverable red accent-3"
                        >
                            <i class="material-icons" >location_searching</i>
                            {str}
                            Use Current Location
                        </button>
                    </div>
                    <div className="col s6">
                        <form noValidate onSubmit={this.changeAlert}>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.locality}
                                    id="locality"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.locality
                                    })}
                                />
                                <label htmlFor="locality" className={this.state.holderClass}>
                                    Locality/Road
                                </label>
                                <span className="red-text">{errors.locality}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.landmark}
                                    id="landmark"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.landmark
                                    })}
                                />
                                <label htmlFor="landmark">Landmark/Area</label>
                                <span className="red-text">{errors.landmark}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.State}
                                    id="State"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.state
                                    })}
                                />
                                <label htmlFor="State" className={this.state.holderClass}>State/City</label>
                                <span className="red-text">{errors.state}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.pin}
                                    id="pin"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.pin
                                    })}
                                />
                                <label htmlFor="pin" className={this.state.holderClass}>Pin Code</label>
                                <span className="red-text">{errors.pin}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.country}
                                    id="country"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.country
                                    })}
                                />
                                <label htmlFor="country" className={this.state.holderClass}>Country</label>
                                <span className="red-text">{errors.country}</span>
                            </div>
                            <div className="col s4" style={{ paddingLeft: "11.250px" }}>
                                <button
                                    style={{
                                        width: "150px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem"
                                    }}
                                    type="submit"
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    Save
                                </button>{this.state.alert}
                            </div>
                            <div className="col s4">
                                <button
                                    style={{
                                        width: "220px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem"
                                    }}
                                    onClick={this.onFindLocation}
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    Find Location
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
