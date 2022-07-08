import React from 'react';
import { Div100vhContainer, Text, Icon, Button, Modal } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import TradingAssessmentRadioOption from './trading-assessment-radio-buttons';
import TradingAssessmentDropdownOption from './trading-assessment-dropdown';
import { trading_assessment } from './trading-assessment-config';
import FormBodySection from '../form-body-section/form-body-section';
import './trading-assessment.scss';

const RiskToleranceWarningModal = ({ toggleModal }) => {
    <Modal small is_vertical_centered toggleModal={() => toggleModal(false)} title={localize('Risk Tolerane Warning')}>
        <Modal.Body>
            <Icon icon='IcRedWarning' size={63} />
            <Text as='p' size='xs'>
                <Localize i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the high risk of losing your money.' />
            </Text>
        </Modal.Body>
        <Modal.Footer>
            <Text as='p' size='xs'>
                <Localize i18n_default_text='To continue, kindly note that you would need to wait 24 hours before you can proceed further.' />
            </Text>

            <Button type='button' large text={localize('OK')} onClick={() => toggleModal(false)} primary />
        </Modal.Footer>
    </Modal>;
};

const TradingAssessment = () => {
    const [current_question, setCurrentQuestion] = React.useState(0);
    const [is_next_button_disabled, setIsNextButtonDisabled] = React.useState(false);
    const [is_prev_button_disabled, setIsPrevButtonDisabled] = React.useState(false);
    const [is_selected, setIsSelected] = React.useState(false);
    const [select_answer, setSelectAnswer] = React.useState();

    const question_text = trading_assessment[current_question].question_text;
    const answers_list = trading_assessment[current_question].answer_options;
    const end_question_index = trading_assessment.length - 1;

    // header pagination buttons
    React.useEffect(() => {
        if (current_question === 0) {
            setIsPrevButtonDisabled(true);
            setIsNextButtonDisabled(true);
            if (!!is_selected) {
                setIsNextButtonDisabled(false);
            }
        } else if (!!is_selected && current_question < end_question_index) {
            setIsNextButtonDisabled(false);
            setIsPrevButtonDisabled(false);
        } else if (current_question === end_question_index) {
            setIsNextButtonDisabled(true);
            setIsPrevButtonDisabled(false);
        } else {
            setIsPrevButtonDisabled(false);
            setIsNextButtonDisabled(true);
        }
    }, [current_question, is_next_button_disabled, is_prev_button_disabled, is_selected]);

    const onOptionsClicked = () => {
        setIsSelected(true);
    };

    const handleSelectAnswers = props => {
        setSelectAnswer(props.value);
    };

    const checkForAnswer = () => {
        let correct_answer = trading_assessment[current_question].answer;
        let result = answers_list.filter(answer => correct_answer === answer);
        if (select_answer === result) {
            console.log('you got it right');
        } else {
            console.log('too bad you got it wrong!');
        }
    };

    const handleNextButton = e => {
        const next_question = current_question + 1;
        if (!!is_selected && next_question < trading_assessment.length) {
            setCurrentQuestion(next_question);
        }
        setIsSelected(false);
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
                        {trading_assessment[current_question].type === 'dropdown' ? (
                            <TradingAssessmentDropdownOption
                                item={trading_assessment[current_question]}
                                onClick={onOptionsClicked}
                            />
                        ) : (
                            <TradingAssessmentRadioOption
                                text={question_text}
                                list={answers_list}
                                onClick={onOptionsClicked}
                            />
                        )}
                    </div>
                </FormBodySection>
            </form>
        </Div100vhContainer>
    );
};

export default TradingAssessment;
