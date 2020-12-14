import React, {useState} from "react";
import { Modal} from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropertyType from "../propertyType";
import Features from "../features";
import ImageUploader from 'react-images-upload';
import useFormHook from "../../hooks/useFormHook";
import Joi from "joi";
import axios from "axios"
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from '@material-ui/core/Radio';
import Error from "../response/error";
const postalCodePattern = "^([A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}|GIR ?0A{2})$"

/**
 * @description: verifies whether the user has entered right values for the location details or not. It returns true
 * if all the location values are entered except county  else it returns false
 * @param values
 * @returns {boolean}
 */
const checkLocationValuesEntered = values => {
    for(const key in values) {
        if(key !== 'county') {
            if(!values[key]) return false
        }
    }
    return true
}

/**
 * @description: verifies whether the user has entered right values for the property details or not. It returns true
 * if all the property values are entered except description and property name  else it returns false
 * @param values
 * @returns {boolean}
 */
const checkPropertyValuesEntered = values => {
    for(const key in values) {
        if(key !== 'description' && key !== 'propertyName') {
            if(!values[key]) return false
        }
    }
    return true
}

/**
 * @description: verifies whether the user has entered property type or not. if entered then true else false
 * @param value
 * @returns {boolean}
 */
const checkPropertyTypeEntered = value => !!value.propertyType

/**
 * @description: It uses Joi library to validate whether the user is entering
 * valid details (valid - in order to satisfy api condition) or not.
 *
 * @param name - data field user is entering
 * @param value - value the is entering for the data field
 * @returns {[boolean, string]|[boolean, *]} : if an error occurs it returns true along with the message for it to error
 * else it returns false and empty message
 */
const validateData = (name, value) => {
    let schema
    switch (name) {
        case 'bedRooms':
            schema = Joi.object().keys({[name]: Joi.number().min(0).required()})
            break
        case 'bathRooms':
            schema = Joi.object().keys({[name]: Joi.number().min(0).required()})
            break
        case 'price':
            schema = Joi.object().keys({ [name]: Joi.number().min(0).required()})
            break
        case 'city':
            schema = Joi.object().keys({ [name]: Joi.string().required()})
            break
        case 'doorNo':
            schema = Joi.object().keys({ [name]: Joi.string().required()})
            break
        case 'street':
            schema = Joi.object().keys({ [name]: Joi.string().required()})
            break
        case 'postalCode':
            value = value.toUpperCase()
            schema = Joi.object().keys({ [name]: Joi.string().pattern(new RegExp(postalCodePattern)).required()})
            break
        default:
            return [false, ""]
    }
    const { error } = schema.validate({ [name]: value })
    if(error) return [true, error.details[0].message]
    else return [false, ""]
}

/**
 * @description: it checks whether all the fields error messages are set to display or not. if any one of the
 * fields error message/display is set to true then it returns false or else it returns true
 * @param data
 * @returns {boolean}
 */
const validateDataEntry = (data) => {
    for(const key in data) {
        if(data[key].display) return false
    }
    return true
}

/**
 * @description: It filters through property/location values, in order to remove unnecessary data that must not be sent to the
 * server.
 * @param obj
 * @returns {{address: {}}}
 */
const filterObj = (obj) => {
    for(const key in obj) {
        if(!obj[key]) {
            delete obj[key]
        }
    }
}

