import React from 'react';
import { Formik, Form } from 'formik';
import {
    // FormSubmitButton,
    Text,
    // Icon,
    Button,
    Modal,
    DesktopWrapper,
    MobileDialog,
    MobileWrapper,
} from '@deriv/components';
import { generateValidationFunction, getDefaultFields, isMobile } from '@deriv/shared'; // eslint-disable-line no-unused-vars
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { trading_assessment_form_config } from 'Configs/trading-assessment-config';
import TradingAssessmentRadioOption from './trading-assessment-radio-buttons';
import TradingAssessmentDropdownOption from './trading-assessment-dropdown';

export const TradingAssessmentForm = ({ assessment_questions }) => {
    const [is_next_button_enabled, setIsNextButtonEnabled] = React.useState(false); // eslint-disable-line no-unused-vars
    const [current_question, setCurrentQuestion] = React.useState({
        current_question_index: 0,
        current_question: {},
    });

    const last_question_index = assessment_questions.length - 1; // eslint-disable-line no-unused-vars

    React.useEffect(() => {
        setCurrentQuestion(prevState => ({
            ...prevState,
            current_question: assessment_questions[prevState.current_question_index],
        }));
    }, []);
    // eslint-disable-next-line no-unused-vars
    const handleNextButton = () => {
        const next_question = current_question.current_question_index + 1;
        if (next_question < assessment_questions.length) {
            setCurrentQuestion({
                current_question_index: next_question,
                current_question: assessment_questions[next_question],
            });
        }
    };

    const handlePrevButton = () => {
        const prev_question = current_question.current_question_index - 1;
        if (prev_question >= 0) {
            setCurrentQuestion({
                current_question_index: prev_question,
                current_question: assessment_questions[prev_question],
            });
        }
    };

    const handleValueSelection = (e, form_control, callBackFn, values) => {
        if (typeof e.persist === 'function') e.persist();
        callBackFn(form_control, e.target.value);
        const latest_value = { ...values, [form_control]: e.target.value };
        if (latest_value.risk_tolerance === 'No') {
            // TODO implement logic here
        }
    };

    const isAssessmentCompleted = answers => Object.values(answers).every(answer => Boolean(answer));
    // eslint-disable-next-line no-unused-vars
    const hideElement = condition => {
        if (condition) {
            return { visibility: 'hidden' };
        }
        return {};
    };

    return (
        <div className='trading-assessment'>
            <Text as='p' color='prominent' size='xxs' className='trading-assessment__side-note'>
                <Localize i18n_default_text='In providing our services to you, we are required to obtain information from you in order to asses whether a given product or service is appropriate for you.' />
            </Text>
            <section className='trading-assessment__header'>
                <div className='trading-assessment__header--background'>
                    <Text as='h1' color='prominent' weight='bold' size='xs'>
                        {current_question.current_question_index + 1} {localize('of')} {assessment_questions.length}
                    </Text>
                </div>
                <div className='trading-assessment__header--arrow-down' />
            </section>
            <section className='trading-assessment__form'>
                <Formik
                    innerRef={selected_step_ref} // eslint-disable-line no-undef
                    initialValues={{ ...value }} // eslint-disable-line no-undef
                    onSubmit={(values, actions) => {
                        onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep); // eslint-disable-line no-undef
                    }}
                >
                    {({ setFieldValue, values }) => {
                        const { question_text, form_control, answer_options, questions } =
                            current_question.current_question;

                        return (
                            <Form className='trading-assessment__form--layout'>
                                <div className='trading-assessment__form--fields'>
                                    {questions && questions.length ? (
                                        <TradingAssessmentDropdownOption
                                            item_list={questions}
                                            onChange={handleValueSelection}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            setEnableNextSection={setIsNextButtonEnabled}
                                        />
                                    ) : (
                                        <TradingAssessmentRadioOption
                                            text={question_text}
                                            list={answer_options ?? []}
                                            onChange={e => handleValueSelection(e, form_control, setFieldValue, values)}
                                            values={values}
                                            form_control={form_control}
                                            setEnableNextSection={setIsNextButtonEnabled}
                                        />
                                    )}
                                </div>
                                <Modal.Footer
                                    has_separator
                                    is_bypassed={isMobile()}
                                    className='trading-assessment__existing_btn '
                                >
                                    <Button.Group>
                                        <Button
                                            has_effect
                                            onClick={handlePrevButton}
                                            text={localize('Previous')}
                                            type='button'
                                            secondary
                                            large
                                        />
                                        <Button
                                            has_effect
                                            type={isAssessmentCompleted ? 'submit' : 'button'}
                                            text={localize('Next')}
                                            large
                                            primary
                                        />
                                    </Button.Group>
                                </Modal.Footer>
                            </Form>
                        );
                    }}
                </Formik>
            </section>
        </div>
    );
};

const TradingAssessmentExistingUser = ({ real_account_signup_target, is_trade_assessment_incomplete }) => {
    const form_values = getDefaultFields(real_account_signup_target, trading_assessment_form_config); // eslint-disable-line no-unused-vars

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal is_open={is_trade_assessment_incomplete} title={localize('Trading Experience Assessment')}>
                    <div />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    visible={is_trade_assessment_incomplete}
                    title={localize('Trading Experience Assessment')}
                >
                    <div />
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default connect(({ client, ui }) => ({
    is_trade_assessment_incomplete: client.is_trade_assessment_incomplete,
    real_account_signup_target: ui.real_account_signup_target,
}))(TradingAssessmentExistingUser);
