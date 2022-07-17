import React from 'react';
import { Field } from 'formik';
import { DesktopWrapper, Dropdown } from '@deriv/components';

const TradingAssessmentDropdownOption = ({ item_list, onChange, values, setFieldValue }) => {
    console.log('Item list: ', item_list);
    console.log('Values: ', values);

    return (
        <div className='trading-assessment__wrapper__dropdown'>
            {item_list.map((question, index) => (
                <Field name={question.form_control} key={index}>
                    {({ field }) => {
                        console.log('Form contol: ', question.form_control);
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
