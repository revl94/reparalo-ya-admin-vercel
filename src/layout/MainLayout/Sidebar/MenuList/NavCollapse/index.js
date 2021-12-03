import React from 'react';
import { Collapse, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PropTypes from 'prop-types';
import NavItem from '../NavItem';

const useStyles = makeStyles((theme) => ({
    collapseIcon: {
        fontSize: '1rem',
    },
    listIcon: {
        minWidth: '25px',
    },
    listItem: {
        borderRadius: '5px',
        marginBottom: '5px',
    },
    subMenuCaption: {
        ...theme.typography.subMenuCaption,
    },
    listItemNoBack: {
        backgroundColor: 'transparent !important',
        paddingTop: '8px',
        paddingBottom: '8px',
        borderRadius: '5px',
    },
}));

const NavCollapse = ({ menu, level }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(null);

    const handleClick = () => {
        setOpen(!open);
        setSelected(!selected ? menu.id : null);
    };

    const menus = menu.children.map((item) => {
        switch (item.type) {
            case 'collapse':
                return <NavCollapse key={ item.id } menu={ item } level={ level + 1 } />;
            case 'item':
                return <NavItem key={ item.id } item={ item } level={ level + 1 } />;
            default:
                return (
                    <Typography key={ item.id } variant='h6' color='error' align='center'>
                        Menu Items Error
                    </Typography>
                );
        }
    });

    const Icon = menu.icon;

    const menuIcon = menu.icon ? (
        <Icon className={ classes.listCustomIcon } />
    ) : (
        <ArrowForwardIcon className={ classes.listCustomIcon } fontSize={ level > 0 ? 'inherit' : 'default' } />
    );

    const menuIconClass = !menu.icon ? classes.listIcon : classes.menuIcon;

    return (
        <>
            <ListItem
                className={ level > 1 ? classes.listItemNoBack : classes.listItem }
                selected={ selected === menu.id }
                button
                onClick={ handleClick }
                style={ { paddingLeft: `${ level * 16 }px` } }
            >
                <ListItemIcon className={ menuIconClass }>{ menuIcon }</ListItemIcon>
                <ListItemText
                    primary={
                        <Typography
                            variant={ selected === menu.id ? 'subtitle1' : 'body1' }
                            color='inherit'
                            className={ classes.listItemTypography }
                        >
                            { menu.title }
                        </Typography>
                    }
                    secondary={
                        menu.caption && (
                            <Typography variant='caption' className={ classes.subMenuCaption } display='block'
                                        gutterBottom>
                                { menu.caption }
                            </Typography>
                        )
                    }
                />
                { open ? <ExpandLess className={ classes.collapseIcon } /> :
                    <ExpandMore className={ classes.collapseIcon } /> }
            </ListItem>
            <Collapse in={ open } timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                    { menus }
                </List>
            </Collapse>
        </>
    );
};

NavCollapse.propTypes = {
    level: PropTypes.number.isRequired,
    menu: PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        icon: PropTypes.elementType.isRequired,
        children: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                ]).isRequired,
                title: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                url: PropTypes.string.isRequired,
            }),
        ),
    }).isRequired,
};

export default NavCollapse;
