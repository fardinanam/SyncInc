const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
}

const isValidPassword = (password) => {           
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!_@$%^&*-])(?=.{8,})/.test(password);
}

const isValidNumber = (number) => {
    return /^01\d{9}$/.test(number);
}

const isValidName = (name) => {
    // should only contain letters and spaces
    return /^[a-zA-Z\s]+$/.test(name);
}

const isValidUsername = (username) => {
    // should only contain letters, numbers, and underscores, period
    // start with a letter

    return /^[a-zA-Z][a-zA-Z0-9_.]+$/.test(username);
}

export { isValidEmail, isValidPassword, isValidNumber };