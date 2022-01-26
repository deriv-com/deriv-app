import React from 'react';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';

type NoResultsMessageProps = {
    text: string;
};

const NoResultsMessage = ({ text }: NoResultsMessageProps) => (
    <div className='no-results-found'>
        <h2 className='no-results-found__title'>
            {localize('No results for "{{text}}"', { text, interpolation: { escapeValue: false } })}
        </h2>
        <Text as='p' size='xxs' align='center' color='less-prominent' className='no-results-found__subtitle'>
            {localize('Try checking your spelling or use a different term')}
        </Text>
    </div>
);

export default NoResultsMessage;
