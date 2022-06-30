import React from 'react';
import { DesktopWrapper, Dropdown } from '@deriv/components';

const TradingAssessmentDropdownOption = ({ item }) => {
    return (
        <div className='trading-assessment__wrapper__dropdown'>
            {item.questions.map(question => (
                <DesktopWrapper key={question.question_text}>
                    <div className='trading-assessment__wrapper__dropdown--list'>
                        <Dropdown
                            classNameDisplay='trading-assessment__wrapper__dropdown--list--display'
                            placeholder={question?.question_text}
                            list={question?.answer_options}
                            is_align_text_left
                        />
                    </div>
                </DesktopWrapper>
            ))}
        </div>
    );
};

export default TradingAssessmentDropdownOption;
