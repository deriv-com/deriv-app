import React from 'react';
import { Text, RadioGroup } from '@deriv/components';
import { trading_assessment } from './utils';

const TradingAssessmentQuestion = ({ current_question }) => {
    const answers_list = trading_assessment[current_question].answer_options;
    return (
        <div>
            <Text as='h1' color='prominent' weight='bold' size='xs' className='trading-assessment__question'>
                {trading_assessment[current_question].question_text}
            </Text>
            <div className='trading-assessment__answer-wrapper'>
                <RadioGroup should_wrap_items required className='trading-assessment__radio-group'>
                    {answers_list.map(answer => (
                        <RadioGroup.Item
                            key={answer.value}
                            label={answer.label}
                            value={answer.value}
                            selected={answer.value}
                        />
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
};

export default TradingAssessmentQuestion;
