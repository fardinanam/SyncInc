const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
}

const isValidPassword = (password) => {           
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!_@$%^&*-])(?=.{8,})/.test(password);
}

export { isValidEmail, isValidPassword };