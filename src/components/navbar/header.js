import React, {useContext, useState} from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {UserContext} from "../../contexts/userContext";
import axios from "axios"
import { withRouter  } from 'react-router-dom'
import SignIn from "./signIn";
import SignUpCode from "./signUpCode";
import SignUp from "./signUp";
import SignUpSuccess from "./signUpSuccess";
import Error from "../response/error";

/**
 * @description: Header component, helps users to toggle to different pages / routes on the website.
 * When user is not signed in it contains 2 links (1: Properties, 2: Zoopla Properties, 3: Sign In)
 * When user is signed in it contains 4 links  (1: Properties, 2: Zoopla Properties, 3: Your(users) Properties, 4: Sign Out).
 * Depending on the user status, it decides whether to display Sign In, Sign Up, Sign Up Code, Sign up Success component.
 * @returns {JSX.Element}
 * @constructor
 */
const Header = () => {
    const logoutUrl = '/proxy/api/v1/logout'
    const { user, setUser } = useContext(UserContext)
    const [ displaySignIn, setDisplaySignIn ] = useState(false)
    const [ displaySignUpCode, setDisplaySignUpCode] = useState(false)
    const [ displaySignUp, setDisplaySignUp ] = useState(false)
    const [ displaySignUpSuccess, setDisplaySignUpSuccess ] = useState(false)
    const [ errorData, setErrorData ] = useState({})
    const [ showErrModal, setShowErrModal ] = useState(false)
    /**
     * @description: makes a call to the server to log users out. Once user is logged out it updates the User context
     * by setting user to null. If any error occurs while making the api call it sets errModal to be displayed.
     * @returns {Promise<void>}
     */
    const handleLogOut = async () => {
        try {
            await axios.post(logoutUrl)
            setUser(null)
            setErrorData({})
        } catch (err) {
            setShowErrModal(true)
            setErrorData(err.response)
        }
    }
    return (
        <Navbar expand="lg" fixed="top" bg="light" className='align-content-center position-relative'>
            <Error show={showErrModal} onHide={() => setShowErrModal(false)} data={errorData}/>
            <Container>
                <Navbar.Brand href="#home" className='text-info mr-5' style={{fontSize: 'large', fontFamily: "cursive"}}>
                    <i className="fas fa-home mr-2"/>
                    We Sell Houses
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto mr-2 ml-xl-5 pl-xl-5">
                        <Nav.Link as={NavLink} activeClassName="text-info font-weight-bold" to='/properties' className='ml-4 text-secondary' style={{fontSize:'initial'}}>
                            <i className="fas fa-building mr-2"/>
                            Properties
                        </Nav.Link>
                        <Nav.Link as={NavLink} activeClassName="text-info font-weight-bold" to='/zoopla/Properties' className='ml-4 text-secondary' style={{fontSize:'initial'}}>
                            <i className="fas fa-building mr-2"/>
                            Zoopla Properties
                        </Nav.Link>
                        {
                            !user ?
                            <Nav.Link className='ml-4 text-secondary' style={{fontSize:'initial'}} onClick={() => setDisplaySignIn(true)}>
                                <i className="fas fa-address-book mr-2"/>
                                Sign In
                            </Nav.Link> :
                            <>
                            <Nav.Link as={NavLink} activeClassName="text-info font-weight-bold"
                                      to='/user/properties' className='ml-4 text-secondary' style={{fontSize:'initial'}}>
                                <i className="fas fa-city mr-2"/>
                                Your Properties
                            </Nav.Link>
                            <Nav.Link  className='ml-4 text-secondary' style={{fontSize:'initial'}} onClick={handleLogOut}>
                                <i className="fas fa-sign-out-alt mr-2"/>
                                Sign Out
                            </Nav.Link>
                            </>
                        }
                    </Nav>
                    <SignIn show={displaySignIn} onHide={() => setDisplaySignIn(false)} setDisplaySignUpCode={setDisplaySignUpCode}/>
                    <SignUpCode show={displaySignUpCode} onHide={() => setDisplaySignUpCode(false)} setDisplaySignUp={setDisplaySignUp}/>
                    <SignUp show={displaySignUp} onHide={() => setDisplaySignUp(false)} setDisplaySignUpSuccess={setDisplaySignUpSuccess}/>
                    <SignUpSuccess show={displaySignUpSuccess} onHide={() => setDisplaySignUpSuccess(false)} setDisplaySignIn={setDisplaySignIn}/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default withRouter(Header);