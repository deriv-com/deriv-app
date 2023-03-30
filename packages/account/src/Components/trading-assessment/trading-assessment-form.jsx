import classNames from 'classnames';
import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize, getLanguage } from '@deriv/translations';
import TradingAssessmentRadioButton from './trading-assessment-radio-buttons.jsx';
import TradingAssessmentDropdown from './trading-assessment-dropdown.jsx';

const TradingAssessmentForm = ({
    assessment_questions,
    class_name,
    disabled_items,
    form_value,
    onSubmit,
    onCancel,
    should_move_to_next,
    setSubSectionIndex,
    is_independent_section,
}) => {
    const [is_section_filled, setIsSectionFilled] = React.useState(false);
    const [should_inform_user, shouldInformUser] = React.useState(false);
    const [current_question_details, setCurrentQuestionDetails] = React.useState({
        current_question_index: 0,
        current_question: {},
    });
    const [form_data, setFormData] = React.useState({});

    const stored_items = parseInt(localStorage.getItem('current_question_index') || '0');
    const last_question_index = assessment_questions.length - 1;
    const should_display_previous_button = is_independent_section
        ? current_question_details.current_question_index !== 0
        : true;

    const verifyIfAllFieldsFilled = () => {
        shouldInformUser(!is_section_filled);
        setTimeout(() => {
            shouldInformUser(false);
        }, 500);
    };

    React.useEffect(() => {
        setCurrentQuestionDetails(prevState => {
            return {
                ...prevState,
                current_question_index: stored_items || 0,
                current_question: stored_items
                    ? assessment_questions[stored_items]
                    : assessment_questions[prevState.current_question_index],
            };
        });
        if (!is_independent_section) {
            setSubSectionIndex(stored_items);
        }
        setFormData(form_value);
    }, []);

    React.useEffect(() => {
        if (should_move_to_next) displayNextPage();
    }, [should_move_to_next]);

    const displayNextPage = () => {
        if (form_data.risk_tolerance === 'No') {
            // onSubmit hold reference to a function that takes 3 params - values, action and should_override
            onSubmit(form_data, null, true);
        } else {
            const next_question = current_question_details.current_question_index + 1;

            if (next_question < assessment_questions.length) {
                setCurrentQuestionDetails(prev_state_question => {
                    const next_state_question_index = prev_state_question.current_question_index + 1;
                    localStorage.setItem('current_question_index', next_state_question_index);
                    // Sub section form progress is not required when the section is independent
                    if (!is_independent_section) {
                        setSubSectionIndex(next_state_question_index);
                    }
                    return {
                        current_question_index: next_state_question_index,
                        current_question: assessment_questions[next_state_question_index],
                    };
                });
            }
        }
    };

    const displayPreviousPage = () => {
        const prev_question = current_question_details.current_question_index - 1;
        if (prev_question >= 0) {
            setCurrentQuestionDetails(prev_state_question => {
                const prev_state_question_index = prev_state_question.current_question_index - 1;
                localStorage.setItem('current_question_index', prev_state_question_index);
                if (!is_independent_section) {
                    setSubSectionIndex(prev_state_question_index);
                }
                return {
                    current_question_index: prev_state_question_index,
                    current_question: assessment_questions[prev_state_question_index],
                };
            });
        } else {
            onCancel(form_data);
        }
    };

    const handleValueSelection = (e, form_control, callBackFn) => {
        if (typeof e.persist === 'function') e.persist();
        callBackFn(form_control, e.target.value);
        setFormData(prev_form => ({ ...prev_form, [form_control]: e.target.value }));
    };

    const isAssessmentCompleted = answers => Object.values(answers).every(answer => Boolean(answer));

    const nextButtonHandler = values => {
        verifyIfAllFieldsFilled();
        if (is_section_filled) {
            if (isAssessmentCompleted(values) && stored_items === last_question_index) onSubmit(values);
            else displayNextPage();
        }
    };

    return (
        <div className={classNames('trading-assessment', class_name)}>
            <Text as='p' color='prominent' size='xxs' className='trading-assessment__side-note'>
                <Localize i18n_default_text='In providing our services to you, we are required to obtain information from you in order to assess whether a given product or service is appropriate for you.' />
            </Text>
            <section className={'trading-assessment__form'}>
                <Formik initialValues={{ ...form_value }}>
                    {({ setFieldValue, values }) => {
                        const { question_text, form_control, answer_options, questions } =
                            current_question_details.current_question;

                        return (
                            <Form className='trading-assessment__form--layout'>
                                <div
                                    className={classNames('trading-assessment__form--fields', {
                                        highlight: should_inform_user,
                                        'field-layout': ['ID', 'FR'].includes(getLanguage()),
                                    })}
                                >
                                    {questions?.length ? (
                                        <TradingAssessmentDropdown
                                            item_list={questions}
                                            onChange={handleValueSelection}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            setEnableNextSection={setIsSectionFilled}
                                            disabled_items={disabled_items ?? []}
                                        />
                                    ) : (
                                        <TradingAssessmentRadioButton
                                            text={question_text}
                                            list={answer_options ?? []}
                                            onChange={e => handleValueSelection(e, form_control, setFieldValue, values)}
                                            values={values}
                                            form_control={form_control}
                                            setEnableNextSection={setIsSectionFilled}
                                            disabled_items={disabled_items ?? []}
                                        />
                                    )}
                                </div>
                                <Modal.Footer
                                    has_separator
                                    is_bypassed={isMobile()}
                                    className='trading-assessment__existing_btn '
                                >
                                    <Button.Group className='trading-assessment__btn-group'>
                                        {should_display_previous_button && (
                                            <Button
                                                has_effect
                                                onClick={displayPreviousPage}
                                                text={localize('Previous')}
                                                type='button'
                                                secondary
                                                large
                                                className='trading-assessment__btn-group--btn'
                                            />
                                        )}
                                        <Button
                                            has_effect
                                            onClick={() => nextButtonHandler(values)}
                                            type='button'
                                            text={localize('Next')}
                                            large
                                            primary
                                            className='trading-assessment__btn-group--btn'
                                            name='Next'
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

export default TradingAssessmentForm;
