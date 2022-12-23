import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { PayPalButton } from 'react-paypal-button-v2'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import axios from 'axios'
import { ORDER_PAY_RESET } from '../constants/orderConstants'


const Orderscreen = () => {

    const dispatch = useDispatch()
    const params = useParams()

    const [sdkReady, setSdkReady] = useState(false)
    const orderId = params.id

    const cart = useSelector(state => state.cart)

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    useEffect(() => {

        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onLoad = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }

        if (!order || order.orderid !== orderId || successPay) {
            dispatch({type: ORDER_PAY_RESET})
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            } 
            setSdkReady(true)
        }
    }, [dispatch, orderId, order, successPay])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    } 

    return (

        loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            <Container>
                <h1>Order {order._id}</h1>
                <Row>
                    <Col md={7}>
                        <ListGroup variant='flush'>
                            <ListGroupItem className="my-2">
                                <h2 className="my-2">Shipping</h2>
                                <p><strong>Name: </strong> {order.user.name}</p>
                                <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                                <p>
                                    <strong>Address: </strong>
                                    {order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.postalCode},{order.shippingAddress.country}
                                </p>
                                {order.isDelivered ? <Message variant='success'>Delivered on {order.delieveredAt}</Message> : (
                                    <Message variant='danger'>Not Delivered</Message>
                                )}
                            </ListGroupItem>
                            <ListGroupItem className="my-2">
                                <h2 className="my-2">Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : (
                                    <Message variant='danger'>Not Paid</Message>
                                )}
                            </ListGroupItem>
                            <ListGroupItem className="my-2">
                                <h2 className="my-2">Order Items</h2>
                                {order.orderItems.length === 0 ? <Message>Order is empty.</Message> : (
                                    <ListGroup variant='flush' className="my-2">
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroupItem key={index} className="my-2">
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/products/${item.product}`}>{item.name}</Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} × ${item.price} = ${item.qty * item.price}
                                                    </Col>
                                                </Row>
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>

                                )}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col></Col>

                    <Col md={4}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroupItem>
                                    <h2 className='my-3'>Order Summary</h2>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroupItem>
                                {!order.isPaid && (
                                    <ListGroupItem>
                                        {loadingPay && <Loader />}
                                        {!sdkReady ? <Loader /> : (
                                            <PayPalButton
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}
                                            />
                                        )}
                                    </ListGroupItem>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )

    )
}

export default Orderscreen