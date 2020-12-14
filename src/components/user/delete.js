import React, {useState} from "react";
import { Modal } from "react-bootstrap"
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Error from "../response/error";

/**
 * @description: component allows signed in users to delete their required property by verifying whether they want to
 * delete or not
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Delete = (props) => {
    const [ errorData, setErrorData ] = useState({})
    const [ showErrModal, setShowErrModal ] = useState(false)
    /**
     * @description: makes an api call to delete the required property, if there is no error from the api it
     * deletes the property all sends uses back to /user/properties link else it displays the error modal
     * @param e
     * @returns {Promise<void>}
     */
    const handleDelete = async (e) => {
        const url = `/api/v1/properties/${props.property._id}`
        try {
            await axios.delete(url)
            props.setUpdate(!props.update)
            setErrorData({})
        } catch (err) {
            setShowErrModal(true)
            setErrorData(err.response)
        }
    }
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Error show={showErrModal} onHide={() => setShowErrModal(false)} data={errorData}/>
            <Modal.Header closeButton>
                <Modal.Title className="text-info">
                    Delete Property
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert severity="error">
                    <AlertTitle>Delete</AlertTitle>
                    Are you sure you want to <strong>Delete</strong> this property?
                </Alert>
                <div className="d-flex mx-4 my-2">
                    <Button variant="outlined" className="border-danger text-danger m-2" fullWidth={true} onClick={handleDelete}>
                        Yes
                    </Button>
                    <Button variant="outlined" className="border-success text-success m-2" fullWidth={true} onClick={() => props.onHide()}>
                        No
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export  default Delete;