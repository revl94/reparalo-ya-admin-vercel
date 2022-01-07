const translateServiceRequestStatus = (status) => {
    switch (status) {
        case 'NEW':
            return 'Nueva Solicitud';
        case 'IN_PROCESS':
            return 'En Proceso';
        case 'RESPONSE_SENT':
            return 'Respuesta Envíada';
        case 'VISIT_MADE':
            return 'Visita Realizada';
        default:
            return 'N/A';
    }
};

export default translateServiceRequestStatus;
