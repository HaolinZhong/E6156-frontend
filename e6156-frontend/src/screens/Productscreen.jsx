import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Container, ListGroupItem, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import sample from '../sample.jpg'

const Productscreen = () => {
  const params = useParams()
  const dispatch = useDispatch()
  let navigate = useNavigate()

  const productDetails = useSelector(state => state.productDetails)
  const { loading, error, product } = productDetails

  useEffect(() => {
    dispatch(listProductDetails(params.id))
  }, [dispatch, params.id]);

  const [qty, setQty] = useState(1)

  const addToCartHandler = () => {
    navigate(`/cart/${params.id}?qty=${qty}`)
  }

  return (
    <Container>
      <Link className='btn btn-outline-dark my-3' to="/">GO BACK</Link>
      {loading ? <Loader /> : (
        error ? <Message variant='danger'>{error}</Message> : (
          <Row>
            <Col md={6}>
              <Image src={product.image_url ? product.image_url : sample} alt={product.name} fluid></Image>
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroupItem>Price: ${product.item_price}</ListGroupItem>
                <ListGroupItem>
                  Description: <br/>
                  {product.description}
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroupItem>
                    <Row>
                      <Col>Price:</Col>
                      <Col><strong>${product.item_price}</strong></Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col>Status:</Col>
                      <Col>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                    </Row>
                  </ListGroupItem>
                  {product.stock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col>Qty:</Col>
                        <Col>
                          <Form.Select
                            value={qty} 
                            onChange={(e) => setQty(e.target.value)}>
                            {
                              [...Array(product.stock).keys()].map(x => {
                                  return(<option key={x+1} value={x+1}>{x+1}</option>)
                                })
                            }
                          </Form.Select>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                  <ListGroupItem>
                    <Row>
                      <Button 
                        onClick={addToCartHandler}
                        className='btn-block' 
                        type="button" 
                        disabled={product.stock === 0}>
                        Add To Cart
                      </Button>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        )
      )}
    </Container>
  )
}

export default Productscreen