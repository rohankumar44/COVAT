import React from 'react';
import facebook from '../images/facebook.jpeg';
import youtube from '../images/youtube.png';
import linkedin from '../images/linkedin4.jpg';
import instagram from '../images/instagram.jpg';

export default function Footer() {
    return (
        <footer class="page-footer" style={{ backgroundColor: '#161716', marginTop: "6rem" }}>
          <div class="container">
            <div class="row">
              <div class="col l6 s12">
                <div class = "col l2 s12">
                  <i class="medium material-icons">people</i>
                  <h5>3000 +</h5>
                  <h6 style={{paddingLeft: "4px"}}>USERS</h6>
                </div>
                <div class = "col l2 offset-l1 s12">
                  <i class="medium material-icons">home</i>
                  <h5>1000 +</h5>
                  <h6 style={{paddingLeft: "2px"}}>STORES</h6>
                </div>
                <div class = "col l2 offset-l1 s12">
                  <i class="medium material-icons">verified_user</i>
                  <h5>8000 +</h5>
                  <h6 style={{paddingLeft: "0px"}}>ORDERS</h6>
                </div>
                <div class = "col l2 offset-l1 s12">
                  <i class="medium material-icons">time_to_leave</i>
                  <h5>5000 +</h5>
                  <h6 style={{paddingLeft: "0px"}}>DELIVERIES</h6>
                </div>
              </div>
              <div class="col l4 offset-l2 s12">
                <h6 class="white-text" style={{ textDecoration: "underline" }}>Contact Us</h6>
                <ul>
                  <li>
                    <a class="grey-text text-lighten-1" href="#!">
                      NATIONAL INSTITUTE OF TECHNOLOGY JAMSHEDPUR
                    </a>
                  </li>
                  <li>
                    <a class="grey-text text-lighten-1" href="#!">
                      P.O: NIT Jamshedpur, Jharkhand, India, PIN: 831014
                    </a>
                  </li>
                  <li>
                    <a class="grey-text text-lighten-1" href="#!">
                      Developer: +91-657-237-4108(O)
                    </a>
                  </li>
                  <li>
                    <a class="grey-text text-lighten-1" href="#!" style={{paddingLeft: "5rem"}}>
                      +91-657-237-3246(Fax)
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer-copyright">
            <div class="container">
            © 2020 WeAreWe NIT JAMSHEDPUR - all rights reserved
            <a class="grey-text text-lighten-4 right" href="#!" style={{paddingLeft: "2rem"}}>
              <img src={facebook} 
              style={{
                width: "30px",
                height: "30px"
              }}
              />
            </a>
            <a class="grey-text text-lighten-4 right" href="#!" style={{paddingLeft: "2rem"}}>
              <img src={youtube} 
              style={{
                width: "30px",
                height: "30px"
              }}
              />
            </a>
            <a class="grey-text text-lighten-4 right" href="#!" style={{paddingLeft: "2rem"}}>
              <img src={linkedin} 
              style={{
                width: "30px",
                height: "30px"
              }}
              />
            </a>
            <a class="grey-text text-lighten-4 right" href="#!">
              <img src={instagram} 
              style={{
                width: "30px",
                height: "30px"
              }}
              />
            </a>
            </div>
          </div>
        </footer>
    )
}
