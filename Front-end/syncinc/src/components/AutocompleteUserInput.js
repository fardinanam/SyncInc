import { Autocomplete } from "@mui/material";
import SearchSuggestion from "./SearchSuggestion";
import { Grid, TextField } from "@mui/material";

const AutocompleteUserInput = ({label, filteredOptions, onChangeAutocomplete, onChangeInput, onFocus}) => {
    return (
        <Autocomplete
            options={filteredOptions}
            getOptionLabel={(option) => option.username}
            onChange={onChangeAutocomplete}
            onFocus={onFocus}
            renderOption={(props, option) => (
                <Grid container component='li' {...props}>
                    <SearchSuggestion suggestion={option} />
                </Grid>
            )}
            freeSolo
            renderInput={ (params) => {
                return (<TextField 
                    {...params} 
                    label={label} 
                    variant="outlined"
                    onChange={onChangeInput}
                />)
            } }
        />
    );
}

export default AutocompleteUserInput