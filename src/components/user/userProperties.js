import React, {useContext, useState} from "react";
import Properties from "../properties";
import { UserContext } from "../../contexts/userContext";

/**
 * @description: component used to render all the properties of the user who's logged in
 * @returns {JSX.Element}
 * @constructor
 */
const UserProperties = () => {
    const { user } = useContext(UserContext)
    let url = ""
    let initialPropertyUrl = ""
    if(user) {
        url = `/api/v1/users/${user._id}/properties?page=1&limit=5`
        initialPropertyUrl = `/api/v1/users/${user._id}/properties?page=1&limit=5`
    }
    const [ propertyUrl, setPropertyUrl ] = useState(url)
    return (
        <>
            <Properties initialUrl={initialPropertyUrl}
                        setUrl={setPropertyUrl}
                        updateUrl={propertyUrl}
            />
        </>
    )
}

export default UserProperties