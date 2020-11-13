import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from '../../redux/actions/authActions';
import SideNav from './SideNav';
import AuthSideNav from './AuthSideNav';
import axios from 'axios';
import Corona from '../images/corona1.jpg';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state= {
            userImage: "http://localhost:5000/defaultImage.png",
            countOfCartItems: null
        }
    }
    componentDidMount = () => {
        if(this.props.auth.isAuthenticated) {
            axios.get('/api/users/userdetails/'+this.props.auth.user.id)
                .then(res => this.setState({
                    userImage: "http://localhost:5000" + res.data.userImage.slice(7),
                    countOfCartItems: res.data.shopping.cart.length
                })
            );
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.auth.isAuthenticated){
            axios.get('/api/users/userdetails/'+nextProps.auth.user.id)
                .then(res => this.setState({
                    userImage: "http://localhost:5000" + res.data.userImage.slice(7),
                    countOfCartItems: res.data.shopping.cart.length
                })
            );
        }
    }

    render() {
        return (
            <div>
                <div className="navbar-fixed">
                    <nav style={{ backgroundColor: '#161716' }}>
                        <div className="nav-wrapper">
                            <a href="#" data-target="slide-out" class="sidenav-trigger show-on-large">
                                <i class="material-icons">menu</i>
                            </a>
                            <Link to="/" className="brand-logo">
                                <img class= "circle" src ={Corona}
                                    style= {{
                                        height: "50px",
                                        width: "50px",
                                        marginTop: "8px"
                                    }}
                                />
                            </Link>
                            {
                                !this.props.auth.isAuthenticated ?
                                    <ul class="right hide-on-med-and-down">
                                        <li><Link to="/login" className="waves-effect waves-light btn">
                                            Sign In
                                </Link></li>
                                        <li><Link to="/register" className="waves-effect waves-light btn">
                                            Sign Up
                                </Link></li>
                                    </ul>
                                    :
                                    <ul class="right hide-on-med-and-down">
                                        <li>
                                            <Link to={{
                                                pathname: "/cart",
                                                search: "user=" + this.props.auth.user.id
                                            }}style={{ width:"70px" }}
                                            className="waves-effect waves-light btn">
                                                <i className="material-icons"
                                                style={{ textAlign: "left" }}>shopping_cart</i>
                                                <label
                                                className="btn-floating halfway-fab waves-effect waves-light white"
                                                style={{
                                                    height: "20px",
                                                    width: "20px", 
                                                    bottom: "8px", 
                                                    right: "8px",
                                                    lineHeight: "20px",
                                                    color: "black"
                                                }}
                                                >
                                                    { this.state.countOfCartItems }
                                                </label>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link onClick={this.props.logoutUser} 
                                            className="waves-effect waves-light btn">
                                                <i className="material-icons">exit_to_app</i>
                                            </Link>
                                        </li>
                                    </ul>
                            }
                        </div>
                    </nav>
                </div>
                {
                    !this.props.auth.isAuthenticated ?
                        <SideNav /> :
                        <AuthSideNav
                            user={this.props.auth.user}
                            logoutUser={this.props.logoutUser}
                            userImage={this.state.userImage}
                        />
                }
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
)(Navbar);
