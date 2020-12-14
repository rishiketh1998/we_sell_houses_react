import React, {useState} from "react";
import Paper from "@material-ui/core/Paper";
import {Card, Carousel} from "react-bootstrap";
import Button from "@material-ui/core/Button";
import { v4 as uuidv4 } from 'uuid';
import Message from "./message";
import Edit from "./user/edit";
import Delete from "./user/delete";
import PropertyMessages from "./user/propertyMessages";
import PropertyModal from "./propertyModal";

/**
 * @description: renders each property with a carousel to display images and buttons depending on the route of the
 * user to display more details on the property.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Property = (props) => {
    const { property } = props
    const [displayContactAgent, setDisplayContactAgent] = useState(false)
    const [ displayEdit, setDisplayEdit ] = useState(false)
    const [ displayDelete, setDisplayDelete ] = useState(false)
    const [ displayPropertyMessages, setDisplayPropertyMessages ] = useState(false)
    const [ propertyMessages, setPropertyMessages ] = useState(0)
    const [ displayPropertyModal, setDisplayPropertyModal ] = useState(false)
    return (
        <Paper className="row border border-4 m-3" elevation={4} square>
            <Card className="col-xl-3 m-xl-3 col-md-4 p-0 border">
                <Carousel>
                    {property.images.map(image => {
                        return   (<Carousel.Item className="border-rounded" key={uuidv4()}>
                            <img
                                className="d-block w-100"
                                src={image}
                                alt="First slide"
                                style={{height: "250px"}}
                            />
                        </Carousel.Item>)
                    })}
                </Carousel>
                <Card.Footer className="bg-info">
                    <p className="text-light" style={{fontSize: "20px"}}>
                        £{property.price.toLocaleString()} {property.underOffer ? "(Under Offer)" : "(Available)"}
                    </p>
                </Card.Footer>
            </Card>
            <Card className="col-xl-8 m-xl-3  col-md-8 p-0 border">
                <Card.Body>
                    <Card.Title className="lead text-info" style={{fontFamily: "sans-seriff"}}>
                        {property.bedRooms} Bedroom {property.propertyType} for sale
                    </Card.Title>
                    <Card.Text>
                        <i className="fas fa-map-marker-alt mr-2"/>
                        {property.location.doorNo}, {property.location.street},
                        {property.location.county != null && ` ${property.location.county},`}
                        {property.location.city}, {property.location.postalCode}
                    </Card.Text>
                    <div style={{maxHeight: "116px", overflow: "hidden"}}>
                        {property.description}
                    </div>
                </Card.Body>
                <Card.Footer>
                    <div className={props.showUser ?  "row mx-0 justify-content-between" : "row mx-0 justify-content-end"}>
                        { props.showUser &&
                        <div>
                            <Button className="border-success text-success m-1" variant="outlined" onClick={() => setDisplayPropertyMessages(true)}>
                                {propertyMessages}
                                <i className="far fa-envelope ml-2"/>
                            </Button>
                            <PropertyMessages show={displayPropertyMessages} onHide={() => setDisplayPropertyMessages(false)}
                                              property={property} update={props.update} setUpdate={props.setUpdate}
                                              setPropertyMessages={setPropertyMessages} propertyMessage={propertyMessages}/>
                        </div>
                        }
                        <div>
                            {!props.showUser ?
                                <Button color="secondary" className="m-1" variant="outlined" onClick={() => setDisplayContactAgent(true)}>
                                    <i className="far fa-envelope mr-1" />
                                    Agent
                                </Button> :
                                <>
                                    <Button  className="m-1 border-danger text-danger" variant="outlined"
                                            onClick={() => setDisplayDelete(true)}>
                                        <i className="fas fa-trash-alt mr-1"/>
                                        Delete
                                    </Button>
                                    <Button className="m-1 border-secondary text-secondary" variant="outlined"
                                            onClick={() => setDisplayEdit(true)}>
                                        <i className="far fa-edit mr-1"/>
                                        Edit
                                    </Button>
                                </>
                            }
                            <Button color="primary" className="m-1" variant="outlined" onClick={() => setDisplayPropertyModal(true)}>
                                More
                                <i className="fas fa-arrow-right ml-1" />
                            </Button>
                            <Message show={displayContactAgent} onHide={() => setDisplayContactAgent(false)} id={property._id}/>
                            <Edit show={displayEdit} onHide={() => setDisplayEdit(false)}
                                  property={property} update={props.update} setUpdate={props.setUpdate}/>
                            <Delete show={displayDelete} onHide={() => setDisplayDelete(false)}
                                  property={property} update={props.update} setUpdate={props.setUpdate}/>
                        </div>
                    </div>
                </Card.Footer>
                <PropertyModal property={property} show={displayPropertyModal} onHide={setDisplayPropertyModal}/>
            </Card>
        </Paper>
    )
}

export default Property;