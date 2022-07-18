import React from 'react';
import { DesktopWrapper, Dropdown } from '@deriv/components';

const TradingAssessmentDropdownOption = ({ item, onChange }) => {
    return (
        <div className='trading-assessment__wrapper__dropdown'>
            {item.questions.map(question => (
                <DesktopWrapper key={question.question_text}>
                    <div className='trading-assessment__wrapper__dropdown--list'>
                        <Dropdown
                            placeholder={question?.question_text}
                            is_align_text_left
                            classNameDisplay='trading-assessment__wrapper__dropdown--list--display'
                            name={question?.question_text}
                            list={question?.answer_options}
                            value={question?.answer_options?.value}
                            onChange={onChange}
                            
                        />
                    </div>
                </DesktopWrapper>
            ))}
        </div>
    );
};

export default TradingAssessmentDropdownOption;