/**
 * @description: component used to update/edit user property. All the fields are auto filled to current details and
 * depending on the data users wants to update they could change it and update it
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Edit = (props) => {
    const [propertyType, setPropertyType] = useState({propertyType: props.property.propertyType})
    const [ featureName, setFeatureName] = useState(props.property.features)
    const [ pictures, setPictures ] = useState(props.property.images)
    const [ checkedUnderOffer, setCheckedUnderOffer ] = useState(props.property.underOffer)
    const [ checkedPublish, setCheckedPublish ] = useState(props.property.publish)
    const [ propertyValues, handlePropertyChange ] = useFormHook({
        "bedRooms": props.property.bedRooms,
        "bathRooms": props.property.bathRooms,
        "description": props.property.description,
        "price": props.property.price,
        "propertyName": props.property.propertyName
    })
    const [ locationValues, handleLocationChange ] = useFormHook({
        "doorNo": props.property.location.doorNo,
        "street": props.property.location.street,
        "postalCode": props.property.location.postalCode,
        "city": props.property.location.city,
        "county": props.property.location.county
    })
    const [ priority, setPriority ] = useState(props.property.priority)
    const [ displayErr, setDisplayErr ] = useState({
        bedRooms: {display: false, message: ""},
        bathRooms: {display: false, message: ""},
        price: {display: false, message: ""},
        doorNo: {display: false, message: ""},
        street: {display: false, message: ""},
        postalCode: {display: false, message: ""},
        city: {display: false, message: ""}
    })
    const [ errorData, setErrorData ] = useState({})
    const [ showErrModal, setShowErrModal ] = useState(false)
    /**
     * @description: updates the locationValues and validates whether the entered values are valid or not
     * @param e
     */
    const locationChange = (e) => {
        handleLocationChange(e)
        if(displayErr.hasOwnProperty(e.target.name)) {
            const [display, message] = (validateData(e.target.name, e.target.value))
            const obj = JSON.parse(JSON.stringify(displayErr))
            obj[e.target.name].display = display
            obj[e.target.name].message = message
            setDisplayErr(obj)
        }
    }
    /**
     * @description: updates the propertyValues and validates whether the entered values are valid or not
     * @param e
     */
    const propertyChange = e => {
        handlePropertyChange(e)
        if(displayErr.hasOwnProperty(e.target.name)) {
            const [display, message] = (validateData(e.target.name, e.target.value))
            const obj = JSON.parse(JSON.stringify(displayErr))
            obj[e.target.name].display = display
            obj[e.target.name].message = message
            setDisplayErr(obj)
        }
    }
    /**
     * @description: it sets the propertyType selected by the user
     * @param e
     */
    const handleSelectChange = e => {
        const name = e.target.name;
        setPropertyType({
            ...propertyType,
            [name]: e.target.value,
        });
    }
    /**
     * @description: makes an api to call to update a property by filtering all the data in order to satisfy the api condition.
     * If all the values entered are valid then it adds the property and returns users to the /user/properties page to view
     * their updated property. Any error occurred while making request is handled.
     * @param e
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        filterObj(propertyValues)
        filterObj(locationValues)
        const data = {
            ...propertyValues,
            location: {...locationValues},
            propertyType: propertyType['propertyType'],
            underOffer: checkedUnderOffer,
            publish: checkedPublish,
            priority
        }
        if(pictures.length > 0) data.images = pictures
        if(featureName.length > 0) data.features = featureName
        data.location.postalCode =  data.location.postalCode.toUpperCase()
        try {
            await axios.put(`https://breadbox-app-api.herokuapp.com/api/v1/properties/${props.property._id}`, data)
            props.onHide()
            props.setUpdate(!props.update)
            setErrorData({})
        } catch (err) {
            setShowErrModal(true)
            setErrorData(err.response)
        }
    }
    return (
        <Modal show={props.show} onHide={props.onHide} size="xl">
            <Error show={showErrModal} onHide={() => setShowErrModal(false)} data={errorData}/>
            <Modal.Header closeButton>
                <Modal.Title className="text-info">
                    Edit Property
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="row mx-4">
                        <div className="col-12">
                            <p className="lead text-info font-weight-bold">Property Details:</p>
                        </div>
                        <div className="col-md-6">
                            <TextField label="Property Name" fullWidth={true} className="my-2"
                                       name="propertyName"  type="text" variant="outlined"
                                       value={propertyValues.propertyName} onChange={propertyChange}/>
                            <PropertyType  handleChange={handleSelectChange} value={propertyType} required={true}/>
                            <TextField required label="Bedrooms" fullWidth={true}  className="my-2"
                                       name="bedRooms" type="number" variant="outlined" onChange={propertyChange}
                                       error={displayErr.bedRooms.display}
                                       value={propertyValues.bedRooms}
                                       helperText={displayErr.bedRooms.message}
                            />
                            <TextField required label="Bathrooms" fullWidth={true}  className="mb-1"
                                       name="bathRooms" type="number" variant="outlined" onChange={propertyChange}
                                       error={displayErr.bathRooms.display}
                                       value={propertyValues.bathRooms}
                                       helperText={displayErr.bathRooms.message}
                            />
                            <TextField required label="Price" fullWidth={true}  className="my-1"
                                       name="price" type="number" variant="outlined" onChange={propertyChange}
                                       error={displayErr.price.display}
                                       helperText={displayErr.price.message}
                                       value={propertyValues.price}
                            />
                            <Features handleChange={(e) => setFeatureName(e.target.value)} value={featureName}/>
                            <FormControlLabel
                                control={<Checkbox checked={checkedUnderOffer}
                                                   onChange={() => setCheckedUnderOffer(prevState => !prevState)}
                                                   name="underOffer" />}
                                label="Under Offer"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={checkedPublish}
                                                   onChange={() => setCheckedPublish(prevState => !prevState)}
                                                   name="Publish" />}
                                label="Publish To Public"
                            />
                        <br />
                                <FormControlLabel
                                    control={<Radio checked={priority === 'Normal'}
                                                       onChange={() => setPriority('Normal')}
                                                       name="priority" />}
                                    label="Normal Priority"
                                />
                                <FormControlLabel
                                    control={<Radio checked={priority === 'High'}
                                                       onChange={() => setPriority('High')}
                                                       name="priority" />}
                                    label="High Priority"
                                />
                        </div>
                        <div className="col-md-6">
                            <TextField  label="Description" fullWidth={true} multiline rows={5}  className="my-2"
                                        name="description" type="text" variant="outlined" onChange={propertyChange}
                                        value={propertyValues.description}/>
                            <ImageUploader onChange={(file, pictureDataUrl) => setPictures(pictureDataUrl)}
                                           withIcon={true} buttonText='Upload Images'
                                           imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                           maxFileSize={5242880} withPreview={true}
                                           name="imageUploader"
                                           defaultImages={props.property.images}
                                           className="text-center"
                                           style={{border: "1px solid rgba(0,0,0,.2)",borderRadius: "5px"}}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="row mx-4 my-2">
                        <div className="col-12">
                            <p className="lead text-info font-weight-bold">Location:</p>
                        </div>
                        <div className="col-md-6">
                            <TextField required label="Door No" fullWidth={true} className="my-1"
                                       name="doorNo" variant="outlined" onChange={locationChange}
                                       value={locationValues.doorNo}
                                       error={displayErr.doorNo.display}
                                       helperText={displayErr.doorNo.message}
                            />
                            <TextField required label="Street" fullWidth={true} className="my-1"
                                       name="street" variant="outlined" onChange={locationChange}
                                       value={locationValues.street}
                                       error={displayErr.street.display}
                                       helperText={displayErr.street.message}
                            />
                            <TextField required label="City" fullWidth={true} className="my-1"
                                       name="city" variant="outlined" onChange={locationChange}
                                       value={locationValues.city}
                                       error={displayErr.city.display}
                                       helperText={displayErr.city.message}
                            />
                        </div>
                        <div className="col-md-6">
                            <TextField label="County" fullWidth={true} className="my-1"
                                       name="county" variant="outlined" onChange={locationChange}
                                       value={locationValues.county}/>
                            <TextField required label="Postal Code" fullWidth={true} className="my-1"
                                       name="postalCode" variant="outlined" onChange={locationChange}
                                       value={locationValues.postalCode}
                                       error={displayErr.postalCode.display}
                                       helperText={displayErr.postalCode.message ? "Please enter a valid UK postal code." : ""}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="contained" color="primary" className="text-light px-4"
                                type="submit" onClick={handleSubmit}
                                disabled={
                                    !checkLocationValuesEntered(locationValues) ||
                                    !checkPropertyValuesEntered(propertyValues) ||
                                    !checkPropertyTypeEntered(propertyType) || !validateDataEntry(displayErr)
                                }>
                            Edit
                            <i className="far fa-edit ml-2"/>
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default Edit;