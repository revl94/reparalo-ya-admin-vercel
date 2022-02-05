const translateServiceRequestStatus = (status) => {
    switch (status) {
        case 'OPEN':
            return 'Solicitud Abierta';
        case 'TECHNICAL_VISIT_SCHEDULED':
            return 'Visita Técnica Programada';
        case 'CANCELLED_BY_USER':
            return 'Cancelada por el Usuario';
        case 'VISIT_CANCELLED':
            return 'Visita Cancelada';
        case 'QUOTING':
            return 'Por Cotizar';
        case 'QUOTED':
            return 'Cotizada';
        case 'APPROVED':
            return 'Aprobado';
        case 'IN_PROGRESS':
            return 'En Ejecución';
        case 'CLAIM_DONE':
            return 'Reclamo Ejecutado';
        case 'DONE':
            return 'Ejecutado';
        default:
            return 'N/A';
    }
};

export default translateServiceRequestStatus;
