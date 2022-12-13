import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import products from '../products'
import Product from './Product'

const Homescreen = () => {
    return (
        <Container>
            <h1>Latest Products</h1>
            <Row>
                {products.map((product) => {
                    return (
                        <Col sm={12} md={6} lg={4} xl={3}>
                            <Product product={product}></Product>
                        </Col>
                    )

                })}
            </Row>
        </Container>
    )
}

export default Homescreen