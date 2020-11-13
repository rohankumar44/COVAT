import React, { Component } from 'react'
import M from "materialize-css";
import { Link } from 'react-router-dom';
import Background from '../images/background.jpg';
import defaultImage from '../images/defaultImage.png';

class SideNav extends Component {
    componentDidMount = () => {
        var elems = document.querySelectorAll('.sidenav');
        const options ={};
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
                        <img class="circle" src={defaultImage} 
                        style={{ width: "auto" }}/>
                        <span class="white-text name">COVAT - Vaccine Tracker</span>
                        <span class="white-text email"></span>
                        <span class="white-text email"></span>
                    </div></li>
                    <li><div class="divider" style={{ marginTop: "12px" }}></div></li>
                    <li><Link class="sidenav-close" to="/">HOME</Link></li>
                    <li><Link class="sidenav-close" to="/login">SIGN IN</Link></li>
                    <li><Link class="sidenav-close" to="/register">SIGN UP</Link></li>
                </ul>
            </div>
        )
    }
}

export default SideNav;
