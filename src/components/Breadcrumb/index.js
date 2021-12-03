import React from 'react';
import { Card, CardContent, Divider, makeStyles, Typography } from '@material-ui/core';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        background: 'transparent',
        boxShadow: 'none',
        border: 'none',
    },
    cardClass: {
        padding: theme.spacing(3),
    },
    cardContent: {
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: '0 !important',
    },
    divider: {
        marginBottom: theme.spacing(3),
        marginTop: theme.spacing(2),
    },
    spacer: {
        marginBottom: theme.spacing(3),
    },
    breadcrumbTitle: {
        fontWeight: 500,
        marginTop: theme.spacing(1),
    },
}));

const Breadcrumb = ({ color, outline, size, title, divider, isCard, ...rest }) => {
    const classes = useStyles();
    let cardClass = classes.root;

    if (isCard) {
        cardClass = classes.cardClass;
    }

    return (
        <Card className={ cardClass }>
            <CardContent className={ classes.cardContent }>
                <MuiBreadcrumbs { ...rest } />
                { title && (
                    <Typography className={ classes.breadcrumbTitle } variant='h3'>
                        { title }
                    </Typography>
                ) }
                { divider === false && !isCard && <div className={ classes.spacer } /> }
                { divider !== false && <Divider className={ classes.divider } /> }
            </CardContent>
        </Card>
    );
};

Breadcrumb.propTypes = {
    color: PropTypes.string,
    outline: PropTypes.bool,
    size: PropTypes.string,
    title: PropTypes.string.isRequired,
    divider: PropTypes.bool,
    isCard: PropTypes.bool,
};

Breadcrumb.defaultProps = {
    color: 'primary',
    outline: false,
    size: 'small',
    divider: true,
    isCard: false,
};

export default Breadcrumb;
