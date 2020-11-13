import React, { Component } from 'react';
import Vaccine from '../images/pendingStamp.jpg';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';

class OrderItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            holderClass: "active",
            alert: null
        };
    }

    onCancelOrder = () => {
        const getAlert = () => (
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes"
                confirmBtnBsStyle="default"
                cancelBtnBsStyle="default"
                title="Are you sure"
                onConfirm={this.onConfirm.bind(this)}
                onCancel={this.onCancelDelete.bind(this)}
            >
                Do you want to cancel this order?
        </SweetAlert>
        );
        this.setState({
            alert: getAlert()
        });
    }

    onConfirm = () => {
        const data = {
            id: this.props.id,
            orderNumber: this.props.orderNumber,
            shopkeeperId: this.props.shopkeeperId,
            quantity: this.props.quantity
        };
        axios.put('/api/shopping/cancelorder', data)
            .then(res => {
                this.props.onUpdatedOrders(res.data.updatedUser.shopping.recent_orders);
            })
            .catch(err => console.log(err));

        this.setState({ alert: null });
    }

    onCancelDelete = () => {
        this.setState({
            alert: null
        });
    }

    render() {
        let expected = "";
        if(this.props.delivered === "no")expected = " ( Expected Date )";
        return (
            <div className="col s12">
                <div class="card horizontal">
                    <div class="card-image">
                        <img src={Vaccine} style={{ height: "50vh", width: "22vw" }} />
                    </div>
                    <div class="card-stacked">
                        <div class="card-content">
                            <div className="col s2">
                                <label>OrderNo.</label>
                            </div>
                            <div className="col s10">
                                <input
                                    type="text"
                                    value={this.props.orderNumber}
                                    style={{
                                        backgroundColor: "#eee",
                                        borderBottom: "0px",
                                        paddingLeft: "1rem",
                                        color: "black"
                                    }}
                                    disabled
                                />
                            </div>
                            <div className="col s2">
                                <label>ShopName</label>
                            </div>
                            <div className="col s10">
                                <input
                                    type="text"
                                    value={this.props.shopName}
                                    style={{
                                        backgroundColor: "#eee",
                                        borderBottom: "0px",
                                        paddingLeft: "1rem",
                                        color: "black"
                                    }}
                                    disabled
                                />
                            </div>
                            <div className="col s2">
                                <label>ShopAddress</label>
                            </div>
                            <div className="col s10">
                                <input
                                    type="text"
                                    value={this.props.shopAddress}
                                    style={{
                                        backgroundColor: "#eee",
                                        borderBottom: "0px",
                                        paddingLeft: "1rem",
                                        color: "black"
                                    }}
                                    disabled
                                />
                            </div>
                            <div className="col s2">
                                <label>Quantity</label>
                            </div>
                            <div className="col s2">
                                <input
                                    type="Number"
                                    value={this.props.quantity}
                                    style={{
                                        backgroundColor: "#eee",
                                        borderBottom: "0px",
                                        paddingLeft: "1rem",
                                        color: "black"
                                    }}
                                    disabled
                                />
                            </div>
                            <div className="col s2 offset-s1">
                                <label>Total Price ( in Rs. )</label>
                            </div>
                            <div className="col s5">
                                <input
                                    type="Number"
                                    value={this.props.price}
                                    style={{
                                        backgroundColor: "#eee",
                                        borderBottom: "0px",
                                        paddingLeft: "1rem",
                                        color: "black"
                                    }}
                                    disabled
                                />
                            </div>
                            <div className="col s2">
                                <label>ShippingInfo.</label>
                            </div>
                            <div className="col s10">
                                <input
                                    type="text"
                                    value={
                                        this.props.shippingAddress + " ( Mobile: " +
                                        this.props.contactNumber + " )"
                                    }
                                    style={{
                                        backgroundColor: "#eee",
                                        borderBottom: "0px",
                                        paddingLeft: "1rem",
                                        color: "black"
                                    }}
                                    disabled
                                />
                            </div>
                            <div className="col s2">
                                <label>DateOfOrder</label>
                            </div>
                            <div className="col s2 m2">
                                <input
                                    type="text"
                                    value={this.props.dateOfOrder.slice(0, 15)}
                                    style={{
                                        backgroundColor: "#eee",
                                        borderBottom: "0px",
                                        paddingLeft: "1rem",
                                        color: "black",
                                        paddingRight: "1rem"
                                    }}
                                    disabled
                                />
                            </div>
                            <div className="col s2 offset-s1">
                                <label>DateOfDelivery</label>
                            </div>
                            <div className="col s5">
                                <input
                                    type="text"
                                    value={
                                        this.props.dateOfDelivery.slice(0, 15) +
                                        expected
                                    }
                                    style={{
                                        backgroundColor: "#eee",
                                        borderBottom: "0px",
                                        paddingLeft: "1rem",
                                        color: "black"
                                    }}
                                    disabled
                                />
                            </div>
                            <div className="col s2.5">
                                {
                                    this.props.delivered === "no" ?
                                        <button
                                            style={{
                                                width: "190px",
                                                borderRadius: "3px",
                                                letterSpacing: "1.5px",
                                                marginTop: "1rem",
                                                marginLeft: "8.5rem"
                                            }}
                                            onClick={this.onCancelOrder}
                                            className="btn btn-large waves-effect waves-light hoverable red accent-3"
                                        >
                                            Cancel Order
                                        </button>
                                        :
                                        <button
                                            style={{
                                                width: "190px",
                                                borderRadius: "3px",
                                                letterSpacing: "1.5px",
                                                marginTop: "1rem",
                                                marginLeft: "8.5rem"
                                            }}
                                            className="btn btn-large waves-effect waves-light hoverable #06962d accent-3"
                                        >
                                            Delivered
                                        </button>
                                }{this.state.alert}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default OrderItem;
