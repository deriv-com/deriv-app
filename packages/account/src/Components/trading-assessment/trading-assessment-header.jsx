import React from 'react';
import { Text } from '@deriv/components';
import { trading_assessment } from './utils';

const TradingAssessmentHeader = ({ current_question, handleNextButton, handlePrevButton }) => {
    return (
        <div>
            <button onClick={handlePrevButton}>Prev</button>
            <Text as='h1' color='prominent' weight='bold' size='xs' className='trading-assessment__header'>
                {current_question + 1} of {trading_assessment.length}
            </Text>
            <button onClick={handleNextButton}>Next</button>
        </div>
    );
};

export default TradingAssessmentHeader;
