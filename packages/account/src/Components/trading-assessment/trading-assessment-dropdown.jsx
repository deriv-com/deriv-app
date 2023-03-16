import React from 'react';
import { Field } from 'formik';
import { DesktopWrapper, Dropdown, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { localize, getLanguage } from '@deriv/translations';
import classNames from 'classnames';

const TradingAssessmentDropdown = ({ item_list, onChange, values, setFieldValue, setEnableNextSection }) => {
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
                        return (
                            <React.Fragment>
                                <DesktopWrapper>
                                    <Dropdown
                                        classNameDisplay={classNames(
                                            'trading-assessment__wrapper__dropdown--mobile--display',
                                            {
                                                'trading-frequency--field':
                                                    question.form_control ===
                                                        'trading_frequency_financial_instruments' &&
                                                    ['ID', 'FR'].includes(getLanguage()),
                                            }
                                        )}
                                        is_align_text_left
                                        name={question?.question_text}
                                        placeholder={question?.question_text}
                                        list={question?.answer_options}
                                        onChange={e => onChange(e, question.form_control, setFieldValue)}
                                        value={values[question.form_control]}
                                    />
                                </DesktopWrapper>
                                <MobileWrapper>
                                    <Text as='h1' color='prominent' weight='bold' size='xs'>
                                        {question?.question_text}
                                    </Text>
                                    <SelectNative
                                        placeholder={localize('Please select')}
                                        label={localize('Please select')}
                                        name={question?.question_text}
                                        list_items={question?.answer_options}
                                        onChange={e => {
                                            onChange(e, question.form_control, setFieldValue);
                                        }}
                                        value={values[question.form_control]}
                                        hide_top_placeholder
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
