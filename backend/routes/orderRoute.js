import express from 'express'
import {placeOrder,updateStatus,placeOrderStripe,placeOrderRazorpay,allOrder,userOrder, verifyStripe} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
const orderRouter = express.Router()


// admin features

orderRouter.post('/list',adminAuth,allOrder)
orderRouter.post('/status',adminAuth,updateStatus)

// payment features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

// User features
orderRouter.post('/userorders',authUser,userOrder)

//verify payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)

export default orderRouter