import React from 'react';
import { List, makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';

const useStyles = makeStyles((theme) => ({
    menuCaption: {
        ...theme.typography.menuCaption,
    },
    subMenuCaption: {
        ...theme.typography.subMenuCaption,
    },
}));

const NavGroup = ({ item }) => {
    const classes = useStyles();

    const items = item.children.map((menu) => {
        switch (menu.type) {
            case 'collapse':
                return <NavCollapse key={ menu.id } menu={ menu } level={ 1 } />;
            case 'item':
                return <NavItem key={ menu.id } item={ menu } level={ 1 } />;
            default:
                return (
                    <Typography key={ menu.id } variant='h6' color='error' align='center'>
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return (
        <List
            subheader={
                <Typography variant='caption' className={ classes.menuCaption } display='block' gutterBottom>
                    { item.title }
                    { item.caption && (
                        <Typography variant='caption' className={ classes.subMenuCaption } display='block' gutterBottom>
                            { item.caption }
                        </Typography>
                    ) }
                </Typography>
            }
        >
            { items }
        </List>
    );
};

NavGroup.propTypes = {
    item: PropTypes.shape({
        title: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
        children: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                ]).isRequired,
                title: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
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
            }),
        ),
    }).isRequired,
};

export default NavGroup;
