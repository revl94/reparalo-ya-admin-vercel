import React, { useEffect, useRef } from 'react';
import {
    Button,
    ClickAwayListener,
    Fade,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Paper,
    Popper,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import PersonTwoToneIcon from '@material-ui/icons/PersonTwoTone';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import MeetingRoomTwoToneIcon from '@material-ui/icons/MeetingRoomTwoTone';
import useAuth from '../../../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '350px',
        minWidth: '250px',
        backgroundColor: theme.palette.background.paper,
        paddingBottom: 0,
        borderRadius: '10px',
    },
    subHeader: {
        backgroundColor: theme.palette.grey.A400,
        color: theme.palette.common.white,
        padding: '5px 15px',
    },
    menuIcon: {
        fontSize: '1.5rem',
    },
    menuButton: {
        [theme.breakpoints.down('sm')]: {
            minWidth: '50px',
        },
        [theme.breakpoints.down('xs')]: {
            minWidth: '35px',
        },
    },
}));

const ProfileSection = () => {
    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const { logout } = useAuth();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const handleLogout = async () => {
        await logout();
    };

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
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
            <Button
                className={classes.menuButton}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup='true'
                onClick={handleToggle}
                color='inherit'
            >
                <AccountCircleTwoToneIcon className={classes.menuIcon} />
            </Button>
            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: {
                        offset: {
                            enable: true,
                            offset: '0px, 10px',
                        },
                        preventOverflow: {
                            padding: 0,
                        },
                    },
                }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <List component='nav' className={classes.root}>
                                    <ListItem button component={Link} to='/user/account'
                                              selected={selectedIndex === 1}
                                              onClick={(event) => handleListItemClick(event, 1)}>
                                        <ListItemIcon>
                                            <PersonTwoToneIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Perfil' />
                                    </ListItem>
                                    <ListItem button selected={selectedIndex === 4} onClick={handleLogout}>
                                        <ListItemIcon>
                                            <MeetingRoomTwoToneIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Cerrar sesión' />
                                    </ListItem>
                                </List>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
