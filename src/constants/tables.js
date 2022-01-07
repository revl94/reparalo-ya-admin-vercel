import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './constant';

export const textLabels = {
    body: {
        noMatch: 'No se encontraron datos',
        toolTip: 'Ordernar',
        columnHeaderTooltip: column => `Ordernar por ${ column.label }`,
    },
    pagination: {
        next: 'Siguiente Página',
        previous: 'Página Anterior',
        rowsPerPage: 'Filas por Página:',
        displayRows: 'de',
    },
    toolbar: {
        search: 'Buscar',
        downloadCsv: 'Descargar CSV',
        print: 'Imprimir',
        viewColumns: 'Ver Columnas',
        filterTable: 'Filtrar Tabla',
    },
    filter: {
        all: 'TODOS',
        title: 'FILTROS',
        reset: 'REINICIAR',
    },
    viewColumns: {
        title: 'Ver Columnas',
        titleAria: 'Ver/Ocultar Columnas de la Tabla',
    },
    selectedRows: {
        text: 'Fila(s) seleccionada(s)',
        delete: 'Borrar',
        deleteAria: 'Borrar Filas Seleccionadas',
    },
};
export const defaultTableOptions = {
    filter: false,
    download: false,
    print: false,
    responsive: 'vertical',
    textLabels,
    rowsPerPage: DEFAULT_PAGE_SIZE,
    page: DEFAULT_PAGE,
    selectableRows: 'single',
    rowsPerPageOptions: [5, 10, 20, 25, 50],
};
