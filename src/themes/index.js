import { createTheme } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import variables from '../styles/_variables.module.scss';

export function theme(customization) {
    let textPrimary;
    let textSecondary;
    let textDark;
    let textHint;
    let background;
    let paper;
    let menuCaption;
    let textInversePrimary;

    switch (customization.navType) {
        case 'dark':
            // eslint-disable-next-line no-multi-assign
            textPrimary = menuCaption = textInversePrimary = variables.textDarkPrimary;
            textSecondary = variables.textDarkSecondary;
            textDark = variables.textDarkDark;
            textHint = variables.textHintDark;
            background = variables.backgroundDark;
            paper = variables.paperDark;
            break;
        case 'light':
        default:
            // eslint-disable-next-line no-multi-assign
            textPrimary = textInversePrimary = menuCaption = variables.textPrimary;
            textSecondary = variables.textSecondary;
            textDark = variables.textDark;
            textHint = variables.textHint;
            background = variables.background;
            paper = variables.paper;
            break;
    }

    return createTheme({
        direction: customization.rtlLayout ? 'rtl' : 'ltr',
        palette: {
            type: customization.navType === 'dark' ? 'dark' : 'light',
            common: {
                black: variables.paperDark,
            },
            primary: {
                light: variables.primaryLight,
                main: variables.primary,
                dark: variables.primaryDark,
                100: variables.primary100,
            },
            secondary: {
                light: variables.secondaryLight,
                main: variables.secondary,
                dark: variables.secondaryDark,
            },
            error: {
                light: variables.errorLight,
                main: variables.error,
                dark: variables.errorDark,
            },
            warning: {
                light: variables.warningLight,
                main: variables.warning,
                dark: variables.warningDark,
            },
            info: {
                light: variables.infoLight,
                main: variables.info,
                dark: variables.infoDark,
            },
            success: {
                light: variables.successLight,
                main: variables.success,
                dark: variables.successDark,
            },
            grey: {
                300: variables.grey300,
                400: variables.grey400,
            },
            bg: {
                100: variables.bg100,
            },
            textDark: {
                color: textDark,
            },
            text: {
                primary: textPrimary,
                secondary: textSecondary,
                dark: textDark,
                hint: textHint,
            },
            background: {
                paper,
                default: background,
            },
        },
        typography: {
            fontFamily: `'Poppins', sans-serif`,
            h6: {
                fontWeight: 600,
                color: textSecondary,
                fontSize: '0.875rem',
            },
            h5: {
                fontSize: '1.125rem',
                color: textSecondary,
                fontWeight: 600,
            },
            h4: {
                fontSize: '1.25rem',
                color: textSecondary,
                fontWeight: 500,
            },
            h3: {
                fontSize: '1.5rem',
                color: textDark,
                fontWeight: 600,
            },
            h2: {
                fontSize: '2rem',
                color: textDark,
                fontWeight: 600,
            },
            h1: {
                fontSize: '2.2rem',
                color: textDark,
                fontWeight: 600,
            },
            subtitle1: {
                fontSize: '0.875rem',
                fontWeight: 500,
                color: textSecondary,
                lineHeight: '1.643em',
            },
            subtitle2: {
                fontSize: '0.8125rem',
                fontWeight: 400,
            },
            caption: {
                fontSize: '0.68rem',
                color: textHint,
                fontWeight: 500,
            },
            body1: {
                fontSize: '0.875rem',
                fontWeight: 400,
                lineHeight: '1.643em',
            },
            body2: {
                letterSpacing: '0em',
                fontWeight: 400,
                lineHeight: '1.643em',
            },
            menuCaption: {
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: variables.primary,
                padding: '5px 15px 5px',
                textTransform: 'uppercase',
                marginTop: '10px',
            },
            subMenuCaption: {
                fontSize: '0.6875rem',
                fontWeight: 400,
                color: menuCaption,
                textTransform: 'capitalize',
            },
            subHeading: {
                color: 'red',
            },
            cardTitle: {
                color: variables.primary,
                fontSize: '1rem',
            },
            breadcrumbTitle: {
                fontWeight: 500,
                fontSize: '1.5rem',
                color: textDark,
            },
        },
        overrides: {
            MuiAccordion: {
                root: {
                    boxShadow: 'none',
                },
            },
            MuiAccordionSummary: {
                root: {
                    fontWeight: 600,
                    fontSize: '0.875rem',
                },
                content: {
                    color: textSecondary,
                    fontWeight: 500,
                },
            },
            MuiPaper: {
                elevation1: {
                    boxShadow: '0 4px 6px -2px rgb(0 0 0 / 12%), 0 2px 2px -1px rgb(0 0 0 / 5%)',
                },
                rounded: {
                    borderRadius: '10px',
                },
            },
            MuiCard: {
                root: {
                    // border:'1px solid rgba(33, 40, 50, 0.125)'
                },
            },
            MuiCardHeader: {
                root: {
                    color: textDark,
                    padding: '24px',
                },
            },
            MuiCardContent: {
                root: {
                    padding: '24px',
                },
            },
            MuiCardActions: {
                root: {
                    padding: '24px',
                },
            },
            MuiSvgIcon: {
                root: {
                    fontSize: '1.3rem',
                },
            },
            // Table
            MuiTableCell: {
                root: {
                    padding: '16px 36px 16px 36px',
                    whiteSpace: 'nowrap',
                },
                head: {
                    padding: '16px 36px 16px 36px',
                    color: textDark,
                    fontWeight: 600,
                },
                paddingCheckbox: {
                    paddingLeft: '36px',
                    position: 'relative',
                },
            },
            MuiList: {
                root: {
                    overflow: 'hidden',
                },
            },
            MuiListItem: {
                root: {
                    color: textInversePrimary,
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    '&$selected': {
                        color: customization.navType === 'dark' ? variables.menuHover : variables.primary,
                        backgroundColor: customization.navType !== 'dark' ? variables.menuHover : variables.primary,
                        '&:hover': {
                            backgroundColor: customization.navType !== 'dark' ? variables.menuHover : variables.primary,
                        },
                        '& .MuiListItemIcon-root': {
                            color: customization.navType === 'dark' ? variables.menuHover : variables.primary,
                        },
                    },
                    '&:hover': {
                        color: customization.navType === 'dark' ? variables.menuHover : variables.primary,
                        '& .MuiListItemIcon-root': {
                            color: customization.navType === 'dark' ? variables.menuHover : variables.primary,
                        },
                    },
                },
                button: {
                    '&:hover': {
                        backgroundColor: customization.navType !== 'dark' ? variables.menuHover : variables.primary,
                    },
                },
            },
            MuiListItemIcon: {
                root: {
                    minWidth: '36px',
                    color: textInversePrimary,
                },
            },
            MUIDataTableSelectCell: {
                fixedLeft: {
                    position: 'relative',
                },
            },
            MuiTableHead: {
                root: {
                    background,
                },
            },
            MuiChip: {
                colorSecondary: {
                    color: grey[100],
                },
                colorPrimary: {
                    color: grey[100],
                },
                root: {
                    color: grey[100],
                },
                outlined: {
                    color: grey[500],
                },
            },
            MuiTimelineDot: {
                defaultGrey: {
                    background: grey[300],
                },
            },
            MuiTimelineConnector: {
                root: {
                    background: grey[300],
                },
            },
            MuiTableContainer: {
                root: {
                    boxShadow: 'none',
                },
            },
            MuiAvatar: {
                colorDefault: {
                    backgroundColor: variables.textHint,
                    color: grey[100],
                },
            },
            MuiInputBase: {
                input: {
                    color: textDark,
                },
            },
        },
    });
}

export default theme;
