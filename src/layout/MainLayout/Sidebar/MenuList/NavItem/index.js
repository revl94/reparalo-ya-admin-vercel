import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PropTypes from 'prop-types';
import Chip from '../../../../../components/Chip';
import * as actionTypes from '../../../../../store/actions';

const useStyles = makeStyles((theme) => ({
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

const NavItem = ({ item, level }) => {
    const classes = useStyles();
    const customization = useSelector((state) => state.customization);
    const dispatch = useDispatch();
    const Icon = item.icon;
    const itemIcon = item.icon ? (
        <Icon className={ classes.listCustomIcon } color='inherit' />
    ) : (
        <ArrowForwardIcon className={ classes.listCustomIcon } color='inherit'
                          fontSize={ level > 0 ? 'inherit' : 'default' } />
    );
    const itemIconClass = !item.icon ? classes.listIcon : classes.menuIcon;

    let itemTarget = '';

    if (item.target) {
        itemTarget = '_blank';
    }

    let listItemProps = { component: Link, to: item.url };

    if (item.external) {
        listItemProps = { component: 'a', href: item.url };
    }

    return (
        <ListItem
            disabled={ item.disabled }
            className={ level > 1 ? classes.listItemNoBack : classes.listItem }
            selected={ customization.isOpen === item.id }
            component={ Link }
            onClick={ () => dispatch({ type: actionTypes.MENU_OPEN, isOpen: item.id }) }
            to={ item.url }
            target={ itemTarget }
            button
            style={ { paddingLeft: `${ level * 16 }px` } }
            { ...listItemProps }
        >
            <ListItemIcon className={ itemIconClass }>{ itemIcon }</ListItemIcon>
            <ListItemText
                primary={
                    <Typography
                        variant={ customization.isOpen === item.id ? 'subtitle1' : 'body1' }
                        color='inherit'
                        className={ classes.listItemTypography }
                    >
                        { item.title }
                    </Typography>
                }
            />
            { item.chip && (
                <Chip
                    color={ item.chip.color }
                    variant={ item.chip.variant }
                    size={ item.chip.size }
                    label={ item.chip.label }
                    avatar={ item.chip.avatar && <Avatar>{ item.chip.avatar }</Avatar> }
                />
            ) }
        </ListItem>
    );
};

NavItem.propTypes = {
    level: PropTypes.number,
    item: PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        title: PropTypes.string.isRequired,
        icon: PropTypes.elementType.isRequired,
        target: PropTypes.bool,
        external: PropTypes.bool,
        disabled: PropTypes.bool,
        url: PropTypes.string.isRequired,
        chip: PropTypes.shape({
            label: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            size: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
            variant: PropTypes.string.isRequired,
        }),
    }),
};

NavItem.defaultProps = {
    level: 1,
    item: {
        target: false,
        external: false,
        disabled: false,
    },
};

export default NavItem;
