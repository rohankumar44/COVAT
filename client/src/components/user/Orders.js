import React, { Component } from 'react';
import OrderItem from './OrderItem';
import axios from 'axios';
import M from 'materialize-css';
import NotFoundImage from '../images/noData.png';

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            orders: [],
            previousOrders: [],
            activeColour: "#FF1744",
            recentColour: "white",
            activeText: "white",
            recentText: "black"
        }
    }

    componentDidMount = () => {
        var ele = document.querySelectorAll('.tabs');
        var instance = M.Tabs.init(ele, {});
        const query = new URLSearchParams(this.props.location.search);
        const _id = query.get('user');
        axios.get('/api/users/userdetails/' + _id)
            .then(res => {
                const activeOrders = [], previousOrders = [];
                 res.data.shopping.recent_orders.map(order => {
                    if(order.delivered === "no") activeOrders.push(order);
                    else previousOrders.push(order);
                });
                this.setState({
                    id: _id,
                    orders: activeOrders,
                    previousOrders: previousOrders
                });
            })
            .catch(err => console.log(err));
    };

    changeColour = () => {
        const newColour = this.state.activeColour;
        const newText = this.state.activeText;
        this.setState({
            activeColour: this.state.recentColour,
            activeText: this.state.recentText,
            recentColour: newColour,
            recentText: newText
        });
    }

    onUpdatedOrders = (data) => {
        const activeOrders = [], previousOrders = [];
        data.map(order => {
            if(order.delivered === "no") activeOrders.push(order);
            else previousOrders.push(order);
        });
        this.setState({
            orders: activeOrders,
            previousOrders: previousOrders
        });
    }



    render() {
        return (
            <div className="container" style={{ minHeight: "70vh" }}>
                <div className="row" style={{ marginTop: "1rem" }}>
                    <ul class="tabs tabs-fixed-width tab-demo z-depth-1">
                        <li class="tab" 
                            style={{fontWeight: "bold", backgroundColor: this.state.activeColour}}
                        >
                            <a class="active" 
                                href="#activeOrders" 
                                style={{ color: this.state.activeText, letterSpacing: "1px"}}
                                onClick ={this.changeColour}
                            >
                                Active Orders
                            </a>
                        </li>
                        <li class="tab" style={{fontWeight: "bold", backgroundColor: this.state.recentColour}}>
                            <a href="#recentOrders" 
                                style={{ color: this.state.recentText, letterSpacing: "1px"}}
                                onClick={this.changeColour}
                            >
                                Previous Orders
                            </a>
                        </li>
                    </ul>
                    <div id="activeOrders" class="col s12">
                        {
                            this.state.orders.length ?
                                this.state.orders.map(item => (  
                                    <OrderItem
                                        shopkeeperId={item.shopkeeperId}
                                        id={this.state.id}
                                        orderNumber={item._id}
                                        price={item.price}
                                        shopName={item.shopName}
                                        shopAddress={item.shopAddress}
                                        quantity={item.quantity}
                                        dateOfOrder={item.dateOfOrder}
                                        dateOfDelivery={item.dateOfDelivery}
                                        shippingAddress={item.shippingAddress}
                                        contactNumber={item.contactNumber}
                                        onUpdatedOrders={this.onUpdatedOrders.bind(this)}
                                        delivered={item.delivered}
                                    />
                                )) : 
                                <div className="col s12 center-align">
                                    <img src={NotFoundImage} style={{ width: "90%", marginTop: "1rem" }} />
                                </div>
                        }
                    </div>
                    <div id="recentOrders" class="col s12">
                        <div className="col s12 center-align">
                            {
                                this.state.previousOrders.length ?
                                    this.state.previousOrders.map(item => (  
                                        <OrderItem
                                            shopkeeperId={item.shopkeeperId}
                                            id={this.state.id}
                                            orderNumber={item._id}
                                            price={item.price}
                                            shopName={item.shopName}
                                            shopAddress={item.shopAddress}
                                            quantity={item.quantity}
                                            dateOfOrder={item.dateOfOrder}
                                            dateOfDelivery={item.dateOfDelivery}
                                            shippingAddress={item.shippingAddress}
                                            contactNumber={item.contactNumber}
                                            onUpdatedOrders={this.onUpdatedOrders.bind(this)}
                                            delivered={item.delivered}
                                        />
                                    ))
                                : 
                                <div className="col s12 center-align">
                                    <img src={NotFoundImage} style={{ width: "90%", marginTop: "1rem" }} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Orders;
