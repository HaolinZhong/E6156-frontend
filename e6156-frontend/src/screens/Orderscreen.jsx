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
import sample from '../sample.jpg'


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
            const clientId = 'AWvj93j8QoiveKdFbAeaM-XYyJ95JLCvAGhH0bCzLereGq5QcZAX7lnoCLCUlrhpnslKN7h98GBjXUOL';
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onLoad = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }

        if (!order || successPay) {
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
                <h1>Order {order.orderinfo.orderid}</h1>
                <Row>
                    <Col md={7}>
                        <ListGroup variant='flush'>
                            <ListGroupItem className="my-2">
                                <h2 className="my-2">Shipping</h2>
                                <p><strong>Email: </strong> <a href={`mailto:${order.orderinfo.email}`}>{order.orderinfo.email}</a></p>
                                <p>
                                    <strong>Address: </strong>
                                    {order.orderinfo.shipping_info}
                                </p>
                            </ListGroupItem>
                            <ListGroupItem className="my-2">
                                <h2 className="my-2">Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.orderinfo.billing_info}
                                </p>
                            </ListGroupItem>
                            <ListGroupItem className="my-2">
                                <h2 className="my-2">Order Items</h2>
                                {order.orderline.length === 0 ? <Message>Order is empty.</Message> : (
                                    <ListGroup variant='flush' className="my-2">
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroupItem key={index} className="my-2">
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image ? item.image : sample} alt={item.name} fluid rounded />
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
                                        <Col>Total</Col>
                                        <Col>${order.orderinfo.total}</Col>
                                    </Row>
                                </ListGroupItem>
                                {!order.isPaid && (
                                    <ListGroupItem>
                                        {loadingPay && <Loader />}
                                        {!sdkReady ? <Loader /> : (
                                            <PayPalButton
                                                amount={order.orderinfo.total}
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