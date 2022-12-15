import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Button, Col, Form, FormControl, FormGroup, FormLabel, ListGroup, Row} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {useLocation, useNavigate} from 'react-router'
import FormContainer from '../components/FormContainer'
import {login, googleLogin} from '../actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import GoogleButton from 'react-google-button'

const LoginScreen = () => {

    let location = useLocation()
    let navigate = useNavigate()

    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const userLogin = useSelector((state) => state.userLogin)
    const {loading, error, userInfo} = userLogin

    const redirect = location.search ? location.search.split('=')[1] : ""

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    const googleLoginHandler = (e) => {
        e.preventDefault()
        dispatch(googleLogin())
    }


    return (
        <FormContainer className='mx-1'>
            <h1 className='my-4'>Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader/>}
            <Row>
                <Col md={6}>
                    <h5 className='my-1'>Sign in with account & password</h5>
                    <Form onSubmit={submitHandler}>
                        <FormGroup controlId='email' className='py-2'>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            >
                            </FormControl>
                        </FormGroup>
                        <FormGroup controlId='password' className='py-2'>
                            <FormLabel>Password</FormLabel>
                            <FormControl
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            >
                            </FormControl>
                        </FormGroup>
                        <Button type='submit' variant='primary' className='my-3'>
                            Sign In
                        </Button>
                    </Form>
                    <Row>
                        <Col>
                            New Customer?{' '}
                            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                        </Col>

                    </Row>
                </Col>
                <Col md={1}></Col>
                <Col md={5}>
                    <h5 className='my-1'>Sign in with third party account</h5>
                        <GoogleButton onClick={googleLoginHandler} className='my-4' />
                </Col>

            </Row>

        </FormContainer>
    )
}

export default LoginScreen