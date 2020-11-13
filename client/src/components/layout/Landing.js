import React, { Component } from 'react';
import logo from '../images/darkmap.jpg';
import dark from '../images/background.jpg';
import M from 'materialize-css';
import '../styleSheets/Landing.css';

class Landing extends Component {

    componentDidMount() {
        var elems = document.querySelectorAll('.slider');
        var instances = M.Slider.init(elems, {});
    }
    
    render() {
        return (
            <div className="row" >
                <div className="col s5" style={{ padding: "0px" }}>
                    <div className="slider">
                        <ul className="slides">
                            <li>
                                <img src={dark} />
                                <div className="caption right-align">
                                    <h3>Welcome To COVID-19 Vaccine Tracker</h3>
                                    <h5 className="light grey-text text-lighten-3">
                                        -> Make world corona free!
                                </h5>
                                </div>
                            </li>
                            <li>
                                <img src={dark} />
                                <div className="caption right-align">
                                    <h3>Spread Social Awareness</h3>
                                    <h5 className="light grey-text text-lighten-3">
                                        -> A vaccine is a substance that helps protect
                                        against certain diseases.
                                </h5>
                                </div>
                            </li>
                            <li>
                                <img src={dark} />
                                <div className="caption right-align">
                                    <h3>Maintain Social Distance</h3>
                                    <h5 className="light grey-text text-lighten-3">
                                        -> vaccines harness the natural activity of
                                        your immune system.
                                </h5>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col s7" style={{ padding: "0px" }}>
                    <img src={logo} style={{ height: "65vh", width: "100%" }} />
                </div>
            </div>
        )
    }
}
export default Landing;