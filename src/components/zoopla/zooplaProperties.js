import React, {useEffect, useState} from "react";
import axios from "axios"
import Error from "../response/error";
import Paper from "@material-ui/core/Paper";
import TextField from '@material-ui/core/TextField';
import {Card} from "react-bootstrap";
import Button from "@material-ui/core/Button"
import ZooplaProperty from "./zooplaProperty";
import LinearProgress from "@material-ui/core/LinearProgress";
import NoResults from "../response/noResults";

/**
 * @description: displays all the current listing in a particular area. IBy default it displays a list of properties
 * listed in london byt user can update their area to view listing from other properties
 * @returns {JSX.Element}
 * @constructor
 */
const ZooplaProperties = () => {
    const [ area, setArea ] = useState('London')
    const defaultValue = 'London'
    const [ properties, setProperties ] = useState({})
    const [ errorData, setErrorData ] = useState({})
    const [ showErrModal, setShowErrModal ] = useState(false)
    const [ loading, setLoading ] = useState(true)
    const [ displayNoProperties, setDisplayNoProperties] = useState(false)
    /**
     * @description: updates the area selected
     * @param e
     */
    const handleChange = e => {
        setArea(e.target.value)
    }
    /**
     * @description: makes an api call when the component is mounted to retrieve listing when area is set to london
     */
    useEffect(() => {
        setLoading(true)
       const getProperties = async () => {
           try {
               const { data } = await axios.post('/api/v1/areaProperties', {area: defaultValue} )
               setProperties(data.properties)
               setLoading(false)
               setErrorData({})
           } catch (err) {
               setShowErrModal(true)
               setErrorData(err.response)
           }
       }
       getProperties()
    },[])
    /**
     * @description: makes an api call to retrieve the listings for the updated area.. if there are no listing it
     * displays a message stating no properties found else it displays a list of zoopla properties.
     * @returns {Promise<void>}
     */
    const handleSearch = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post('/api/v1/areaProperties', {area: area} )
            setProperties(data.properties)
            setLoading(false)
            setErrorData({})
            if(!data.properties.hasOwnProperty('listing')) setDisplayNoProperties(true)
            else setDisplayNoProperties(false)
        } catch (err) {
            setShowErrModal(true)
            setErrorData(err.response)
        }
    }
    return (
        <div className="row m-3">
            <Error show={showErrModal} onHide={() => setShowErrModal(false)} data={errorData}/>
            <div className="col-xl-3 border">
                <img src="https://www.zoopla.co.uk/static/images/mashery/powered-by-zoopla-150x73.png"
                     width="150" height="73" title="Property information powered by Zoopla"
                     alt="Property information powered by Zoopla" border="0"/>
                 <Paper className="mx-xl-3 my-3 border border-4" elevation={4}>
                     <Card className="m-3 p-0 border-2">
                         <Card.Header className="text-info lead font-weight-bold">
                             Search Properties by Area.
                         </Card.Header>
                        <Card.Body>
                            <TextField variant="outlined" name="area" type="text"
                                       className="border-info"  fullWidth={true} value={area}
                                       onChange={handleChange}
                            />
                        </Card.Body>
                         <Card.Footer>
                             <div className="d-flex justify-content-end">
                                 <Button variant="contained" color="primary" onClick={handleSearch}>
                                     Search
                                 </Button>
                             </div>
                         </Card.Footer>
                     </Card>
                 </Paper>
            </div>
            <div className="col-xl-9 border">
                <NoResults display={displayNoProperties} header="Zoopla Properties"/>
                {loading ?  <LinearProgress /> :
                    properties.hasOwnProperty('listing') && properties.listing.map((property, index) => {
                        return <ZooplaProperty property={property} key={index}/>
                    })
                }
            </div>
        </div>
    )
}

export default ZooplaProperties