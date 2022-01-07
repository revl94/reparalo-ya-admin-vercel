const addLeadingZeros = (number, zeros = '00000') => (`${ zeros }${ number }`).match(/\d{5}$/);

export default addLeadingZeros;
