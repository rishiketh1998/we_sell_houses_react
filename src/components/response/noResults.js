import React from "react";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

/**
 * @description: displays an alert message to indicate users that the api request made did not return any data
 * @param props - [display] - to display the component or not
 * @returns {JSX.Element}
 * @constructor
 */
const NoResults = (props) => {
    let message
    if(props.display) {
        message =  (<Alert severity="info" className="my-3">
                        <AlertTitle>Info</AlertTitle>
                        No <strong>{props.header}</strong> Found.
                    </Alert>)
    }
    return (
        <>
            {message}
        </>
    )
}

export default NoResults