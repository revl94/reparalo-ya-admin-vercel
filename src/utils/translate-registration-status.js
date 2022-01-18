const translateRegistrationStatus = (status) => {
    switch (status) {
        case 'PENDING_EMAIL_VERIFICATION':
            return 'Verificación de correo electrónico pendiente';
        case 'PENDING_PHONE_NUMBER_VERIFICATION':
            return 'Verificación de número de teléfono pendiente';
        case 'ACTIVE':
            return 'Usuario activo';
        default:
            return 'N/A';
    }
};

export default translateRegistrationStatus;
