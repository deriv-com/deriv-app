import React from 'react';
import { DesktopWrapper, Dropdown } from '@deriv/components';

const TradingAssessmentDropdownOption = ({ item, onChange }) => {
    return (
        <div className='trading-assessment__wrapper__dropdown'>
            {item.questions.map(question => (
                <DesktopWrapper key={question.question_text}>
                    <div className='trading-assessment__wrapper__dropdown--list'>
                        <Dropdown
                            classNameDisplay='trading-assessment__wrapper__dropdown--list--display'
                            is_align_text_left
                            name={question?.question_text}
                            placeholder={question?.question_text}
                            list={question?.answer_options}
                            onChange={onChange}
                            value={question?.answer_options?.value}
                        />
                    </div>
                </DesktopWrapper>
            ))}
        </div>
    );
};

export default TradingAssessmentDropdownOption;
