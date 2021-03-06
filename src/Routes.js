import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Loader from './components/Loader/Loader';
import NavMotion from './layout/NavMotion';
import MainLayout from './layout/MainLayout';
import GuestGuard from './components/Auth/GuestGuard';
import AuthGuard from './components/Auth/AuthGuard';
import MinimalLayout from './layout/MinimalLayout';
import Login from './views/Login';
import ForgotPassword from './views/ForgotPassword';
import RestorePassword from './views/RestorePassword';
import Users from './views/Users';
import Account from './views/Account';
import Services from './views/Services';
import ServiceRequests from './views/ServiceRequests';
import CategoriesDiscounts from './views/CategoriesDiscounts';
import Clients from './views/Clients';

const Dashboard = lazy(() => import('./views/Dashboard'));

const Routes = () => {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Suspense fallback={ <Loader /> }>
                <Switch>
                    <Redirect exact from='/'
                              to={ {
                                  pathname: location.search === '' ? '/dashboard' : '/restore-password',
                                  search: location.search,
                              } } />
                    <Route path={ [
                        '/login',
                        '/forgot-password',
                    ] }>
                        <MinimalLayout>
                            <Switch location={ location } key={ location.pathname }>
                                <NavMotion>
                                    <GuestGuard>
                                        <Route path='/login' component={ Login } />
                                        <Route path='/forgot-password' component={ ForgotPassword } />
                                    </GuestGuard>
                                </NavMotion>
                            </Switch>
                        </MinimalLayout>
                    </Route>
                    <Route path={ ['/restore-password'] }>
                        <MinimalLayout>
                            <Switch location={ location } key={ location.pathname }>
                                <NavMotion>
                                    <GuestGuard>
                                        <Route path='/restore-password' component={ RestorePassword } />
                                    </GuestGuard>
                                </NavMotion>
                            </Switch>
                        </MinimalLayout>
                    </Route>
                    <Route
                        path={ [
                            '/dashboard',
                            '/users',
                            '/user/account',
                            '/services',
                            '/service-requests',
                            '/categories-discounts',
                            '/clients',
                        ] }
                    >
                        <MainLayout>
                            <Switch location={ location } key={ location.pathname }>
                                <NavMotion>
                                    <AuthGuard>
                                        <Route path='/dashboard' component={ Dashboard } />
                                        <Route path='/users' component={ Users } />
                                        <Route path="/user/account" component={Account} />
                                        <Route path='/services' component={ Services } />
                                        <Route path='/service-requests' component={ ServiceRequests } />
                                        <Route path='/categories-discounts' component={ CategoriesDiscounts } />
                                        <Route path='/clients' component={ Clients } />
                                    </AuthGuard>
                                </NavMotion>
                            </Switch>
                        </MainLayout>
                    </Route>
                </Switch>
            </Suspense>
        </AnimatePresence>
    );
};

export default Routes;
