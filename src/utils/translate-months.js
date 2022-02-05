const translateMonths = (month, short) => {
    const monthLowerCase = month.toLowerCase();
    switch (monthLowerCase) {
        case 'jan':
            return short ? 'Ene' : 'Enero';
        case 'feb':
            return short ? 'Feb' : 'Febrero';
        case 'mar':
            return short ? 'Mar' : 'Marzo';
        case 'apr':
            return short ? 'Abr' : 'Abril';
        case 'may':
            return short ? 'May' : 'Mayo';
        case 'jun':
            return short ? 'Jun' : 'Junio';
        case 'jul':
            return short ? 'Jul' : 'Julio';
        case 'aug':
            return short ? 'Ago' : 'Agosto';
        case 'sep':
            return short ? 'Sep' : 'Septiembre';
        case 'oct':
            return short ? 'Oct' : 'Octbure';
        case 'nov':
            return short ? 'Nov' : 'Noviembre';
        case 'dec':
            return short ? 'Dic' : 'Diciembre';
        default:
            return 'N/A';
    }
};

export default translateMonths;
