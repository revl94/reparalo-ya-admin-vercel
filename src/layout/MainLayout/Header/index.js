import React from 'react';
import { Box, Grid, Hidden, IconButton, makeStyles, Typography } from '@material-ui/core';
import MenuTwoToneIcon from '@material-ui/icons/MenuTwoTone';
import PropTypes from 'prop-types';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { drawerWidth } from '../../../constants/constant';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    logoColor: {
        color: '#ffffff',
    },
    menuButton: {
        marginRight: theme.spacing(1.25),
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    menuIcon: {
        fontSize: '1.5rem',
    },
}));

const Header = ({ drawerToggle }) => {
    const classes = useStyles();

    return (
        <>
            <Box width={ drawerWidth }>
                <Grid container alignItems='center'>
                    <Grid item>
                        <IconButton
                            edge='start'
                            className={ classes.menuButton }
                            color='inherit'
                            aria-label='open drawer'
                            onClick={ drawerToggle }
                        >
                            <MenuTwoToneIcon className={ classes.menuIcon } />
                        </IconButton>
                    </Grid>
                    <Hidden smDown>
                        <Grid item>
                            <Box mt={ 0.5 }>
                                {/* <img src={ logo } alt='Logo' style={{
                                    width: 50,
                                    height: 50
                                }}/> */ }
                                <Typography className={ classes.logoColor }
                                            gutterBottom variant='h4'>
                                    ReparaloYa
                                </Typography>
                            </Box>
                        </Grid>
                    </Hidden>
                </Grid>
            </Box>
            <div className={ classes.grow } />

            <SearchSection theme='light' />
            {/* <Customization /> */ }
            <NotificationSection />
            <ProfileSection />
        </>
    );
};

Header.propTypes = {
    drawerToggle: PropTypes.func.isRequired,
};

export default Header;
