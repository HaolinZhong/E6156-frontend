import React, { useEffect } from 'react'
import { Button, Card, Col, Container, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import { createOrder } from '../actions/orderActions'
import sample from '../sample.jpg'


const Placeorderscreen = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)
    const user = useSelector(state => state.userLogin.userInfo)

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    cart.itemsPrice = addDecimals(Number(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)))
    cart.totalPrice = addDecimals(Number(cart.itemsPrice))

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    useEffect(() => {
        if (success) {
            navigate(`/orders/${order.orderid}`)
        }
    }, [navigate, success, order])


    const placeOrderHandler = () => {
        dispatch(
            createOrder({
                billing_info: cart.paymentMethod,
                email: user.email,
                shipping_info: `${cart.shippingAddress.address},${cart.shippingAddress.city},${cart.shippingAddress.stateName},${cart.shippingAddress.postalCode}`,
                orderItems: cart.cartItems,
                totalPrice: cart.totalPrice
            })
        )
    }

    return (
        <Container>
            <CheckoutSteps s1 s2 s3 s4 />
            <Row>
                <Col md={7}>
                    <ListGroup variant='flush'>
                        <ListGroupItem className="my-2">
                            <h2 className="my-2">Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {cart.shippingAddress.address},{cart.shippingAddress.city},{cart.shippingAddress.stateName},{cart.shippingAddress.postalCode}
                            </p>
                        </ListGroupItem>
                        <ListGroupItem className="my-2">
                            <h2 className="my-2">Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroupItem>
                        <ListGroupItem className="my-2">
                            <h2 className="my-2">Order Items</h2>
                            {cart.cartItems.length === 0 ? <Message>Your cart is empty.</Message> : (
                                <ListGroup variant='flush' className="my-2">
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroupItem key={index} className="my-2">
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image ? item.image : sample} alt={sample} fluid rounded />
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
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                {error && <Message variant='danger'>{error}</Message> }
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Button
                                        type='button'
                                        className='btn-block'
                                        disabled={cart.cartItems === 0}
                                        onClick={placeOrderHandler}
                                    >
                                        Place Order
                                    </Button>
                                </Row>

                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Placeorderscreen