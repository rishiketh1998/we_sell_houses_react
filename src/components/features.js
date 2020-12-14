import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from '@material-ui/core/MenuItem';

/**
 * @descriptionL component that displays a list of features available to select from.
 * A dropdown component that allows user to multi select features
 * @param handleChange
 * @param value
 * @returns {JSX.Element}
 * @constructor
 */
const Features = ({handleChange, value}) => {
    const features = ["Terrace", "Parking", "Gym", "Retirement-Home","Garden","Swimming Pool"]
    return (
        <FormControl variant="outlined" fullWidth={true} className="my-1">
            <InputLabel htmlFor="outlined-age">Features</InputLabel>
            <Select
                label="Features"
                inputProps={{
                    id: 'outlined-age',
                }}
                multiple
                onChange={handleChange}
                value={value}
            >
                {features.map((feature) => (
                    <MenuItem key={feature} value={feature}>
                        {feature}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default Features