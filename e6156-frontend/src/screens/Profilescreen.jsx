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
    console.log(orderList)
    const { loading: loadingOrders, error: errorOrders, orders } = orderList

    useEffect(() => {
        if (!userInfo) {
            navigate("/login")
            return
        }

        if (!orders || orders.length == 0) {
            dispatch(listMyorders(userInfo.email))
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
                                    <th>PAID</th>
                                    <th>DELIVERD</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt}</td>
                                        <td>{order.totalPrice}</td>
                                        <td>
                                            {order.isPaid ? order.paidAt.substring(0, 10) : (
                                                <i className='fas fa-times' style={{ color: "red" }}></i>
                                            )}
                                        </td>
                                        <td>
                                            {order.isDelivered ? order.deliverdAt.substring(0, 10) : (
                                                <i className='fas fa-times' style={{ color: "red" }}></i>
                                            )}
                                        </td>
                                        <td>
                                            <LinkContainer to={`/order/${order._id}`}>
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