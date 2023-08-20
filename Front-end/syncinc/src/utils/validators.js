const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
}

const isValidPassword = (password) => {           
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!_@$%^&*-])(?=.{8,})/.test(password);
}

const isValidNumber = (number) => {
    return /^01\d{9}$/.test(number);
}
export { isValidEmail, isValidPassword, isValidNumber };