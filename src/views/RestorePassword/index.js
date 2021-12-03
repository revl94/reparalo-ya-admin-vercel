import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import RestorePasswordForm from './RestorePasswordForm';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.common.black,
        height: '100vh',
        minHeight: '100%',
    },
    backButton: {
        marginLeft: theme.spacing(2),
    },
    card: {
        overflow: 'visible',
        display: 'flex',
        position: 'relative',
        '& > *': {
            flexGrow: 1,
            flexBasis: '50%',
            width: '50%',
        },
        maxWidth: '475px',
        margin: '24px auto',
    },
    content: {
        padding: theme.spacing(5, 4, 3, 4),
    },
    forgot: {
        textDecoration: 'none',
        paddingLeft: '16px',
    },
    margin: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
}));

const RestorePassword = () => {
    const classes = useStyles();

    return (
        <Grid container justifyContent='center' alignItems='center' className={classes.root}>
            <Grid item xs={11} md={6} lg={4}>
                <Card className={classes.card}>
                    <CardContent className={classes.content}>
                        <Grid container direction='column' spacing={4} justifyContent='center'>
                            <Grid item xs={12}>
                                <Grid container justifyContent='space-between'>
                                    <Grid item>
                                        <Typography color='textPrimary' gutterBottom variant='h2'>
                                            Reestablecer
                                        </Typography>
                                        <Typography variant='body2' color='textSecondary'>
                                            Ingrese su nueva contraseña.
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        {/* <RouterLink to="/" className={classes.icon}>
                                            <img alt="Auth method" src={Logo} />
                                        </RouterLink> */}
                                        <Typography color='textPrimary' gutterBottom variant='h4'>
                                            ReparaloYa
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <RestorePasswordForm/>
                            </Grid>
                            <Divider />
                            <Grid container justifyContent='flex-start' className={classes.margin}>
                                <Grid item>
                                    <Typography
                                        variant='subtitle2'
                                        color='secondary'
                                        component={RouterLink}
                                        to='/login'
                                        className={classes.forgot}
                                    >
                                        Having an account
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default RestorePassword;
