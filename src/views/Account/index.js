import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as ReactRouter } from 'react-router-dom';
import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import Breadcrumb from '../../components/Breadcrumb';
import ProfileTab from './ProfileTab';
import SecurityTab from './SecurityTab';

const useStyles = makeStyles(() => ({

    accountTab: {
        marginBottom: '8px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        '& button': {
            minWidth: '100px',
        },
    },
    accountAvatar: {
        width: '100px',
        height: '100px',
        margin: '0 auto',
    },
    accountContent: {
        textAlign: 'center',
    },
    opacity50: {
        opacity: '.5',
    },
    projectTableCard: {
        padding: '0px',
        paddingBottom: '0px !important',
        overflowX: 'auto',
    },
    userTable: {
        background: '#f0f2f8',
    },
    paymentEndContent: {
        minWidth: 'auto',
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`}
             aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box p={0}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

TabPanel.defaultProps = {
    children: null,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const Account = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Breadcrumb title='Perfil de Usuario'>
                <Typography component={ReactRouter} to='/' variant='subtitle2' color='inherit'
                            className='link-breadcrumb'>
                    Home
                </Typography>
                <Typography variant='subtitle2' color='inherit' className='link-breadcrumb'>
                    Usuarios
                </Typography>
                <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
                    Perfil
                </Typography>
            </Breadcrumb>

            <div className={classes.root}>
                <Tabs
                    value={value}
                    indicatorColor='primary'
                    textColor='primary'
                    onChange={handleChange}
                    className={classes.accountTab}
                    aria-label='simple tabs example'
                >
                    <Tab label='Perfil' {...a11yProps(0)} />
                    <Tab label='Seguridad' {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <ProfileTab/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <SecurityTab/>
                </TabPanel>
            </div>

        </>
    );
};

export default Account;
