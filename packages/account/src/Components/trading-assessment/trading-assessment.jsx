import { localize } from '@deriv/translations';
import React from 'react';
import TradingAssessmentQuestion from './trading-assessment-question';
import FormSubHeader from '../form-sub-header';
import { Div100vhContainer, Text, Dropdown, DesktopWrapper, Button, Icon } from '@deriv/components';
import {
    trading_assessment,
    cfd_trading_experience,
    cfd_trades_placed,
    other_trading_experiences,
    trading_frequencies_past_12_months,
    CFD_trading_allows_you,
} from './utils';
import './trading-assessment.scss';

const TradingDropdownQuestion = () => {
    const TradingExp = () => {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={cfd_trading_experience.question_text}
                        list={cfd_trading_experience.answer_options}
                        is_align_text_left
                    />
                </DesktopWrapper>
            </React.Fragment>
        );
    };

    const CFDTradesPlaced = () => {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={cfd_trades_placed.question_text}
                        list={cfd_trades_placed.answer_options}
                        is_align_text_left
                    />
                </DesktopWrapper>
            </React.Fragment>
        );
    };

    const OtherTradingExp = () => {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={other_trading_experiences.question_text}
                        list={other_trading_experiences.answer_options}
                        is_align_text_left
                    />
                </DesktopWrapper>
            </React.Fragment>
        );
    };

    const TradingFrequenciesPast12Months = () => {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={trading_frequencies_past_12_months.question_text}
                        list={trading_frequencies_past_12_months.answer_options}
                        is_align_text_left
                    />
                </DesktopWrapper>
            </React.Fragment>
        );
    };

    const CFDTradingAllowsYou = () => {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={CFD_trading_allows_you.question_text}
                        list={CFD_trading_allows_you.answer_options}
                        is_align_text_left
                    />
                </DesktopWrapper>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <TradingExp />
            <CFDTradesPlaced />
            <OtherTradingExp />
            <TradingFrequenciesPast12Months />
            <CFDTradingAllowsYou />
        </React.Fragment>
    );
};

const TradingAssessment = () => {
    const [current_question, setCurrentQuestion] = React.useState(0);

    const handleNextButton = () => {
        const next_question = current_question + 1;
        if (next_question < trading_assessment.length) {
            setCurrentQuestion(next_question);
        }
    };
    const handlePrevButton = () => {
        const prev_question = current_question - 1;
        if (prev_question >= 0) {
            setCurrentQuestion(prev_question);
        }
    };

    const trading_header = (
        <React.Fragment>
            <div className='trading-assessment__header'>
                <Button onClick={handlePrevButton}>
                    <Icon icon='IcChevronLeft' />
                </Button>
                <Text as='h1' color='prominent' weight='bold' size='xs'>
                    {current_question + 1} of {trading_assessment.length}
                </Text>
                <Button onClick={handleNextButton}>
                    <Icon icon='IcChevronRight' />
                </Button>
            </div>
        </React.Fragment>
    );
    return (
        <Div100vhContainer>
            <FormSubHeader
                title=''
                description={`${localize(
                    'In providing our services to you, we are required to obtain information from you in order to asses whether a given product or service is appropriate for you.'
                )}`}
            />
            <form className='trading-assessment__form'>
                <div>
                    {trading_header}
                    <div>
                        <TradingAssessmentQuestion current_question={current_question} />
                    </div>
                    <div className='trading-assessment__dropdown'>
                        <TradingDropdownQuestion />
                    </div>
                </div>
            </form>
        </Div100vhContainer>
    );
};

export default TradingAssessment;
