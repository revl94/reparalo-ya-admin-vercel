const formatDate = (date = new Date()) => (`${ date.getDate() }/${ date.getMonth() + 1 }/${ date.getFullYear() }`);

export default formatDate;
