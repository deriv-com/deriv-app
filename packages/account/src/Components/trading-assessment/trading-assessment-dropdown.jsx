import React from 'react';
import { DesktopWrapper, Dropdown } from '@deriv/components';

const TradingAssessmentDropdownOption = ({ item, onClick }) => {
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
                            onChange={onClick}
                            value={question?.answer_options?.value}
                        />
                    </div>
                </DesktopWrapper>
            ))}
        </div>
    );
};

export default TradingAssessmentDropdownOption;
