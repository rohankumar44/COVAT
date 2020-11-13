import React, { Component } from 'react';
import CartItems from './CartItems';
import axios from 'axios';
import NotFoundImage from '../images/noData.png';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            cart: []
        }
    }
    componentDidMount = () => {
        const query = new URLSearchParams(this.props.location.search);
        const _id = query.get('user')
        axios.get('/api/users/userdetails/' + _id)
            .then(res => {
                this.setState({
                    id: _id,
                    cart: res.data.shopping.cart
                });
            })
            .catch(err=> console.log(err));
    };

    onCartChange = (data) => {
        this.setState({
            cart: data
        });
        window.location.reload(false);
    }

    onPlaceOrder = () => {
        this.props.history.push({
            pathname: '/orders',
            search: 'user=' + this.state.id
        });
    }

    render() { 
        return (
            <div className="container" style={{ minHeight: "70vh" }}>
                <div className="row" style={{ marginTop: "1rem" }}>
                    {
                        this.state.cart.length ?
                        this.state.cart.map(item => (
                            <CartItems 
                                shopkeeperId = { item.shopkeeperId }
                                id = { this.state.id }
                                orderNumber= {item._id}
                                price = {item.price}
                                shopName = {item.shopName}
                                shopAddress = {item.shopAddress}
                                available = { item.available }
                                onCartChange = { this.onCartChange.bind(this) }
                                onPlaceOrder = { this.onPlaceOrder.bind(this) }
                                shippingAddress = { item.shippingAddress }
                            />
                        )) :
                        <div className="col s12 center-align">
                            <img 
                                src={NotFoundImage} 
                                style={{ width: "90%", marginTop: "1rem" }} 
                            />
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Cart;
