import React from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'

const Header = () => {
    return (
        <header>
            <Navbar bg="light" variant="light" expand="lg" collapseOnSelect sticky='top'>
                <Container>
                    <Navbar.Brand href="/">CloudShop</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="/cart"><i className='fas fa-shopping-cart' />cart</Nav.Link>
                            <Nav.Link href="/signIn"><i className='fas fa-user' />sign in</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>

    )
}

export default Header