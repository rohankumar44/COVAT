import React, { Component } from 'react'
import M from "materialize-css";
import { Link } from 'react-router-dom';
import Background from '../images/background.jpg';

class AuthSideNav extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        var elems = document.querySelectorAll('.sidenav');
        const options = {};
        var instances = M.Sidenav.init(elems, options);
    }

    render() {
        return (
            <div>
                <ul id="slide-out" class="sidenav">
                    <li><div class="user-view">
                        <div class="background">
                            <img src={Background} />
                        </div>
                        <Link class="sidenav-close" to={{
                            pathname: "/profile",
                            search: "user=" + this.props.user.id
                        }}><img class="circle" src={this.props.userImage}
                            /></Link>
                        <Link class="sidenav-close" to={{
                            pathname: "/profile",
                            search: "user=" + this.props.user.id
                        }}><span class="white-text name">{this.props.user.name}</span></Link>
                        <Link class="sidenav-close" to={{
                            pathname: "/profile",
                            search: "user=" + this.props.user.id
                        }}><span class="white-text email"> {this.props.user.email} </span></Link>
                    </div></li>
                    <li><div class="divider"></div></li>
                    <li><Link class="sidenav-close" to="/">HOME</Link></li>
                    <li><Link class="sidenav-close" to={{
                        pathname: "/dashboard"
                    }}>DASHBOARD</Link></li>
                    <li><Link class="sidenav-close" to={{
                        pathname: "/orders",
                        search: "user=" + this.props.user.id
                    }}>YOUR ORDERS</Link></li>
                    <li><Link class="sidenav-close" to={{
                        pathname: "/profile",
                        search: "user=" + this.props.user.id
                    }}>PROFILE</Link></li>
                    {
                        this.props.user.shopkeeper === "yes" ?
                            <div>
                                <li><Link class="sidenav-close" to={{
                                    pathname: "/shop/orders",
                                    search: "user=" + this.props.user.id
                                }}>SHOP ORDERS</Link></li>
                                <li><Link class="sidenav-close" to={{
                                    pathname: "/shop",
                                    search: "user=" + this.props.user.id
                                }}>SHOP DETAILS</Link></li>
                            </div>
                            : null
                    }
                    <li>
                        <Link class="sidenav-close" onClick={this.props.logoutUser}>
                            LOGOUT
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }
}

export default AuthSideNav;
