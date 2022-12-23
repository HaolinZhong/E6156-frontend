import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { listMyorders } from '../actions/orderActions'

const Profilescreen = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderList = useSelector(state => state.orderList)
    const { loading: loadingOrders, error: errorOrders, orders } = orderList

    useEffect(() => {
        if (!userInfo) {
            navigate("/login")
            return
        }

        if (!orders || orders.length == 0) {
            dispatch(listMyorders(userInfo.email))
            console.log(orderList)
            return
        }

    }, [dispatch, navigate, userInfo, orders])

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <h2 className='my-2'>My Orders</h2>
                    {loadingOrders ? <Loader /> : errorOrders ? (
                        <Message variant='danger'>{errorOrders}</Message>
                    ) : orders.length === 0 ? (
                        <Message>You have no history orders.</Message>
                    ) : (
                        <Table striped bordered hover responsive className='table-sm my-3'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>BILLING</th>
                                    <th>SHIPPING</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.orderid}>
                                        <td>{order.orderid}</td>
                                        <td>{order.order_date}</td>
                                        <td>{order.total}</td>
                                        <td>{order.billing_info}</td>
                                        <td>{order.shipping_info}</td>
                                        <td>
                                            <LinkContainer to={`/orders/${order.orderid}`}>
                                                <Button variant='light' className='btn-sm'>Details</Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default Profilescreen