import React from 'react';
import { Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    secondary: {
        marginTop: '.5rem',
    },
    footer: {
        textAlign: 'center',
        padding: theme.spacing(1.2),
        paddingLeft: '20px',
        paddingRight: '20px',
        color: theme.palette.common.white,
    },
}));

const InfoCard = ({ value, title, iconPrimary, color, subTitle, iconFooter }) => {
    const classes = useStyles();

    const IconPrimary = iconPrimary;
    const primaryIcon = iconPrimary ? <IconPrimary fontSize='large' /> : null;

    const IconFooter = iconFooter;
    const footerIcon = iconFooter ? <IconFooter /> : null;

    return (
        <Card>
            <CardContent>
                <Grid container justifyContent='space-between' alignItems='center'>
                    <Grid item>
                        <Typography variant='h3' style={ { color } }>
                            { value }
                        </Typography>
                        <Typography variant='subtitle1' className={ classes.secondary }>
                            { title }
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='h2' style={ { color } }>
                            { primaryIcon }
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            { subTitle &&
            <div style={ { background: color } }>
                <Grid container justifyContent='space-between' className={ classes.footer }>
                    <Grid item>
                        <Typography variant='body2'>{ subTitle }</Typography>
                    </Grid>
                    { footerIcon && <Grid item>
                        <Typography variant='body2'>{ footerIcon }</Typography>
                    </Grid>
                    }
                </Grid>
            </div>
            }
        </Card>
    );
};

InfoCard.propTypes = {
    value: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    iconPrimary: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
        PropTypes.elementType,
    ]),
    iconFooter: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
        PropTypes.elementType,
    ]),
    color: PropTypes.string.isRequired,
};

InfoCard.defaultProps = {
    iconPrimary: null,
    iconFooter: null,
    subTitle: null,
};

export default InfoCard;
