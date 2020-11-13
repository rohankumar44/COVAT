import React, { Component } from 'react'
import axios from 'axios';
import M from 'materialize-css';
import ShopOrderItems from './ShopOrderItems';
import SweetAlert from 'react-bootstrap-sweetalert';

class ShopOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            activeColour: "#FF1744",
            recentColour: "white",
            activeText: "white",
            recentText: "black",
            pendingOrders: [],
            deliveredOrders: [],
            alert: null,
            data: null
        };
    }

    componentDidMount = () => {
        var ele = document.querySelectorAll('.tabs');
        var instance = M.Tabs.init(ele, {});
        const query = new URLSearchParams(this.props.location.search);
        const _id = query.get('user');
        axios.get('/api/shopping/shopOrders/' + _id)
            .then(res => {
                const orders = res.data;
                const pendingOrders = [];
                const deliveredOrders = [];
                orders.map(order => {
                    if(order.delivered === "yes")deliveredOrders.push(order);
                    else pendingOrders.push(order);
                });
                this.setState({
                    id: _id,
                    pendingOrders: pendingOrders,
                    deliveredOrders: deliveredOrders
                });
            })
            .catch(err => console.log(err));
    }

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

    onOrderClicked = (e) => {
        const getAlert = () => (
            <SweetAlert
                info
                showCancel
                confirmBtnText="Yes"
                confirmBtnBsStyle="default"
                cancelBtnBsStyle="default"
                title="Are you sure"
                onConfirm={this.onConfirm.bind(this)}
                onCancel={this.onCancelDelete.bind(this)}
            >
                Do you want to mark this item as delivered?
        </SweetAlert>
        );
        this.setState({
            data: e.data,
            alert: getAlert()
        });
    }

    onConfirm = () => {
        axios.put('/api/shopping/onOrderDelivery', {
            id: this.state.id,
            orderNumber: this.state.data.orderNumber, 
            dateOfDelivery: new Date(Date.now()).toString()
        })
            .then(res => {
                const orders = res.data;
                const pendingOrders = [];
                const deliveredOrders = [];
                orders.map(order => {
                    if(order.delivered === "yes")deliveredOrders.push(order);
                    else pendingOrders.push(order);
                });
                this.setState({
                    pendingOrders: pendingOrders,
                    deliveredOrders: deliveredOrders,
                    data: null,
                    alert: null
                });
            })
            .catch(err => console.log(err));
    }

    onCancelDelete = () => {
        this.setState({
            alert: null
        })
    }

    render() {
        return (
            <div className="container" style={{ minHeight: "70vh", width: "100%" }}>
                <div className="col s12" style={{ marginTop: "1rem" }}>
                    <ul class="tabs tabs-fixed-width tab-demo z-depth-1">
                    <li class="tab" 
                            style={{fontWeight: "bold", backgroundColor: this.state.activeColour}}
                        >
                            <a class="active" 
                                href="#activeOrders" 
                                style={{ color: this.state.activeText, letterSpacing: "1px"}}
                                onClick ={this.changeColour}
                            >
                                Pending Orders
                            </a>
                        </li>
                        <li class="tab" style={{
                            fontWeight: "bold", 
                            backgroundColor: this.state.recentColour
                            }}
                        >
                            <a href="#recentOrders" 
                                style={{ color: this.state.recentText, letterSpacing: "1px"}}
                                onClick={this.changeColour}
                            >
                                Delivered Orders
                            </a>
                        </li>
                    </ul>
                    <div id="activeOrders" class="col s12" style={{ marginTop: "1rem" }}>
                        <ShopOrderItems 
                            orders = {this.state.pendingOrders} 
                            alert={this.state.alert}
                            onOrderClicked={this.onOrderClicked.bind(this)}
                        />
                    </div>
                    <div id="recentOrders" class="col s12" style={{ marginTop: "1rem" }}>
                        <ShopOrderItems orders = {this.state.deliveredOrders} />
                    </div>
                </div>
            </div>
        )
    }
}

export default ShopOrders;
