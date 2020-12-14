import React from "react";
import Paper from "@material-ui/core/Paper";
import {Card, Carousel} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";
import Button from "@material-ui/core/Button";

/**
 * @description: renders each zoopla property and display property image, description and more for the users.
 * If a user interested in viewing more details of the property, there's a more button that'll link them ot zoopla website
 * for more details
 * @param property
 * @returns {JSX.Element}
 * @constructor
 */
const ZooplaProperty = ({property}) => {
    /**
     * @description: sends users to zoopla website on a new tab to view more details of the property
     */
    const handleClick = () => {
        window.open(property.details_url, "blank")
    }
    return (
        <Paper className="row border border-4 m-3" elevation={4} square>
            <Card className="col-xl-3 m-xl-3 col-md-4 p-0 border">
                <Carousel>
                    <Carousel.Item className="border-rounded" key={uuidv4()}>
                            <img
                                className="d-block w-100"
                                src={property.image_url}
                                alt="First slide"
                                style={{height: "250px"}}
                            />
                        </Carousel.Item>
                </Carousel>
                <Card.Footer className="bg-info">
                    <p className="text-light" style={{fontSize: "20px"}}>
                        £{(+property.price).toLocaleString()} ({property.status.toUpperCase()})
                    </p>
                </Card.Footer>
            </Card>
            <Card className="col-xl-8 m-xl-3  col-md-8 p-0 border">
                <Card.Body>
                    <Card.Title className="lead text-info" style={{fontFamily: "sans-seriff"}}>
                        {property.num_bedrooms} Bedroom {property.property_type} for sale
                    </Card.Title>
                    <Card.Text>
                        <i className="fas fa-map-marker-alt mr-2"/>
                        {property.displayable_address}
                    </Card.Text>
                    <div style={{maxHeight: "116px", overflow: "hidden"}}>
                        {property.description}
                    </div>
                </Card.Body>
                <Card.Footer>
                    <div className="col-12 d-flex justify-content-end">
                        <Button color="primary" variant="outlined" onClick={handleClick}>
                            More
                            <i className="fas fa-arrow-right ml-1" />
                        </Button>
                    </div>
                </Card.Footer>
            </Card>
        </Paper>
    )
}

export default ZooplaProperty