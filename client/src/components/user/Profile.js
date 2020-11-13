import React, { Component } from 'react'
import classnames from "classnames";
import axios from 'axios';
import M from "materialize-css";
import SweetAlert from 'react-bootstrap-sweetalert';
import { logoutUser } from '../../redux/actions/authActions';
import { connect } from "react-redux";
import UserImage from './UserImage';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            _id: "",
            errors: {},
            name: "",
            shopkeeper: "",
            email: "",
            password: "",
            currentpassword: "",
            newpassword: "",
            date: "",
            holderClass: "",
            address: "",
            confirmpassword: "",
            alert: null,
            userlocation: null
        }
    }

    componentDidMount = () => {
        const query = new URLSearchParams(this.props.location.search);
        const id = query.get('user')
        axios.get('api/users/userdetails/' + id)
            .then(res => {
                const address = res.data.address;
                const newAddress = address.locality + ", " + address.landmark + ", " + address.state +
                    ", " + address.pin + ", " + address.country;
                this.setState({
                    name: res.data.name,
                    address: newAddress,
                    email: res.data.email,
                    password: res.data.password,
                    shopkeeper: res.data.shopkeeper,
                    date: res.data.date,
                    holderClass: "active",
                    _id: id,
                    userlocation: res.data.address
                })
            });
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems, {});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onDelete = e => {
        e.preventDefault();
        axios.delete('/api/users/invaliduser/' + this.state._id)
            .then(res => {
                this.props.logoutUser();
            })
    }
    onSubmit = e => {
        e.preventDefault();
        const userDetails = {
            email: this.state.email,
            id: this.state._id,
            currentpassword: this.state.currentpassword,
            newpassword: this.state.newpassword,
            password2: this.state.confirmpassword
        }
        axios.put('/api/users/changepassword', userDetails)
            .then(res => this.setState({ alert: getAlert(), errors: {} }))
            .catch(err => this.setState({ errors: err.response.data }));

        const getAlert = () => (
            <SweetAlert success title="Success!" onConfirm={this.onConfirm}>
                Password Changed Successfully!
            </SweetAlert>
        );
    }

    onConfirm = () => {
        this.setState({ alert: null })
    }

    render() {
        const { errors } = this.state;
        return (
            <div className="container">
                <div style={{ marginTop: "4rem" }} className="row">
                    <div className="col s7">
                        <form noValidate onSubmit={this.onDelete}>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.name}
                                    id="name"
                                    type="text"
                                    disabled
                                />
                                <label htmlFor="name" className={this.state.holderClass}>Name</label>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    id="email"
                                    type="email"
                                    disabled
                                    
                                />
                                <label htmlFor="email" className={this.state.holderClass}>
                                    Email
                                </label>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    id="password"
                                    type="password"
                                    disabled
                                    
                                />
                                <label htmlFor="password" className={this.state.holderClass}>
                                    Password
                                </label>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.shopkeeper.toUpperCase()}
                                    id="shopkeeper"
                                    type="text"
                                    disabled
                                    
                                />
                                <label htmlFor="shopkeeper" className={this.state.holderClass}>
                                    Shopkeeper
                                </label>
                            </div>
                            {
                                this.state.shopkeeper == "yes" ?
                                    <div className="input-field col s12">
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.address}
                                            id="address"
                                            type="text"
                                            disabled
                                            
                                        />
                                        <label htmlFor="address" className={this.state.holderClass}>
                                            Shop Address
                                </label>
                                    </div> :
                                    <div className="input-field col s12">
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.date.slice(11, 19)}
                                            id="time"
                                            type="text"
                                            disabled
                                            
                                        />
                                        <label htmlFor="time" className={this.state.holderClass}>
                                            Account Creation Time
                                        </label>
                                    </div>
                            }

                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.date.slice(0, 10)}
                                    id="date"
                                    type="text"
                                    disabled
                                    
                                />
                                <label htmlFor="date" className={this.state.holderClass}>
                                    Account Created On
                                </label>
                            </div>
                            <div className="col s12" >
                                <button
                                    style={{
                                        width: "250px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem"
                                    }}
                                    type="submit"
                                    className="btn btn-large waves-effect waves-light hoverable red accent-3"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="col s1"></div>
                    <div className="col s4">
                        <div className="row" style={{ marginLeft: "0px" }}>
                            <div class="col s12 m7">
                                <UserImage
                                    id={this.props.auth.user.id}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col s1"></div>
                    <div className="col s4">
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.currentpassword}
                                    error={errors.currentpassword}
                                    id="currentpassword"
                                    type="password"
                                    className={classnames("", {
                                        invalid: errors.currentpassword
                                    })}
                                />
                                <label htmlFor="currentpassword">Current Password</label>
                                <span className="red-text">
                                    {errors.currentpassword}
                                    {errors.passwordincorrect}
                                </span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.newpassword}
                                    error={errors.newpassword}
                                    id="newpassword"
                                    type="password"
                                    className={classnames("", {
                                        invalid: errors.newpassword
                                    })}
                                />
                                <label htmlFor="newpassword">New Password</label>
                                <span className="red-text">
                                    {errors.newpassword}
                                </span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.confirmpassword}
                                    error={errors.confirmpassword}
                                    id="confirmpassword"
                                    type="password"
                                    className={classnames("", {
                                        invalid: errors.confirmpassword
                                    })}
                                />
                                <label htmlFor="confirmpassword">Confirm New Password</label>
                                <span className="red-text">
                                    {errors.confirmpassword}
                                    {errors.password2}
                                </span>
                            </div>
                            <div className="col s12">
                                <button
                                    style={{
                                        width: "250px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem"
                                    }}
                                    type="submit"
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    Change Password
                                </button>{this.state.alert}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Profile);
