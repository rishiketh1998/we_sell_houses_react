import React from "react";
import {Button, Modal} from "react-bootstrap";
import {Carousel} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";

const featureIcons = {
    "Garden": "fas fa-seedling",
    "Gym": "fas fa-dumbbell",
    "Terrace": "fas fa-couch",
    "Parking": "fas fa-car",
    "Retirement-Home": "fas fa-home",
    "Swimming Pool": "fas fa-swimming-pool"
}

/**
 * @description: Modal to display all the details of the property selected by the user
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const PropertyModal = (props) => {
    const { property } = props
    return (
        <Modal show={props.show} onHide={props.onHide} size="xl">
            <Modal.Header closeButton>
                <Modal.Title className="text-info">
                    {property.propertyName ? property.propertyName : `${property.bedRooms} Bedroom ${property.propertyType}`}
                    <span className="ml-2 text-info">({property.price}£)</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="row">
                <div className="col-lg-6">
                    <Carousel>
                        {property.images.map(image => {
                            return   (<Carousel.Item className="border-rounded" key={uuidv4()}>
                                <img
                                    className="d-block"
                                    src={image}
                                    alt="First slide"
                                    style={{height: "400px"}}
                                />
                            </Carousel.Item>)
                        })}
                    </Carousel>
                </div>
                <div className="col-lg-6">
                    <p className="text-info font-weight-bold">Property Type</p>
                    <p  className="text-secondary">
                        <i className={property.propertyType === 'Flat' ? "far fa-building" : "fas fa-home"}/> {property.propertyType}
                    </p>
                    <p className="text-info font-weight-bold">Address</p>
                    <p  className="text-secondary">
                        <i className="fas fa-map-marker-alt mr-2"/>
                        {property.location.doorNo}, {property.location.street},
                        {property.location.county != null && ` ${property.location.county},`}
                        {property.location.city}, {property.location.postalCode}
                    </p>
                    <p className="text-info font-weight-bold">Description</p>
                    <p className="text-secondary">{property.description}</p>
                    <p className="text-info font-weight-bold">Bed / Bath Rooms</p>
                    <div className="row mx-0">
                        <p  className="mr-3 text-secondary">
                            <i className="fas fa-bed"/> {property.bedRooms}
                        </p>
                        <p  className="mx-3 text-secondary">
                            <i className="fas fa-bath"/> {property.bathRooms}
                        </p>
                    </div>
                    <p className="text-info font-weight-bold">Features</p>
                    <div className="row mx-0">
                        {
                            property.features.map(feature => { return (
                                <div key={uuidv4()}>
                                <p className="mr-3 text-secondary">
                                    <i className={featureIcons[feature]}/> {feature}
                                </p>
                                </div>
                            )})
                        }
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-end">
                    <Button variant="outline-info px-4" onClick={() => props.onHide()}>
                        Close
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default PropertyModal;