// eslint-disable-next-line no-sequences
const convertToFormData = (o) => Object.entries(o).reduce((d, e) => (d.append(...e), d), new FormData());

export default convertToFormData;
