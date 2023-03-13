import PropTypes from 'prop-types';
import React from 'react';
import { localize } from 'Components/i18next';
import { Text } from '@deriv/components';
import './filter-modal-no-results.scss';

const FilterModalNoResults = ({ text }) => (
    <div className='filter-modal-no-result'>
        <Text as='h2' size='s' align='center' weight='bold' className='filter-modal-no-result__title'>
            {localize('No results for "{{text}}".', { text, interpolation: { escapeValue: false } })}
        </Text>
        <Text as='p' size='s' align='center' className='filter-modal-no-result__subtitle'>
            {localize('Check your spelling or use a different term.')}
        </Text>
    </div>
);

FilterModalNoResults.propTypes = {
    text: PropTypes.string,
};

export default FilterModalNoResults;
