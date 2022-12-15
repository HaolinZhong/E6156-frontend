import React, { useEffect } from 'react'
import { Container, Row, Col, ListGroup, ListGroupItem, Image, Button, Form, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router'
import { addToCart, removeFromCart } from '../actions/cartActions'
import { Link } from 'react-router-dom'

const Cartscreen = () => {
    const params = useParams()
    const productId = params.id
    const location = useLocation()
    const navigate = useNavigate()

    const qty = location.search ? Number(location.search.split('=')[1]) : 1

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping')
    }

    return (
        <Container>
            <Row>
                <Col md={8}>
                    <h1 className='py-4'>shopping cart</h1>
                    {cartItems.length === 0 ?
                        <Message>Your cart is empty.</Message> :
                        <ListGroup variant='flush'>
                            {cartItems.map(item => (
                                <ListGroupItem key={item.name}>
                                    <Row>
                                        <Col md={2}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/products/${item.product}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={2}>${item.price}</Col>
                                        <Col md={2}>
                                            <Form.Select
                                                value={item.qty}
                                                onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                                                {
                                                    [...Array(item.countInStock).keys()].map(x => (
                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                    ))
                                                }
                                            </Form.Select>
                                        </Col>
                                        <Col md={2}>
                                            <Button
                                                type='button'
                                                variant='light'
                                                onClick={() => removeFromCartHandler(item.product)}
                                            >
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>

                                    </Row>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    }
                </Col>
                <Col md={4} className='py-3'>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroupItem>
                                <h2 className='my-2'>
                                    Subtotal ({(cartItems.reduce((acc, item) => acc + item.qty, 0))})
                                    items
                                </h2>
                                ${cartItems
                                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                                    .toFixed(2)}
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Button
                                        type='button'
                                        className='btn-block'
                                        disabled={cartItems.length === 0}
                                        onClick={checkoutHandler}
                                    >
                                        Proceed To Checkout
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

export default Cartscreen