import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '@i18n';

const bottomWarning = {
    bottom: '0px',
    position: 'fixed',
    zIndex: 9999,
    background: 'var(--color-red)',
    color: 'white',
    width: '100%',
    textAlign: 'center',
    lineHeight: '25px',
    fontSize: '0.8em',
};

const bottomWarningLink = { textDecoration: 'underline' };

const OfficialVersionWarning = ({ show }) =>
    show ? (
        <div style={bottomWarning}>
            <div id='end-note'>
                {`${translate('This is not an official version of Binary Bot, use at your own risk.')} `}
                <a style={bottomWarningLink} href='https://bot.binary.com/bot.html'>
                    {translate('Official Version')}
                </a>
            </div>
        </div>
    ) : null;

OfficialVersionWarning.propTypes = {
    show: PropTypes.bool.isRequired,
};

export default OfficialVersionWarning;
