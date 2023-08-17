import { useContext, useEffect, useState } from "react";
import { Chip, Autocomplete, TextField } from "@mui/material";
import { baseUrl } from '../utils/config';
import AuthContext from '../context/AuthContext';
import axios from "axios";

const AutocompleteTagInput = ({isLoaded, defaultTags, onChange}) => {
    const [allTags, setAllTags] = useState([]);
    const { authTokens } = useContext(AuthContext);

    const fetchAllTags = async () => {
        const response = await axios.get(
            `${baseUrl}all_tags/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens?.access,
                }
            }
        );

        setAllTags(response.data.data);
    }

    useEffect(() => {
        if (isLoaded) {
            fetchAllTags();
        }
    }, [isLoaded]);


    return (
        <Autocomplete
            multiple
            id="tags"
            name="tags"
            options={allTags?.map((option) => option.name)}
            defaultValue={defaultTags}
            onChange={onChange}
            freeSolo
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                />
                ))
            }
            renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Add Tags" />
            )}
        />
    )
}

export default AutocompleteTagInput