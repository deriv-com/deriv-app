import React from 'react';
import { Field } from 'formik';
import { Dropdown } from '@deriv/components';

const TradingAssessmentDropdownOption = ({ item_list, onChange, values, setFieldValue, setEnableNextSection }) => {
    React.useEffect(() => {
        checkIfAllFieldsFilled();
    }, [values]);

    const checkIfAllFieldsFilled = () => {
        let enable_next_section = false;

        if (
            values.cfd_trading_experience &&
            values.cfd_trading_frequency &&
            values.trading_experience_financial_instruments &&
            values.trading_frequency_financial_instruments
        ) {
            enable_next_section = true;
        }
        setEnableNextSection(enable_next_section);
    };

    return (
        <div className='trading-assessment__wrapper__dropdown'>
            {item_list.map((question, index) => (
                <Field name={question.form_control} key={index}>
                    {() => {
                        return (
                            <div className='trading-assessment__wrapper__dropdown--list'>
                                <Dropdown
                                    classNameDisplay='trading-assessment__wrapper__dropdown--list--display'
                                    is_align_text_left
                                    name={question?.question_text}
                                    placeholder={question?.question_text}
                                    list={question?.answer_options}
                                    onChange={e => onChange(e, question.form_control, setFieldValue)}
                                    value={values[question.form_control]}
                                />
                            </div>
                        );
                    }}
                </Field>
            ))}
        </div>
    );
};

export default TradingAssessmentDropdownOption;
