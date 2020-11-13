import React, { Component } from 'react';
import Vaccine from '../images/vaccine1.jpg';
import classnames from "classnames";
import axios from 'axios';

class CartItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactnumber: null,
            address: this.props.shippingAddress,
            quantity: 1,
            holderClass: "active",
            errors: {}
        };
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value, errors:{} });
    };

    onSubmit = e => {
        e.preventDefault();
        const newOrder = {
            id: this.props.id,
            shopName: this.props.shopName,
            shopAddress: this.props.shopAddress,
            price: this.props.price * this.state.quantity,
            shippingAddress: this.state.address,
            dateOfOrder: new Date(Date.now()).toString(),
            quantity: this.state.quantity,
            contactNumber: this.state.contactnumber,
            available: this.props.available,
            shopkeeperId: this.props.shopkeeperId
        };
        axios.post('/api/shopping/placeorder', newOrder)
            .then(res => {
                this.props.onPlaceOrder();
                this.onRemoveItem();
                this.setState({errors: {}});
            })
            .catch(err => this.setState({ errors: err.response.data }));
    };

    onRemoveItem = () => {
        axios.put('/api/shopping/cartItem', {
            id: this.props.id,
            orderNumber: this.props.orderNumber
        })
            .then(res => {
                this.props.onCartChange(res.data.shopping.cart);
            })
            .catch(err => console.log(err));
    }

    render() {
        const { errors } = this.state;
        return (
            <div className="col s12">
                <div class="card horizontal">
                    <div class="card-image">
                        <img src={Vaccine} style={{ height: "48vh" }} />
                    </div>
                    <div class="card-stacked">
                        <div class="card-content">
                            <form noValidate onSubmit={this.onSubmit} >
                                <div className="col s2">
                                    <label>
                                        ShopName
                                    </label>
                                </div>
                                <div className="col s10">
                                    <input
                                        value={this.props.shopName}
                                        type="text"
                                        style={{ 
                                            color: "black", 
                                            borderBottom: "0px", 
                                            backgroundColor: "#eee",
                                            paddingLeft: "1rem"  
                                        }}
                                        disabled
                                    />
                                </div>
                                <div className="col s2">
                                    <label>
                                        ShopAddress
                                    </label>
                                </div>
                                <div className="col s10">
                                    <input
                                        value={this.props.shopAddress}
                                        type="text"
                                        style={{ 
                                            color: "black", 
                                            borderBottom: "0px", 
                                            backgroundColor: "#eee",
                                            paddingLeft: "1rem"  
                                        }}
                                        disabled
                                    />
                                </div>
                                <div className="col s2">
                                    <label>
                                        Price
                                    </label>
                                </div>
                                <div className="col s3">
                                    <input
                                        value={this.props.price * this.state.quantity}
                                        id="price"
                                        type="Number"
                                        style={{ 
                                            color: "black", 
                                            borderBottom: "0px", 
                                            backgroundColor: "#eee",
                                            paddingLeft: "1rem"  
                                        }}
                                        disabled
                                    />
                                </div>
                                <div className="col s2 offset-s1">
                                    <label>
                                        No. Of Items
                                    </label>
                                </div>
                                <div className="col s4">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.quantity}
                                        error={errors.quantity}
                                        id="quantity"
                                        type="Number"
                                        min={0}
                                        max={this.props.available}
                                        style={{ 
                                            borderBottom: "0px", 
                                            backgroundColor: "#eee",
                                            paddingLeft: "1rem"  
                                        }}
                                        className={classnames("", {
                                            invalid: errors.quantity
                                        })}
                                    />
                                    <span className="red-text">{errors.quantity}</span>
                                </div>
                                <div className="col s2">
                                    <label>
                                        ContactNumber
                                    </label>
                                </div>
                                <div className="col s10">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.contactNumber}
                                        error={errors.contactNumber}
                                        id="contactnumber"
                                        type="text"
                                        style={{ 
                                            borderBottom: "0px", 
                                            backgroundColor: "#eee",
                                            paddingLeft: "1rem"  
                                        }}
                                        className={classnames("", {
                                            invalid: errors.contactNumber
                                        })}
                                    />
                                    <span className="red-text">{errors.contactNumber}</span>
                                </div>
                                <div className="col s2">
                                    <label>
                                        ShippingAddress
                                    </label>
                                </div>
                                <div className="col s10">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.address}
                                        error={errors.address}
                                        id="address"
                                        type="text"
                                        style={{ 
                                            borderBottom: "0px", 
                                            backgroundColor: "#eee",
                                            paddingLeft: "1rem" 
                                        }}
                                        className={classnames("", {
                                            invalid: errors.shippingAddress
                                        })}
                                    />
                                    <span className="red-text">{errors.shippingAddress}</span>
                                </div>
                                <div className="col s2.5">
                                    <button
                                        style={{
                                            width: "150px",
                                            borderRadius: "3px",
                                            letterSpacing: "1.5px",
                                            marginTop: "1rem",
                                            marginLeft: "8rem"
                                        }}
                                        onClick={this.onRemoveItem.bind(this)}
                                        className="btn btn-large waves-effect waves-light hoverable red accent-3"
                                    >
                                        Remove
                                </button>
                                </div>
                                <div className="col s2">
                                    <button
                                        style={{
                                            width: "190px",
                                            borderRadius: "3px",
                                            letterSpacing: "1.5px",
                                            marginTop: "1rem",
                                            marginLeft: "1rem"
                                        }}
                                        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                        type="submit"
                                    >
                                        Place Order
                                </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default CartItems;
