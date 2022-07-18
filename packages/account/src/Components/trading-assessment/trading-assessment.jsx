import React from 'react';
import { Formik, Form } from 'formik';
import { FormSubmitButton, Text, Icon, Button, Modal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import classNames from 'classnames';
import TradingAssessmentRadioOption from './trading-assessment-radio-buttons';
import TradingAssessmentDropdownOption from './trading-assessment-dropdown';

const TradingAssessment = ({
    assessment_questions,
    goToNextStep,
    goToPreviousStep,
    onSave,
    onCancel,
    onSubmit,
    getCurrentStep,
    selected_step_ref,
    validate,
    value,
}) => {
    const [current_question_index, setCurrentQuestionIndex] = React.useState(0);
    const [is_next_button_enabled, setIsNextButtonEnabled] = React.useState(false);
    const [current_question, setCurrentQuestion] = React.useState({});

    const end_question_index = assessment_questions.length - 1;

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

    const handleCancel = values => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    const handleValueSelection = (e, form_control, callBackFn, values) => {
        if (typeof e.persist === 'function') e.persist();
        callBackFn(form_control, e.target.value);
        const latest_value = { ...values, [form_control]: e.target.value };
        if (latest_value.risk_tolerance === 'No') {
            onSubmit(getCurrentStep() - 1, latest_value, null, goToNextStep, true);
        }
    };

    const hideElement = condition => {
        if (condition) {
            return { visibility: 'hidden' };
        }
        return {};
    };

    const isAssessmentCompleted = answers => Object.values(answers).every(answer => Boolean(answer));

    return (
        <React.Fragment>
            <div className='trading-assessment'>
                <Text as='p' color='prominent' size='xxs' className='trading-assessment__side-note'>
                    <Localize i18n_default_text='In providing our services to you, we are required to obtain information from you in order to asses whether a given product or service is appropriate for you.' />
                </Text>
                <section className='trading-assessment__header'>
                    <div className='trading-assessment__header--background'>
                        <Button
                            onClick={handlePrevButton}
                            transparent
                            style={hideElement(current_question_index === 0)}
                            type='button'
                        >
                            <Icon icon='IcChevronLeft' color='black' />
                        </Button>
                        <Text as='h1' color='prominent' weight='bold' size='xs'>
                            {current_question_index + 1} {localize('of')} {assessment_questions.length}
                        </Text>
                        <Button
                            onClick={handleNextButton}
                            transparent
                            is_disabled={!is_next_button_enabled}
                            className={classNames({ 'disable-pointer': !is_next_button_enabled })}
                            style={hideElement(current_question_index === end_question_index)}
                            type='button'
                        >
                            <Icon icon='IcChevronRight' color={is_next_button_enabled ? 'black' : 'secondary'} />
                        </Button>
                    </div>
                    <div className='trading-assessment__header--arrow-down' />
                </section>
                <section className='trading-assessment__form'>
                    <Formik
                        innerRef={selected_step_ref}
                        initialValues={{ ...value }}
                        onSubmit={(values, actions) => {
                            onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
                        }}
                    >
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
                                                onChange={e =>
                                                    handleValueSelection(e, form_control, setFieldValue, values)
                                                }
                                                values={values}
                                                form_control={form_control}
                                                setEnableNextSection={setIsNextButtonEnabled}
                                            />
                                        )}
                                    </div>
                                    <Modal.Footer has_separator is_bypassed={isMobile()}>
                                        <FormSubmitButton
                                            cancel_label={localize('Previous')}
                                            has_cancel
                                            is_disabled={!isAssessmentCompleted(values)}
                                            is_absolute={isMobile()}
                                            label={localize('Next')}
                                            onCancel={() => handleCancel(values)}
                                        />
                                    </Modal.Footer>
                                </Form>
                            );
                        }}
                    </Formik>
                </section>
            </div>
        </React.Fragment>
    );
};

export default TradingAssessment;
