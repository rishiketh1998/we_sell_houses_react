import React, {useState} from "react";
import Card from "react-bootstrap/cjs/Card";
import {Button} from "react-bootstrap";
import AddProperty from "./addProperty";

/**
 * @description: component that displays a addProperty button to users who are signed in.
 * @param props - [update - value of update, setUpdate - function to set the update value]
 * @returns {JSX.Element}
 * @constructor
 */
const AddPropertyContainer = (props) => {
    const [ showAdd, setShowAdd ] = useState(false)
    return (
        <Card className="m-3 p-0 border-2">
            <Card.Header className="text-info font-weight-bold" style={{fontSize: "large", fontFamily: "system-ui"}}>
                Add Property
                <i className="fas fa-plus ml-2"/>
            </Card.Header>
            <Card.Body>
                <Button variant="outline-info" className="w-100" onClick={() => setShowAdd(true)}>
                    Add
                    <i className="fas fa-plus-circle ml-2"/>
                </Button>
                <AddProperty show={showAdd} onHide={() => setShowAdd(false)} update={props.update} setUpdate={props.setUpdate} />
            </Card.Body>
        </Card>
    )
}

export default AddPropertyContainer;