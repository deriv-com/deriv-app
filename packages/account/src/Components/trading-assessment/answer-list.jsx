import React from 'react';
import { RadioGroup } from '@deriv/components';
import { trading_assessment } from './utils';

export const RadioGroupAnswer = ({ current_question }) => {
    const answers_list = trading_assessment[current_question].answer_options;

    return (
        <RadioGroup should_wrap_items required className='dc-radio-group'>
            {answers_list.map(answer => (
                <RadioGroup.Item key={answer.value} label={answer.label} value={answer.value} selected={answer.value} />
            ))}
        </RadioGroup>
    );
};
