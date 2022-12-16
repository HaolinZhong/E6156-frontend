import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import sample from '../sample.jpg'

const Product = ({product}) => {
  return (
    <Card className='my-3 p-3'>
        <Link to={`/products/${product.id}`}>
            <Card.Img src={product.image_url ? product.image_url : sample} variant="top"/>
        </Link>
        <Card.Body>
            <Link to={`/products/${product.id}`}>
                <Card.Title as="div">
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>

            <Card.Text as='div' className='my-3'>
                {product.description.slice(0, 24) + '...'}
            </Card.Text>

            <Card.Text as='h3'>${product.item_price}</Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Product