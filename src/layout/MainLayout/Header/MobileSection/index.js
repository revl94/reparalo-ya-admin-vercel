import React, { useEffect, useRef, useState } from 'react';
import {
    AppBar,
    ClickAwayListener,
    Grid,
    Grow,
    IconButton,
    makeStyles,
    Paper,
    Popper,
    Toolbar,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import MoreVertTwoToneIcon from '@material-ui/icons/MoreVertTwoTone';
import SearchSection from '../SearchSection';
import NotificationSection from '../NotificationSection';
import ProfileSection from '../ProfileSection';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        [theme.breakpoints.down('xs')]: {
            flexGrow: 0,
        },
    },
    popperContainer: {
        width: '100%',
        zIndex: 1,
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
    },
    menuIcon: {
        fontSize: '1.5rem',
    },
}));

const MobileSection = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matchMobile = useMediaQuery(theme.breakpoints.down('mobile'));
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const prevOpen = useRef(open);

    useEffect(() => {
        if (prevOpen.current && !open) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <IconButton
                ref={ anchorRef }
                aria-controls={ open ? 'menu-list-grow' : undefined }
                aria-haspopup='true'
                onClick={ handleToggle }
                color='inherit'
            >
                <MoreVertTwoToneIcon className={ classes.menuIcon } />
            </IconButton>
            <Popper
                open={ open }
                placement='bottom-end'
                anchorEl={ anchorRef.current }
                role={ undefined }
                transition
                disablePortal
                className={ classes.popperContainer }
                popperOptions={ {
                    modifiers: {
                        offset: {
                            enable: true,
                            offset: '0px, 5px',
                        },
                        preventOverflow: {
                            padding: 0,
                        },
                    },
                } }
            >
                { ({ TransitionProps }) => (
                    <Grow { ...TransitionProps } in={ open }>
                        <Paper>
                            <ClickAwayListener onClickAway={ handleClose }>
                                <div className={ classes.grow }>
                                    <AppBar color='default'>
                                        <Toolbar>
                                            <Grid
                                                container
                                                direction='row'
                                                justifyContent={ matchMobile ? 'space-between' : 'flex-end' }
                                                alignItems='center'
                                            >
                                                <SearchSection theme='dark' />
                                                <NotificationSection />
                                                <ProfileSection />
                                            </Grid>
                                        </Toolbar>
                                    </AppBar>
                                </div>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                ) }
            </Popper>
        </>
    );
};

export default MobileSection;
