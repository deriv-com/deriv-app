import React from 'react';
import { DesktopWrapper, Dropdown } from '@deriv/components';

const TradingAssessmentDropdownOption = ({ item_list, onChange, values, form_control }) => {
    console.log('Item list: ', item_list);
    console.log('Values: ', values);
    console.log('Form control: ', form_control);
    return (
        <div className='trading-assessment__wrapper__dropdown'>
            {item_list.map((question, index) => (
                <DesktopWrapper key={index}>
                    <div className='trading-assessment__wrapper__dropdown--list'>
                        <Dropdown
                            classNameDisplay='trading-assessment__wrapper__dropdown--list--display'
                            is_align_text_left
                            name={question?.question_text}
                            placeholder={question?.question_text}
                            list={question?.answer_options}
                            onChange={onChange}
                            value={values[form_control]}
                        />
                    </div>
                </DesktopWrapper>
            ))}
        </div>
    );
};

export default TradingAssessmentDropdownOption;
