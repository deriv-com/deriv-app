import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Text, Icon, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import FormBody from 'Components/form-body';
import classNames from 'classnames';
import TradingAssessmentRadioOption from './trading-assessment-radio-buttons';
import TradingAssessmentDropdownOption from './trading-assessment-dropdown';
// import { trading_assessment } from './trading-assessment-config';
// import RiskToleranceWarningModal from './risk-tolerance-modal';
// import './trading-assessment.scss';

const TradingAssessment = ({
    assessment_questions,
    closeRealAccountSignup,
    goToNextStep,
    goToPreviousStep,
    onSave,
    onCancel,
    onSubmit,
    getCurrentStep,
    validate,
    value,
    ...props
}) => {
    const [current_question_index, setCurrentQuestionIndex] = React.useState(0);
    const [is_next_button_disabled, setIsNextButtonDisabled] = React.useState(true);
    const [is_prev_button_disabled, setIsPrevButtonDisabled] = React.useState(true);
    // const [is_touched, setIsTouched] = React.useState(false);
    const [current_question, setCurrentQuestion] = React.useState({});
    // const [show_risk_modal, setShowRiskModal] = React.useState(false);

    // // question component
    // const question_text = trading_assessment[current_question].question_text;
    const end_question_index = assessment_questions.length - 1;
    // const answers_list = trading_assessment[current_question].answer_options;
    // const answer_radio = trading_assessment[current_question].answer;
    // const answer_dropdown = trading_assessment[current_question]?.questions;

    // // assessment sections
    // const risk_tolerance = trading_assessment[current_question].section === 'risk_tolerance';
    // const source_of_experience = trading_assessment[current_question].section === 'source_of_experience';
    // const trading_experience = trading_assessment[current_question].section === 'trading_experience';
    // const trading_knowledge = trading_assessment[current_question].section === 'trading_knowledge';

    // // header pagination buttons
    // React.useEffect(() => {
    //     if (current_question_index === 0) {
    //         setIsPrevButtonDisabled(true);
    //         setIsNextButtonDisabled(true);
    //         setCurrentQuestion(assessment_questions[current_question_index]);
    //         if (is_touched) {
    //             setIsNextButtonDisabled(false);
    //         }
    //     } else if (is_touched && current_question_index < end_question_index) {
    //         setIsNextButtonDisabled(false);
    //         setIsPrevButtonDisabled(false);
    //     } else if (current_question_index === end_question_index) {
    //         setIsNextButtonDisabled(true);
    //         setIsPrevButtonDisabled(false);
    //     } else {
    //         setIsPrevButtonDisabled(false);
    //         setIsNextButtonDisabled(true);
    //     }
    // }, [current_question_index, is_next_button_disabled, is_prev_button_disabled, is_touched]);

    // const onOptionsTouched = e => {
    //     setIsTouched(true);
    //     computeAnswer(e.target.value);
    // };

    // if (show_risk_modal) {
    //     return <RiskToleranceWarningModal show_risk_modal={show_risk_modal} setShowRiskModal={setShowRiskModal} />;
    // }

    React.useEffect(() => {
        setCurrentQuestion(assessment_questions[current_question_index]);
    }, []);

    const handleNextButton = e => {
        const next_question = current_question_index + 1;
        if (next_question < assessment_questions.length) {
            setCurrentQuestionIndex(next_question);
            setCurrentQuestion(assessment_questions[next_question]);
        }
        // setIsTouched(false);
        e.preventDefault();
    };

    const handlePrevButton = e => {
        const prev_question = current_question_index - 1;
        if (prev_question >= 0) {
            setCurrentQuestionIndex(prev_question);
            setCurrentQuestion(assessment_questions[prev_question]);
        }
        e.preventDefault();
    };

    const handleRadioSelection = (e, form_control, callBackFn) => {
        e.persist();
        callBackFn(form_control, e.target.value);
        // setIsTouched(true);
    };

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
                <Button
                    onClick={handlePrevButton}
                    transparent
                    // is_disabled={is_prev_button_disabled}
                    // className={classNames({ 'disable-pointer': is_prev_button_disabled })}
                    style={hideElement(current_question_index === 0)}
                >
                    <Icon icon='IcChevronLeft' color={is_prev_button_disabled ? 'secondary' : 'black'} />
                </Button>
                <Text as='h1' color='prominent' weight='bold' size='xs'>
                    {current_question_index + 1} {localize('of')} {assessment_questions.length}
                </Text>
                <Button
                    onClick={handleNextButton}
                    transparent
                    // is_disabled={is_next_button_disabled}
                    // className={classNames({ 'disable-pointer': is_prev_button_disabled })}
                    style={hideElement(current_question_index === end_question_index)}
                >
                    <Icon icon='IcChevronRight' color={is_next_button_disabled ? 'secondary' : 'black'} />
                </Button>
            </section>
            <section className='trading-assessment__form'>
                <FormBody>
                    <Formik
                        initialValues={{ ...value }}
                        onSubmit={(values, actions) => {
                            onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
                        }}
                    >
                        {({ dirty, errors, isValid, setFieldValue, touched, values }) => {
                            const { question_text, form_control, answer_options, questions } = current_question;
                            console.log(current_question);
                            console.log('control passed: ', form_control);
                            return (
                                <Form style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Field name={form_control}>
                                        {({ field }) => {
                                            if (questions && questions.length) {
                                                return (
                                                    <TradingAssessmentDropdownOption
                                                        item_list={questions}
                                                        onChange={e =>
                                                            handleRadioSelection(e, form_control, setFieldValue)
                                                        }
                                                        values={values}
                                                        form_control={form_control}
                                                    />
                                                );
                                            }
                                            return (
                                                <TradingAssessmentRadioOption
                                                    text={question_text}
                                                    list={answer_options ?? []}
                                                    onChange={e => handleRadioSelection(e, form_control, setFieldValue)}
                                                    values={values}
                                                    form_control={form_control}
                                                />
                                            );
                                        }}
                                    </Field>
                                </Form>
                            );
                        }}
                    </Formik>
                </FormBody>
            </section>
        </div>
    );
};

export default TradingAssessment;
