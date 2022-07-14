import React from 'react';
import { Div100vhContainer, Text, Icon, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import FormBodySection from '../form-body-section/form-body-section';
import TradingAssessmentRadioOption from './trading-assessment-radio-buttons';
import TradingAssessmentDropdownOption from './trading-assessment-dropdown';
import { trading_assessment } from './trading-assessment-config';
import RiskToleranceWarningModal from './risk-tolerance-modal';
import './trading-assessment.scss';

const TradingAssessment = () => {
    const [current_question, setCurrentQuestion] = React.useState(0);
    const [is_next_button_disabled, setIsNextButtonDisabled] = React.useState(false);
    const [is_prev_button_disabled, setIsPrevButtonDisabled] = React.useState(false);
    const [is_touched, setIsTouched] = React.useState(false);
    const [show_risk_modal, setShowRiskModal] = React.useState(false);

    // question component
    const question_text = trading_assessment[current_question].question_text;
    const end_question_index = trading_assessment.length - 1;
    const answers_list = trading_assessment[current_question].answer_options;
    const answer_radio = trading_assessment[current_question].answer;
    const answer_dropdown = trading_assessment[current_question]?.questions;

    // assessment sections
    const risk_tolerance = trading_assessment[current_question].section === 'risk_tolerance';
    const source_of_experience = trading_assessment[current_question].section === 'source_of_experience';
    const trading_experience = trading_assessment[current_question].section === 'trading_experience';
    const trading_knowledge = trading_assessment[current_question].section === 'trading_knowledge';

    // header pagination buttons
    React.useEffect(() => {
        if (current_question === 0) {
            setIsPrevButtonDisabled(true);
            setIsNextButtonDisabled(true);
            if (!!is_touched) {
                setIsNextButtonDisabled(false);
            }
        } else if (!!is_touched && current_question < end_question_index) {
            setIsNextButtonDisabled(false);
            setIsPrevButtonDisabled(false);
        } else if (current_question === end_question_index) {
            setIsNextButtonDisabled(true);
            setIsPrevButtonDisabled(false);
        } else {
            setIsPrevButtonDisabled(false);
            setIsNextButtonDisabled(true);
        }
    }, [current_question, is_next_button_disabled, is_prev_button_disabled, is_touched]);

    const onOptionsTouched = e => {
        setIsTouched(true);
        computeAnswer(e.target.value);
    };

    if (show_risk_modal) {
        return <RiskToleranceWarningModal show_risk_modal={show_risk_modal} setShowRiskModal={setShowRiskModal} />;
    }

    const computeAnswer = optionSelect => {
        if (trading_experience) {
            answer_dropdown.forEach(item => {
                if (item.answer.includes(optionSelect)) {
                    console.log('you got it right');
                } else {
                    console.log('its wrong');
                }
            });
        } else if (risk_tolerance) {
            if (answer_radio.includes(optionSelect)) {
                console.log('you got it right');
            } else {
                setShowRiskModal(true);
                console.log('exit here');
            }
        } else {
            if (answer_radio.includes(optionSelect)) {
                console.log('you got it right');
            } else {
                console.log('its wrong');
            }
        }
    };

    const handleNextButton = e => {
        const next_question = current_question + 1;
        if (!!is_touched && next_question < trading_assessment.length) {
            setCurrentQuestion(next_question);
        }
        setIsTouched(false);
        e.preventDefault();
    };

    const handlePrevButton = e => {
        const prev_question = current_question - 1;
        if (prev_question >= 0) {
            setCurrentQuestion(prev_question);
        }
        e.preventDefault();
    };

    return (
        <Div100vhContainer className='trading-assessment__form'>
            <form>
                <FormBodySection
                    has_side_note
                    side_note={localize(
                        'In providing our services to you, we are required to obtain information from you in order to asses whether a given product or service is appropriate for you.'
                    )}
                >
                    <div className='trading-assessment__header'>
                        <Button onClick={handlePrevButton} transparent is_disabled={is_prev_button_disabled}>
                            <Icon icon='IcChevronLeft' color={is_prev_button_disabled ? 'secondary' : 'black'} />
                        </Button>
                        <Text as='h1' color='prominent' weight='bold' size='xs'>
                            {current_question + 1} of {trading_assessment.length}
                        </Text>
                        <Button
                            onClick={handleNextButton}
                            transparent
                            is_disabled={is_next_button_disabled}
                            type='submit'
                        >
                            <Icon icon='IcChevronRight' color={is_next_button_disabled ? 'secondary' : 'black'} />
                        </Button>
                    </div>
                    <div className='trading-assessment__wrapper'>
                        {trading_experience ? (
                            <TradingAssessmentDropdownOption
                                item={trading_assessment[current_question]}
                                onChange={onOptionsTouched}
                            />
                        ) : (
                            <TradingAssessmentRadioOption
                                text={question_text}
                                list={answers_list}
                                onOptionsTouched={onOptionsTouched}
                            />
                        )}
                    </div>
                </FormBodySection>
            </form>
        </Div100vhContainer>
    );
};

export default TradingAssessment;
