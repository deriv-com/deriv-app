import React from 'react';
import { Text, RadioGroup } from '@deriv/components';

const TradingAssessmentRadioOption = ({ text, list, setFieldValue, values }) => {
    return (
        <div className='trading-assessment__wrapper__question'>
            <Text as='h1' color='prominent' weight='bold' size='xs'>
                {text}
            </Text>

            <RadioGroup
                className='trading-assessment__wrapper__question--radio-group'
                is_left
                should_wrap_items
                required
                onToggle={e => {
                    e.persist();
                    setFieldValue('answer', e.target.value);
                }}
                selected={values.answer}
            >
                {list.map(answer => (
                    <RadioGroup.Item
                        className='trading-assessment__wrapper__question--radio-group--item'
                        key={answer.value}
                        label={answer.text}
                        value={answer.value}
                    />
                ))}
            </RadioGroup>
        </div>
    );
};

export default TradingAssessmentRadioOption;
