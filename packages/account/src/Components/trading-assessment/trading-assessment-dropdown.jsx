import React from 'react';
import { DesktopWrapper, Dropdown } from '@deriv/components';

const TradingAssessmentDropdownOption = ({ item, setFieldValue, values, handleChange, handleBlur }) => {
    return (
        <div className='trading-assessment__wrapper__dropdown'>
            {item.questions.map(question => (
                <DesktopWrapper key={question.question_text}>
                    <div className='trading-assessment__wrapper__dropdown--list'>
                        <Dropdown
                            classNameDisplay='trading-assessment__wrapper__dropdown--list--display'
                            is_align_text_left
                            placeholder={question?.question_text}
                            list={question?.answer_options}
                            value={values.answer}
                            onChange={handleChange}
                            handleBlur={handleBlur}
                            handleSelect={e => {
                                e.persist();
                                setFieldValue('answer', e.target.value);
                            }}
                        />
                    </div>
                </DesktopWrapper>
            ))}
        </div>
    );
};

export default TradingAssessmentDropdownOption;
