import React from "react";
import { Modal } from "react-bootstrap";
import Alert from "@material-ui/lab/Alert";
import Button  from "@material-ui/core/Button";
import AlertTitle from "@material-ui/lab/AlertTitle";

/**
 * @description: component used to indicate that the user is successfully logged in. Once the user closes the modal it
 * takes them to sign in modal
 * @param props [show - boolean - to display modal or not, onHide - function - to close/hide the modal,
 * setDisplaySignIn - function - either to display sign in or not]
 * @returns {JSX.Element}
 * @constructor
 */
const SignUpSuccess = (props) => {
    return (
        <Modal show={props.show} onHide={props.onHide} size="md">
            <Modal.Header closeButton>
                <Modal.Title className="text-primary">
                    Success
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert severity="success" className="m-2">
                    <AlertTitle>Success</AlertTitle>
                    You have successfully <strong>Signed Up.</strong>
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-end">
                    <Button variant="outlined" color="primary" onClick={() => {props.onHide(); props.setDisplaySignIn(true)}}>
                        Sign In
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default SignUpSuccess;