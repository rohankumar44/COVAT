import React, { Component } from 'react';
import classnames from "classnames";
import UserImage from './UserImage';
import axios from "axios";
import SweetAlert from 'react-bootstrap-sweetalert';

class ShopDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sold: null,
            available: null,
            shopname: "",
            contactnumber: null,
            errors: {},
            address: "",
            alert: null,
            holderClass: "",
            price: null
        }
    }

    componentDidMount = () => {
        const query = new URLSearchParams(this.props.location.search);
        const _id = query.get('user');
        axios.get('/api/users/userdetails/' + _id)
            .then(res => {
                const newAddress = res.data.address.locality + ", " + res.data.address.landmark + ", " +
                    res.data.address.state + ", " + res.data.address.pin + ", " + res.data.address.country;
                this.setState({
                    address: newAddress,
                    sold: res.data.sold,
                    available: res.data.available,
                    contactnumber: res.data.contactNumber,
                    shopname: res.data.shopName,
                    holderClass: "active",
                    price: res.data.price
                });
            });
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onConfirm = () => {
        this.setState({
            alert: null
        })
    }

    onEditLocation = () => {
        const query = new URLSearchParams(this.props.location.search);
        const _id = query.get('user');
        this.props.history.push({
            pathname: '/userlocation',
            search: '?user=' + _id
        })
    }

    onSubmit = e => {
        e.preventDefault();
        const getAlert = () => (
            <SweetAlert success title="Success!" onConfirm={this.onConfirm}>
                You are successfully Registered!
            </SweetAlert>
        );
        const query = new URLSearchParams(this.props.location.search);
        const _id = query.get('user');
        const newData = {
            id: " " + _id,
            contactNumber: this.state.contactnumber,
            shopName: this.state.shopname,
            sold: this.state.sold,
            available: this.state.available,
            price: this.state.price
        }
        axios.put('/api/users/updatedetails', newData)
            .then(res => {
                this.setState({
                    alert: getAlert(),
                    errors: {}
                })
            })
            .catch(err => this.setState({ errors: err.response.data }));
    }

    render() {
        const { errors } = this.state;
        return (
            <div className="container">
                <div className="row" style={{ marginTop: "4rem" }}>
                    <div className="col s8 offset-s2">
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.shopname}
                                    error={errors.shopname}
                                    id="shopname"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.shopname
                                    })}
                                />
                                <label htmlFor="shopname" className={this.state.holderClass}>
                                    Shop Name
                                </label>
                                <span className="red-text">{errors.shopname}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.contactnumber}
                                    error={errors.contactnumber}
                                    id="contactnumber"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.contactnumber
                                    })}
                                />
                                <label htmlFor="contactnumber" className={this.state.holderClass}>
                                    Contact No.
                                </label>
                                <span className="red-text">{errors.contactnumber}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.available}
                                    error={errors.available}
                                    id="available"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.available
                                    })}
                                />
                                <label htmlFor="available" className={this.state.holderClass}>
                                    No. Of Vaccines Available
                                </label>
                                <span className="red-text">{errors.available}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.price}
                                    error={errors.price}
                                    id="price"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.price
                                    })}
                                />
                                <label htmlFor="price" className={this.state.holderClass}>
                                    Price (in Rs.)
                                </label>
                                <span className="red-text">{errors.price}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.sold}
                                    error={errors.sold}
                                    id="sold"
                                    type="text"
                                    disabled
                                    className={classnames("", {
                                        invalid: errors.sold
                                    })}
                                />
                                <label htmlFor="sold" className={this.state.holderClass}>
                                    No. Of Vaccines Sold
                                </label>
                                <span className="red-text">{errors.sold}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.address}
                                    error={errors.address}
                                    id="address"
                                    type="text"
                                    disabled
                                    className={classnames("", {
                                        invalid: errors.address
                                    })}
                                />
                                <label htmlFor="address" className={this.state.holderClass}>
                                    Address
                                </label>
                                <span className="red-text">{errors.address}</span>
                            </div>
                            <div className="col s2.5">
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
                            <div className="col s2">
                                <button
                                    style={{
                                        width: "250px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem",
                                        marginLeft: "1rem"
                                    }}
                                    onClick={this.onEditLocation}
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    Edit Location
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShopDetails;
