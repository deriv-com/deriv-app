import React from 'react';
import { Field } from 'formik';
import { Text, RadioGroup } from '@deriv/components';

const TradingAssessmentRadioButton = ({
    disabled_items,
    text,
    list,
    onChange,
    values,
    form_control,
    setEnableNextSection,
}) => {
    React.useEffect(() => {
        setEnableNextSection(!!values[form_control]);
    }, [form_control]);

    return (
        <div className='trading-assessment__wrapper__question'>
            <Text as='h1' color='prominent' weight='bold' size='xs'>
                {text}
            </Text>
            <Field name={form_control}>
                {() => (
                    <RadioGroup
                        className='trading-assessment__wrapper__question--radio-group'
                        is_left
                        should_wrap_items
                        required
                        selected={values[form_control]}
                        onToggle={e => {
                            onChange(e);
                            setEnableNextSection(true);
                        }}
                    >
                        {list.map(answer => (
                            <RadioGroup.Item
                                className='trading-assessment__wrapper__question--radio-group--item'
                                key={answer.value}
                                label={answer?.text}
                                value={answer?.value}
                                disabled={disabled_items.includes(form_control)}
                            />
                        ))}
                    </RadioGroup>
                )}
            </Field>
        </div>
    );
};

export default TradingAssessmentRadioButton;
