import React from 'react';
import { Field } from 'formik';
import { DesktopWrapper, Dropdown, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { localize, getLanguage } from '@deriv/translations';
import classNames from 'classnames';

const TradingAssessmentDropdown = ({
    disabled_items,
    item_list,
    onChange,
    values,
    setFieldValue,
    setEnableNextSection,
    error,
}) => {
    React.useEffect(() => {
        checkIfAllFieldsFilled();
    }, [values]);

    const checkIfAllFieldsFilled = () => {
        if (values) {
            setEnableNextSection(
                values.cfd_experience &&
                    values.cfd_frequency &&
                    values.trading_experience_financial_instruments &&
                    values.trading_frequency_financial_instruments
            );
        }
    };

    return (
        <div className='trading-assessment__wrapper__dropdown'>
            {item_list.map(question => (
                <Field name={question.form_control} key={question.form_control}>
                    {() => {
                        const has_input_error = !values[question.form_control];
                        const should_extend_trading_frequency_field =
                            question.form_control === 'trading_frequency_financial_instruments' &&
                            question?.question_text.length > 90;

                        return (
                            <React.Fragment>
                                <DesktopWrapper>
                                    <Dropdown
                                        classNameDisplay={classNames({
                                            'trading-frequency--field': should_extend_trading_frequency_field,
                                        })}
                                        is_align_text_left
                                        name={question?.form_control}
                                        placeholder={question?.question_text}
                                        list={question?.answer_options}
                                        onChange={e => onChange(e, question.form_control, setFieldValue)}
                                        value={values[question.form_control]}
                                        disabled={disabled_items.includes(question.form_control)}
                                        error={has_input_error && error}
                                    />
                                </DesktopWrapper>
                                <MobileWrapper>
                                    <Text as='h1' color='prominent' weight='bold' size='xs'>
                                        {question?.question_text}
                                    </Text>
                                    <SelectNative
                                        placeholder={localize('Please select')}
                                        label={localize('Please select')}
                                        name={question?.form_control}
                                        list_items={question?.answer_options}
                                        onChange={e => {
                                            onChange(e, question.form_control, setFieldValue);
                                        }}
                                        value={values[question.form_control]}
                                        hide_top_placeholder
                                        disabled={disabled_items.includes(question.form_control)}
                                        error={has_input_error && error}
                                    />
                                </MobileWrapper>
                            </React.Fragment>
                        );
                    }}
                </Field>
            ))}
        </div>
    );
};

export default TradingAssessmentDropdown;
