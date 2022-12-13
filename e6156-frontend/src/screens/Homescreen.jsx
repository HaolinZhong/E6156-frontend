import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../components/Product'
import mock_products from "../products";
import axios from 'axios';

const Homescreen = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const {data} = await axios.get('/api/products');
            if (data) {
                setProducts(data);
            } else {
                setProducts(mock_products);
            }

        }

        fetchProducts();
    }, []);

    return (
        <Container>
            <h1>Latest Products</h1>
            <Row>
                {products.map((product) => {
                    return (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product}></Product>
                        </Col>
                    )

                })}
            </Row>
        </Container>
    )
}

export default Homescreen