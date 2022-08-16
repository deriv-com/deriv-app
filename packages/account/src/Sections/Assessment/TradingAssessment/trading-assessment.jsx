import React from 'react';
import { localize } from '@deriv/translations';
import FormBody from 'Components/form-body';
import FormSubHeader from 'Components/form-sub-header';
import { trading_assessment_questions } from '../../../Configs/trading-assessment-config';
import { DesktopWrapper, Dropdown, MobileWrapper, SelectNative, Text } from '@deriv/components';

const TradingAssessment = () => {
    return (
        <form>
            <FormBody>
                <FormSubHeader
                    title={localize('Trading Experience')}
                    subtitle={`(${localize('All fields are required')})`}
                />
                <fieldset>
                    <DesktopWrapper>
                        {trading_assessment_questions.map(e => {
                            if (e.field_type === 'radio') {
                                return (
                                    <fieldset>
                                        <DesktopWrapper>
                                            <Text as='h1' color='prominent' weight='bold'>
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
                                            <Text as='h1' color='prominent' weight='bold' size='xs'>
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
                                                <fieldset key={index}>
                                                    <DesktopWrapper>
                                                        <Text as='h1' color='prominent' weight='bold'>
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
                                                        <Text as='h1' color='prominent' weight='bold' size='xs'>
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
                    </DesktopWrapper>
                </fieldset>
            </FormBody>
        </form>
    );
};

export default TradingAssessment;
