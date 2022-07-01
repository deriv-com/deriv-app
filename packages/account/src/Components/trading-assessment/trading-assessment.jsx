import React from 'react';
import { Div100vhContainer, Text, Icon, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import TradingAssessmentRadioOption from './trading-assessment-radio-buttons';
import TradingAssessmentDropdownOption from './trading-assessment-dropdown';
import { trading_assessment } from './trading-assessment-config';
import FormBodySection from '../form-body-section/form-body-section';
import './trading-assessment.scss';

const TradingAssessment = () => {
    const [current_question, setCurrentQuestion] = React.useState(0);
    const [is_next_button_disabled, setIsNextButtonDisabled] = React.useState(false);
    const [is_prev_button_disabled, setIsPrevButtonDisabled] = React.useState(false);

    const question_text = trading_assessment[current_question].question_text;
    const answers_list = trading_assessment[current_question].answer_options;
    const end_question_index = trading_assessment.length - 1;
    // console.log(current_question, '/', end_question_index);

    React.useEffect(() => {
        if (current_question === end_question_index) {
            setIsNextButtonDisabled(true);
            setIsPrevButtonDisabled(false);
        }
        if (current_question === 0) {
            setIsPrevButtonDisabled(true);
            setIsNextButtonDisabled(false);
        } else {
            setIsPrevButtonDisabled(false);
            setIsNextButtonDisabled(false);
        }
    }, [current_question, is_next_button_disabled, is_prev_button_disabled]);

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
                <Button onClick={handlePrevButton} transparent is_disabled={is_prev_button_disabled}>
                    <Icon icon='IcChevronLeft' color={is_prev_button_disabled ? 'secondary' : 'black'} />
                </Button>
                <Text as='h1' color='prominent' weight='bold' size='xs'>
                    {current_question + 1} of {trading_assessment.length}
                </Text>
                <Button onClick={handleNextButton} transparent is_disabled={is_next_button_disabled}>
                    <Icon
                        icon='IcChevronRight'
                        color={is_next_button_disabled ? 'secondary' : 'black'}
                        style={{ visibility: current_question === end_question_index ? 'hidden' : 'block' }}
                    />
                </Button>
            </div>
        </React.Fragment>
    );
    return (
        <Div100vhContainer className='trading-assessment__form'>
            <form>
                <FormBodySection
                    has_side_note
                    side_note={localize(
                        'In providing our services to you, we are required to obtain information from you in order to asses whether a given product or service is appropriate for you.'
                    )}
                >
                    {trading_header}
                    <div className='trading-assessment__wrapper'>
                        {trading_assessment[current_question].type === 'dropdown' ? (
                            <TradingAssessmentDropdownOption item={trading_assessment[current_question]} />
                        ) : (
                            <TradingAssessmentRadioOption question_text={question_text} answers_list={answers_list} />
                        )}
                    </div>
                </FormBodySection>
            </form>
        </Div100vhContainer>
    );
};

export default TradingAssessment;
