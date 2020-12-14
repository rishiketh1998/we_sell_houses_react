import React, { useState} from "react";
import  {Card, Form, Col} from "react-bootstrap";
import useFormHook from "../hooks/useFormHook";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropertyType from "./propertyType";
import Features from "./features";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

/**
 * @description: allows users to filter component as per their requirement
 * @param setUrl - function to update the current api url
 * @param url - current url
 * @returns {JSX.Element}
 * @constructor
 */
const Filter = ({setUrl, url}) => {
    const [ featureName, setFeatureName] = useState([])
    const [ formValue, handleChange] = useFormHook({
        "minPrice": "",
        "maxPrice": "",
        "minBedRooms": "",
        "maxBedRooms": "",
        "minBathRooms": "",
        "maxBathRooms": "",
        "location.city": ""
    })
    const [propertySelect, setPropertySelect] = useState('')
    const [ priority, setPriority ] = useState(false)
    const userProperties = url.indexOf('/api/v1/users/') !== -1
    /**
     * @description: allows users to selects multiple features
     * @param e
     */
    const handleMultiSelect = e => {
        setFeatureName(e.target.value);
    }
    /**
     * @description: verifies whether the user has entered valid filter details and if not it disables the filter button
     * @returns {boolean}
     */
    const disableButton = () => {
        let priceCheck
        let bedRoomsCheck
        let bathRoomCheck
        if(formValue.minPrice && formValue.minPrice < 0) return true
        if(formValue.minBedRooms && formValue.minBedRooms < 0) return true
        if(formValue.minBathRooms && formValue.minBathRooms < 0) return true
        if(formValue.maxPrice && formValue.maxPrice < 0) return true
        if(formValue.maxBedRooms && formValue.maxBedRooms < 0) return true
        if(formValue.maxBathRooms && formValue.maxBathRooms < 0) return true
        if(formValue.minPrice && formValue.maxPrice) priceCheck = formValue.minPrice > formValue.maxPrice
        if(formValue.minBedRooms && formValue.maxBedRooms) bedRoomsCheck = formValue.minBedRooms > formValue.maxBedRooms
        if(formValue.minBathRooms && formValue.maxBathRooms) bathRoomCheck = formValue.minBathRooms > formValue.maxBathRooms
        return priceCheck || bathRoomCheck || bedRoomsCheck
    }
    /**
     * @description: allows users to select their required property type
     * @param e
     */
    const handleSelectChange = e => {
        const name = e.target.name;
        setPropertySelect({
            ...propertySelect,
            [name]: e.target.value,
        });
    }
    /**
     * @description: updates the url string depending on the filter values entered by the user
     * @param e
     */
    const handleSubmit = (e) => {
        e.preventDefault()
        let str = "&"
        for(const key in formValue) {
            if(formValue[key]) str += key+"="+formValue[key]+"&"
        }
        str = str.split('')
        str.pop()
        str = str.join('')
        if(featureName.length > 0) str += '&features='+ [...featureName]
        if(propertySelect.propertyType) str += "&propertyType=" + propertySelect.propertyType
        if(priority) str += "&priority=High"
        let apiUrl = url + str
        setUrl(apiUrl)
    }
    return (
        <Card className="m-3 p-0 border-2">
            <Accordion defaultExpanded={true}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="border-info"
                >
                    <Typography className="text-info font-weight-bold" style={{fontFamily: "sans-serif"}}>
                        Filter <i className="fas fa-search ml-2"/>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Form onSubmit={handleSubmit} className="w-100">
                        {userProperties && <Form.Row className="my-1">
                            <Col sm={3}>
                                <p className="text-secondary pt-2">Priority:</p>
                            </Col>
                            <Col>
                                <FormControlLabel
                                    control={<Checkbox checked={priority}
                                                       onChange={() => setPriority(!priority)}
                                                       name="priority" />}
                                    label="High Priority"
                                />
                            </Col>
                        </Form.Row> }
                        <Form.Row className="my-1">
                            <Col sm={3}>
                                <p className="text-secondary pt-2">Type:</p>
                            </Col>
                            <Col>
                                <PropertyType handleChange={handleSelectChange} value={propertySelect}/>
                            </Col>
                        </Form.Row>
                        <Form.Row className="my-1">
                            <Col sm={3}>
                            <p className="text-secondary pt-2">Price:</p>
                            </Col>
                            <Col>
                                <TextField variant="outlined" size="small" placeholder="Min" name="minPrice" type="number"
                                           className="border-info" onChange={handleChange} min={0}
                                           value={formValue.minPrice}
                                           error={
                                               formValue.minPrice < 0 || ((formValue.minPrice && formValue.maxPrice) ? formValue.maxPrice < formValue.minPrice : false)
                                           }/>
                            </Col>
                            <Col>
                                <TextField  variant="outlined" color="primary" size="small" placeholder="Max" name="maxPrice" min={0} type="number"
                                            className="border-info" onChange={handleChange} value={formValue.maxPrice}
                                            error={formValue.maxPrice < 0 ||
                                            ((formValue.minPrice && formValue.maxPrice) ? formValue.maxPrice < formValue.minPrice : false)}/>
                            </Col>
                        </Form.Row>
                        <Form.Row className="my-1" >
                            <Col sm={3}>
                            <p className="text-secondary pt-2">Bedroom:</p>
                            </Col>
                            <Col>
                                <TextField  variant="outlined" color="primary" size="small" placeholder="Min" name="minBedRooms" min={0}
                                            type="number" className="border-info" onChange={handleChange} value={formValue.minBedRooms}
                                            error={formValue.minBedRooms < 0 ||
                                            ((formValue.minBedRooms && formValue.maxBedRooms) ? formValue.maxBedRooms < formValue.minBedRooms : false)}
                                />
                            </Col>
                            <Col>
                                <TextField  variant="outlined" color="primary" size="small" placeholder="Max" name="maxBedRooms" min={0}
                                            type="number" className="border-info" onChange={handleChange} value={formValue.maxBedRooms}
                                            error={formValue.maxBedRooms < 0 ||
                                            ((formValue.minBedRooms && formValue.maxBedRooms) ? formValue.maxBedRooms < formValue.minBedRooms : false)}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row className="my-1" >
                            <Col sm={3}>
                            <p className="text-secondary pt-2">Bathroom:</p>
                            </Col>
                            <Col >
                                <TextField  variant="outlined" color="primary" size="small" placeholder="Min" name="minBathRooms" min={0}
                                            type="number" onChange={handleChange} value={formValue.minBathRooms}
                                            error={formValue.minBathRooms < 0 ||
                                            ((formValue.minBathRooms && formValue.maxBathRooms) ? formValue.maxBathRooms < formValue.minBathRooms : false)}
                                />
                            </Col>
                            <Col>
                                <TextField  variant="outlined" color="primary" size="small" placeholder="Max" name="maxBathRooms" min={0}
                                            type="number"  onChange={handleChange} value={formValue.maxBathRooms}
                                            error={formValue.maxBathRooms < 0 ||
                                            ((formValue.minBathRooms && formValue.maxBathRooms) ? formValue.maxBathRooms < formValue.minBathRooms : false)}/>
                            </Col>
                        </Form.Row>
                        <Form.Row className="my-1">
                            <Col sm={3}>
                            <p className="text-secondary pt-2">City:</p>
                            </Col>
                            <Col>
                                <TextField  variant="outlined" color="primary" size="small" placeholder="City" name="location.city"
                                            type="text" className="border-info" onChange={handleChange} value={formValue["location.city"]}/>
                            </Col>
                        </Form.Row>
                        <Form.Row className="my-1">
                            <Col sm={3}>
                            <p className="text-secondary pt-2 pt-sm-4">Features:</p>
                            </Col>
                            <Col>
                                <Features handleChange={handleMultiSelect} value={featureName}/>
                            </Col>
                        </Form.Row>
                        <div className="d-flex justify-content-end mt-3">
                            <Button variant="outlined" className={!disableButton() ? "px-4 border-info text-info" : "px-4 "}
                                    onClick={handleSubmit}
                                    type="submit" disabled={disableButton()}>
                                Filter
                            </Button>
                        </div>
                    </Form>
                </AccordionDetails>
            </Accordion>
        </Card>
    )
}

export default Filter;