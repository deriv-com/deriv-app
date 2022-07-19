import React from 'react';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Text, Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import { getDefaultFields, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { trading_assessment_form_config, trading_assessment_questions } from 'Configs/trading-assessment-config';
import TradingAssessmentRadioOption from './trading-assessment-radio-buttons';
import TradingAssessmentDropdownOption from './trading-assessment-dropdown';

const TradingAssessmentForm = ({ assessment_questions, value, onSubmit }) => {
    const [current_question_index, setCurrentQuestionIndex] = React.useState(0);
    const [is_next_button_enabled, setIsNextButtonEnabled] = React.useState(false);
    const [current_question, setCurrentQuestion] = React.useState({});

    React.useEffect(() => {
        setCurrentQuestion(assessment_questions[current_question_index]);
    }, []);

    const handleNextButton = () => {
        const next_question = current_question_index + 1;
        if (next_question < assessment_questions.length) {
            setCurrentQuestionIndex(next_question);
            setCurrentQuestion(assessment_questions[next_question]);
        }
    };

    const handlePrevButton = () => {
        const prev_question = current_question_index - 1;
        if (prev_question >= 0) {
            setCurrentQuestionIndex(prev_question);
            setCurrentQuestion(assessment_questions[prev_question]);
        }
    };

    const handleValueSelection = (e, form_control, callBackFn, values) => {
        if (typeof e.persist === 'function') e.persist();
        callBackFn(form_control, e.target.value);
        const latest_value = { ...values, [form_control]: e.target.value };
        if (latest_value.risk_tolerance === 'No') {
            onSubmit(latest_value);
        }
    };

    const isAssessmentCompleted = answers => Object.values(answers).every(answer => Boolean(answer));
    return (
        <div className='trading-assessment'>
            <Text as='p' color='prominent' size='xxs' className='trading-assessment__side-note'>
                <Localize i18n_default_text='In providing our services to you, we are required to obtain information from you in order to asses whether a given product or service is appropriate for you.' />
            </Text>
            <section className='trading-assessment__header'>
                <div className='trading-assessment__header--background'>
                    <Text as='h1' color='prominent' weight='bold' size='xs'>
                        {current_question_index + 1} {localize('of')} {assessment_questions.length}
                    </Text>
                </div>
                <div className='trading-assessment__header--arrow-down' />
            </section>
            <section className='trading-assessment__form'>
                <Formik initialValues={{ ...value }} onSubmit={onSubmit}>
                    {({ setFieldValue, values }) => {
                        const { question_text, form_control, answer_options, questions } = current_question;

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
                                            is_disabled={!is_next_button_enabled}
                                            onClick={!isAssessmentCompleted && handleNextButton}
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

const TradingAssessmentExistingUser = ({
    real_account_signup_target,
    is_trade_assessment_incomplete,
    realAccountSignup,
    setShouldShowWarningPopup,
    should_show_warning_popup,
}) => {
    const [form_values, setStateItems] = React.useState({});

    React.useEffect(() => {
        const initial_fields = getDefaultFields(real_account_signup_target, trading_assessment_form_config);
        setStateItems(initial_fields);
    }, []);

    const handleSubmit = async values => {
        try {
            const response = await realAccountSignup(values);
        } catch (error) {
            if (error.code === 'AppropriatenessTestFailed') {
                //pass
            }
        }
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal is_open={is_trade_assessment_incomplete} title={localize('Trading Experience Assessment')}>
                    <TradingAssessmentForm
                        assessment_questions={trading_assessment_questions}
                        value={form_values}
                        onSubmit={handleSubmit}
                    />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    visible={is_trade_assessment_incomplete}
                    title={localize('Trading Experience Assessment')}
                >
                    <TradingAssessmentForm
                        assessment_questions={trading_assessment_questions}
                        value={form_values}
                        onSubmit={handleSubmit}
                    />
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default connect(({ client, ui }) => ({
    is_trade_assessment_incomplete: client.is_trading_experience_incomplete,
    real_account_signup_target: ui.real_account_signup_target,
    realAccountSignup: client.realAccountSignup,
    should_show_warning_popup: ui.should_show_warning_popup,
    setShouldShowWarningPopup: ui.setShouldShowWarningPopup,
}))(TradingAssessmentExistingUser);
