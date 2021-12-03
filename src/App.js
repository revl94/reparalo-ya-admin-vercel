import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { jssPreset, StylesProvider } from '@material-ui/core/styles';
import { theme } from './themes';
import Routes from './Routes';
import NavigationScroll from './layout/NavigationScroll';
import Snackbar from './components/Snackbar';
import { AuthProvider } from './contexts/AuthContext';

function loadLocaleData(locale) {
    switch (locale) {
        case 'en':
            return import('./locales/en.json');
        default:
            return import('./locales/es.json');
    }
}


const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const App = () => {
    const customization = useSelector((state) => state.customization);
    const [messages, setMessages] = useState();

    useEffect(() => {
        loadLocaleData(customization.locale).then(d => {
            setMessages(d.default);
        });
    }, [customization]);

    return (
        <>
            { messages && <IntlProvider
                locale={ customization.locale }
                defaultLocale='es'
                messages={ messages }
            >
                <CssBaseline />
                <NavigationScroll>
                    <StylesProvider jss={ jss }>
                        <ThemeProvider theme={ theme(customization) }>
                            <AuthProvider>
                                <Routes />
                                <Snackbar />
                            </AuthProvider>
                        </ThemeProvider>
                    </StylesProvider>
                </NavigationScroll>
            </IntlProvider> }
        </>
    );
};

export default App;
