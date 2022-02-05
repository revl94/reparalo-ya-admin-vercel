export const gridSpacing = 3;
export const drawerWidth = 280;
export const DEFAULT_PAGE_SIZE = 5;
export const DEFAULT_PAGE = 0;
export const DEFAULT_CHART_DATA = {
    type: 'line',
    height: 115,
    options: {
        chart: {
            toolbar: false,
        },
        grid: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        colors: ['#fff'],
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        xaxis: {
            type: 'category',
            position: 'bottom',
            tickAmount: 10,
            categories: [],
            labels: {
                show: true,
                style: {
                    colors: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
            },
            axisBorder: {
                show: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        tooltip: {
            theme: 'dark',
            fixed: {
                enabled: false,
            },
            x: {
                show: false,
            },
            marker: {
                show: false,
            },
        },
    },
    series: [{
        name: 'abc',
        data: [10, 30, 5, 20],
    }],
};
