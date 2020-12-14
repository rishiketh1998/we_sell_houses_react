import React, {useEffect, useState} from "react";
import {Modal, Button} from "react-bootstrap";
import axios from "axios"
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Error from "../response/error";

/**
 * @description: displays messages to agens who posted property and allows them to delete the message
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const PropertyMessages = (props) => {
    const url = `/proxy/api/v1/properties/${props.property._id}/messages`
    const [messages, setMessages] = useState([])
    const [updatedMessage, setUpdatedMessage] = useState(false)
    const [ errorData, setErrorData ] = useState({})
    const [ showErrModal, setShowErrModal ] = useState(false)
    /**
     * @description: depending on the url, updatedMessage, props it makes an api call to retrieve all the messages
     * for the property selected
     */
    useEffect(() => {
        const getMessages = async () => {
            try {
                const { data } = await axios.get(url)
                setMessages(data.Result.data)
                props.setPropertyMessages(data.Result.data ? (data.Result.data).length : 0)
                setErrorData({})
            } catch (err) {
                setShowErrModal(true)
                setErrorData(err.response)
            }
        }
        getMessages()
    },[url, updatedMessage,props])
    /**
     * @description: deletes the message sent to the agent
     * @param e
     * @returns {Promise<void>}
     */
    const handleDelete = async (e) => {
        const url =  `/proxy/api/v1/messages/${e.currentTarget.name}`
        try {
           await axios.delete(url)
           setUpdatedMessage(!updatedMessage)
           props.setPropertyMessages(props.propertyMessage - 1)
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
                   Messages
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { (messages ? messages.length : 0) < 1 ?
                    <>
                        <Alert severity="info" className="m-2">
                            <AlertTitle>Info</AlertTitle>
                            There are no messages for this <strong>Property</strong>
                        </Alert>
                    </>
                    :
                    <>
                        {messages.map((message, index) => {
                           return (
                               <Accordion className="border border-muted m-3" key={index}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon color="primary"/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography><i className="far fa-hand-point-right mx-2 text-success"/>{message.email}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <i className="far fa-envelope-open mx-2 text-warning"/>{message.message}
                                    </Typography>
                                </AccordionDetails>
                                   <div className="d-flex justify-content-end mx-2">
                                       <Button variant="outline-muted text-danger" name={message._id} onClick={handleDelete}>
                                           <i className="far fa-trash-alt text-right"/>
                                       </Button>
                                   </div>
                            </Accordion>
                           )
                        })}
                    </>
                }
            </Modal.Body>
        </Modal>
    )
}

export default PropertyMessages;