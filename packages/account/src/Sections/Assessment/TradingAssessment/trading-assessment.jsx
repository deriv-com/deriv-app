import React from 'react';
import { localize } from '@deriv/translations';
import FormBody from 'Components/form-body';
import FormSubHeader from 'Components/form-sub-header';
import { trading_assessment_questions } from '../../../Configs/trading-assessment-config';
import { Button, DesktopWrapper, Dropdown, MobileWrapper, SelectNative, Text } from '@deriv/components';
import FormFooter from 'Components/form-footer';
import { isMobile } from '@deriv/shared';

const TradingAssessment = () => {
    return (
        <form className='account-form account-form__financial-assessment'>
            <FormBody scroll_offset={isMobile() ? '200px' : '80px'}>
                <FormSubHeader
                    title={localize('Trading Experience')}
                    subtitle={`(${localize('All fields are required')})`}
                />
                {trading_assessment_questions.map(e => {
                    if (e.field_type === 'radio') {
                        return (
                            <fieldset className='account-form__question'>
                                <DesktopWrapper>
                                    <Text
                                        as='h1'
                                        color='prominent'
                                        weight='bold'
                                        size='xs'
                                        className='account-form__question--text'
                                    >
                                        {e.question_text}
                                    </Text>
                                    <Dropdown
                                        is_align_text_left
                                        name={e?.question_text}
                                        placeholder='Select One'
                                        list={e?.answer_options}
                                    />
                                </DesktopWrapper>
                                <MobileWrapper>
                                    <Text
                                        as='h1'
                                        color='prominent'
                                        weight='bold'
                                        size='xs'
                                        line_height='xl'
                                        className='account-form__question--text'
                                    >
                                        {e?.question_text}
                                    </Text>
                                    <SelectNative
                                        placeholder={localize('Please select')}
                                        label={e?.answer_options[0].text}
                                        name={e?.question_text}
                                        list_items={e?.answer_options}
                                        hide_placeholder={true}
                                    />
                                </MobileWrapper>
                            </fieldset>
                        );
                        // eslint-disable-next-line no-else-return
                    } else {
                        return (
                            <React.Fragment>
                                {e.questions.map((item, index) => {
                                    return (
                                        <fieldset key={index} className='account-form__question'>
                                            <DesktopWrapper>
                                                <Text
                                                    as='h1'
                                                    color='prominent'
                                                    weight='bold'
                                                    size='xs'
                                                    className='account-form__question--text'
                                                >
                                                    {item.question_text}
                                                </Text>
                                                <Dropdown
                                                    is_align_text_left
                                                    name={item?.question_text}
                                                    placeholder='Select One'
                                                    list={item?.answer_options}
                                                />
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <Text
                                                    as='h1'
                                                    color='prominent'
                                                    weight='bold'
                                                    size='xs'
                                                    line_height='xl'
                                                    className='account-form__question--text'
                                                >
                                                    {item?.question_text}
                                                </Text>
                                                <SelectNative
                                                    placeholder={localize('Please select')}
                                                    label={item?.answer_options[0].text}
                                                    name={item?.question_text}
                                                    list_items={item?.answer_options}
                                                    hide_placeholder={true}
                                                />
                                            </MobileWrapper>
                                        </fieldset>
                                    );
                                })}
                            </React.Fragment>
                        );
                    }
                })}
            </FormBody>
            <FormFooter>
                <Button className='account-form__footer-btn' type='button' text={localize('Submit')} large primary />
            </FormFooter>
        </form>
    );
};

export default TradingAssessment;
