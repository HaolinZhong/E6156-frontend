import axios from "axios"
import { ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_LIST_FAIL, ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_PAY_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS } from "../constants/orderConstants"

const base = "http://compositeapplication-env-1.eba-86pdxb9q.us-east-1.elasticbeanstalk.com"
const order = "http://ordermicroservice-env.eba-p53mr9ym.us-east-1.elasticbeanstalk.com"

export const createOrder = (newOrder) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST
        })


        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        console.log(newOrder)

        const {billing_info, email, shipping_info, orderItems} = newOrder


        const { data } = await axios.post(`${base}/order`, {billing_info, email, shipping_info}, config)

        const orderid = data.orderinfo.orderid


        for (const item of orderItems) {
            const {product, price, qty} = item
            await axios.post(`${base}/order/${orderid}/orderline`, {itemid: product, price, amount: qty}, config)
        }

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data.orderinfo
        })

    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        })
    }
}


export const getOrderDetails = (orderId) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST
        })
        
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`/api/orders/${orderId}`, config)

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        })
    }
}


export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_PAY_REQUEST
        })
        
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config)

        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        })
    }
}

export const listMyorders = (email) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_REQUEST
        })

        const { data } = await axios.get(`${order}/order/${email}`)
        console.log(data)

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data.results
        })

    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        })
    }
}