import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';

const NoResultsMessage = ({ text }) => (
    <div className='no-results-found'>
        <h2 className='no-results-found__title'>
            {localize('No results for "{{text}}"', { text, interpolation: { escapeValue: false } })}
        </h2>
        <p className='no-results-found__subtitle'>{localize('Try checking your spelling or use a different term')}</p>
    </div>
);

NoResultsMessage.propTypes = {
    text: PropTypes.string,
};

export default NoResultsMessage;
