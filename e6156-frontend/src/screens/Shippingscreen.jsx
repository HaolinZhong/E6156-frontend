import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Container, Form, FormControl, FormGroup, FormLabel, Dropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'

import { saveShippingAddress } from '../actions/cartActions'
import axios from "axios";
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';

const AsyncTypeahead = withAsync(Typeahead);

const Shippingscreen = () => {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [stateName, setStateName] = useState(shippingAddress.stateName)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, stateName }))
        navigate('/payment')
    }

    const searchHandler = (address) => {
        setIsLoading(true);
        const addrStr = `${address? address : ""}`
        fetch(`http://10.124.161.32:5014/autocomplete?address=${addrStr}`)
            .then((resp) => resp.json())
            .then((Response) => {
                if (Response.message) Response = []
                setOptions(Response);
                setIsLoading(false);
            });
    };

    const filterBy = () => true;

    return (
        <Container>
            <CheckoutSteps s1={true} s2={true} />
            <FormContainer>

                <h1 className='my-3'>Shipping Address</h1>

                <Form onSubmit={submitHandler}>

                    <FormGroup controlId='address' className='py-2'>
                        <FormLabel>Address</FormLabel>
                        <AsyncTypeahead
                            id="async-example"
                            value={address}
                            isLoading={isLoading}
                            labelKey={(options)=> `${options.street_line}, ${options.city}, ${options.state}`}
                            minLength={3}
                            onSearch={(address) => searchHandler(address)}
                            options={options}
                            onChange={(selected) => {
                                if (!Array.isArray(selected)) return
                                if (!selected[0]) return
                                setAddress(selected[0].street_line)
                                setCity(selected[0].city)
                                setPostalCode(selected[0].zipcode)
                                setStateName(selected[0].state)
                            }}
                            placeholder="Enter your address..."
                        />
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
                    <FormGroup controlId='state' className='py-2'>
                        <FormLabel>State</FormLabel>
                        <FormControl
                            type='text'
                            placeholder='Enter state'
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
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

                    <Button type='submit' variant='primary' className='my-3'>
                        Continue
                    </Button>
                </Form>

            </FormContainer>
        </Container>
    )
}

export default Shippingscreen