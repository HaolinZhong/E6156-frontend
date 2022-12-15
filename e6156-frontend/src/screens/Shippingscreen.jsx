import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Container, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'

import { saveShippingAddress } from '../actions/cartActions'

const Shippingscreen = () => {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        navigate('/payment')
    }



    return (
        <Container>
            <CheckoutSteps s1={true} s2={true} />
            <FormContainer>

                <h1 className='my-3'>Shipping Address</h1>

                <Form onSubmit={submitHandler}>

                    <FormGroup controlId='address' className='py-2'>
                        <FormLabel>Address</FormLabel>
                        <FormControl
                            type='text'
                            placeholder='Enter address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        >
                        </FormControl>
                    </FormGroup>

                    <FormGroup controlId='city' className='py-2'>
                        <FormLabel>City</FormLabel>
                        <FormControl
                            type='text'
                            placeholder='Enter city'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        >
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId='postalCode' className='py-2'>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl
                            type='text'
                            placeholder='Enter postal code'
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        >
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId='country' className='py-2'>
                        <FormLabel>Country</FormLabel>
                        <FormControl
                            type='text'
                            placeholder='Enter country'
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                        </FormControl>
                    </FormGroup>

                    <Button type='submit' variant='primary' className='my-3'>
                        Continue
                    </Button>
                </Form>

            </FormContainer>
        </Container>
    )
}

export default Shippingscreen