const express = require("express");
const router = express.Router();
const validateOrder = require("../../validation/validateOrder");
const User = require("../../models/User");

router.get('/', (req,res) => {
    User.find()
        .then(users => {
            const user = users[0];
            console.log(user);
            res.status(200).json(users);
        })
        .catch(err => console.log(err));
});

router.post('/placeorder', (req,res) => {

    const { errors, isValid } = validateOrder(req.body);
  
    if (!isValid) {
      return res.status(400).json(errors);
    }    

    User.findOne({_id: req.body.id}).then(user => {
        const newOrder = {
            name: user.name,
            shopkeeperId: req.body.shopkeeperId,
            shopName: req.body.shopName,
            shopAddress: req.body.shopAddress,
            price: req.body.price,
            shippingAddress: req.body.shippingAddress,
            dateOfOrder: req.body.dateOfOrder,
            quantity: req.body.quantity,
            contactNumber: req.body.contactNumber
        };
        User.findOne({ _id: req.body.shopkeeperId })
            .then(shopkeeper => {
                shopkeeper.available -= parseInt(req.body.quantity);
                shopkeeper.sold += parseInt(req.body.quantity);
                shopkeeper.save()
                    .then(updatedShopkeeper => {
                        user.shopping.recent_orders.push(newOrder);
                        user.save()
                            .then(updatedUser => res.status(200).json({
                                updatedUser: updatedUser,
                                updatedShopkeeper: updatedShopkeeper
                            }))
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            })
    });
});

router.put('/cart', (req,res) => {
    User.findOne({_id: req.body.id}).then(user => {
        const newItem = {
            shopkeeperId: req.body.shopkeeperId,
            shopName: req.body.shopName,
            shopAddress: req.body.shopAddress,
            price: req.body.price,
            available: req.body.available,
            shippingAddress: req.body.shippingAddress
        };
        user.coordinates = [ req.body.latitude, req.body.longitude ];
        user.shopping.cart.push(newItem);
        user.save()
            .then(updatedUser => res.status(200).json(updatedUser))
            .catch(err => console.log(err));
    });
});
 
router.put('/cartItem', (req,res) => {
    User.findOne({ _id: req.body.id }).then(user => {
        const newCart = user.shopping.cart.filter((e) => e._id != req.body.orderNumber);
        user.shopping.cart = newCart;
        user.save()
            .then(updatedUser => res.status(200).json(updatedUser))
            .catch(err => console.log(err));
    })
});

router.put('/cancelorder', (req,res) => {
    User.findOne({ _id: req.body.id })
        .then(user => {
            User.findOne({ _id: req.body.shopkeeperId })
                .then(shopkeeper => {
                    shopkeeper.available += parseInt(req.body.quantity);
                    shopkeeper.sold -= parseInt(req.body.quantity);

                    const newOrders = user.shopping.recent_orders.filter(
                        (e) => e._id != req.body.orderNumber);
                    user.shopping.recent_orders = newOrders;

                    shopkeeper.save()
                        .then(updatedShopkeeper => {
                            user.save()
                                .then(updatedUser => res.status(200).json({
                                    updatedUser: updatedUser,
                                    updatedShopkeeper: updatedShopkeeper
                                }))
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

router.get('/shopOrders/:id', (req,res)=> {
    User.find().then(users => {
        const shopOrders = [];
        users.map(user => {
            user.shopping.recent_orders.map(
                (e) => {
                    if(e.shopkeeperId === req.params.id)shopOrders.push(e);
                });
        });
        res.status(200).json(shopOrders);
    })
    .catch(err => console.log(err));
});

router.put('/onOrderDelivery', (req,res) => {
    User.find()
        .then(users => {
        const allOrders = [];
        users.map(user => {
            const updatedOrders = [];
            user.shopping.recent_orders.map(order => {
                if(order._id.toString() === req.body.orderNumber){
                    order.delivered = "yes";
                    order.dateOfDelivery = req.body.dateOfDelivery
                }
                updatedOrders.push(order);
                if(req.body.id === order.shopkeeperId) {
                    allOrders.push(order);
                }
            }); 
            user.shopping.recent_orders = updatedOrders;
            user.save()
                .then()
                .catch(err=> console.log(err));
        });
        res.status(200).json(allOrders);
    })
    .catch(err => console.log(err));
});

module.exports = router;