import React, { useState} from "react";
import  { Card } from "react-bootstrap";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

/**
 * @description: updates the api url to allow users sort as required
 * @param setUrl
 * @param url
 * @returns {JSX.Element}
 * @constructor
 */
const Sorting = ({setUrl, url}) => {
    const [sort, setSort] = useState('')
    /**
     * @description: updates url and sets the url depending on the sort type selected by the user.
     * Once url is updated the properties get sorted depending on what the user is sorted by
     * @param e
     */
    const handleClick = (e) => {
        setUrl(url + `&sort=${e.currentTarget.value}`)
        setSort(e.currentTarget.name)
    }
    return (
        <Card className="m-3 p-0 border-2">
            <Accordion  defaultExpanded={true}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className="text-info font-weight-bold" style={{fontFamily: "sans-serif"}}>
                        Sort:  <i className="fas fa-sort mx-2"/> {sort}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="row" style={{display: "contents"}}>
                        <div className="col-12">
                            <Button fullWidth={true} variant="outlined" name="Highest Price"
                                    value="-price" component="button" className="text-secondary" onClick={handleClick}>Highest Price</Button>
                            <Button fullWidth={true} variant="outlined" name="Lowest Price"
                                    value="+price" className="text-secondary" onClick={handleClick}>Lowest Price</Button>
                            <Button fullWidth={true} variant="outlined" name="Newest Listed"
                                    value="-date" className="text-secondary" onClick={handleClick}>Newest Listed</Button>
                            <Button fullWidth={true} variant="outlined" name="Oldest Listed"
                                    value="+date" className="text-secondary" onClick={handleClick}>Oldest Listed</Button>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>
        </Card>
    )
}

export default Sorting;