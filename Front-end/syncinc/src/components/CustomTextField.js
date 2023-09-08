import { TextField, InputAdornment } from "@mui/material";
import { useState } from "react";

const CustomTextField = ({ label, margin, required, fullWidth, id, 
    name, autoFocus, autoComplete, icon, validator, type }) => {
    
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        if (validator(e.target.value)) {
            setError(false);
        } else {
            setError(true);
        }
    }
    
    return (
        <TextField
            error={error}
            margin={margin}
            required={required}
            fullWidth={fullWidth}
            label={label}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            id={id}
            name={name}
            type={type}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {icon}
                    </InputAdornment>
                ),
            }}  
            onChange={handleChange}
            size="small"
        />
    );
}

export default CustomTextField;