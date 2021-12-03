import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const Accordion = ({ expandIcon, square, data, toggle, defaultExpandedId }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(null);

    const handleChange = (panel) => (event, newExpanded) => {
        if (toggle) {
            setExpanded(newExpanded ? panel : false);
        }
    };

    React.useEffect(() => {
        setExpanded(defaultExpandedId);
    }, [defaultExpandedId]);

    return (
        <div className={ classes.root }>
            { data &&
            data.map((item) => (
                <MuiAccordion
                    key={ item.id }
                    defaultExpanded={ !item.disabled && item.defaultExpand }
                    expanded={ (!toggle && !item.disabled && item.expanded) || (toggle && expanded === item.id) }
                    disabled={ item.disabled }
                    square={ square }
                    onChange={ handleChange(item.id) }
                >
                    <MuiAccordionSummary
                        expandIcon={ expandIcon || expandIcon === false ? expandIcon : <ExpandMoreIcon /> }>
                        { item.title }
                    </MuiAccordionSummary>
                    <MuiAccordionDetails>{ item.content }</MuiAccordionDetails>
                </MuiAccordion>
            )) }
        </div>
    );
};

Accordion.propTypes = {
    expandIcon: PropTypes.elementType.isRequired,
    square: PropTypes.bool,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            defaultExpand: PropTypes.bool,
            disabled: PropTypes.bool,
            title: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.elementType,
            ]),
            content: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.elementType,
            ]),
        }),
    ).isRequired,
    toggle: PropTypes.bool,
    defaultExpandedId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

Accordion.defaultProps = {
    square: false,
    toggle: true,
    defaultExpandedId: null,
};

export default Accordion;
