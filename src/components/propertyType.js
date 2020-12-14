import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

/**
 * @description: drop down component that allows user to select their property type
 * @param handleChange
 * @param value
 * @param required
 * @returns {JSX.Element}
 * @constructor
 */
const PropertyType = ({handleChange, value, required}) => {
    const propertiesType = ["","Detached", "Semi-Detached", "Terraced", "Flat", "Bungalow", "Park Home"]
    return (
        <FormControl variant="outlined" fullWidth={true} className="mb-1">
            <InputLabel htmlFor="outlined-age-native-simple">Property Type {required && "*"}</InputLabel>
            <Select
                native
                label="Property Type"
                inputProps={{
                    name: 'propertyType',
                    id: 'outlined-age-native-simple',
                }}
                onChange={handleChange}
                value={value.propertyType}
            >
                {propertiesType.map((feature) => (
                    <option key={feature} value={feature}>
                        {feature}
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}

export default PropertyType