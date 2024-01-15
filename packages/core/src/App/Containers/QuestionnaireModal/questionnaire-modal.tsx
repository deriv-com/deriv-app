import React from 'react';
import classNames from 'classnames';
import { Analytics } from '@deriv/analytics';
import { Button, Text } from '@deriv/components';
import './questionnaire-modal.scss';

type TAnswers = {
    code: string;
    text: string;
    header?: string;
};
type TABQuestionnaire = {
    id: string;
    question: string;
    show_answers_in_random_order: boolean;
    answers: TAnswers[];
};
export type TQuestionnaireModal = {
    ab_questionnaire: TABQuestionnaire[];
    handleSignup: (...args: any) => void;
};

const QuestionnaireModal = ({ ab_questionnaire, handleSignup }: TQuestionnaireModal) => {
    const a_variant = !!ab_questionnaire[1].answers?.[0]?.header;
    React.useEffect(() => {
        Analytics.trackEvent('ce_questionnaire_form', {
            action: 'open',
        });
    }, [ab_questionnaire]);

    const onClickAnswer = (answer_code: string, answer_index: number) => {
        Analytics.trackEvent('ce_questionnaire_form', {
            action: 'choose_answer',
            question: ab_questionnaire[0].question,
            answer_content: ab_questionnaire[0].answers.filter(({ code }) => code === answer_code)[0].text,
            answer_code,
            answer_index,
        });
        handleSignup();
    };

    return (
        <div className='questionnaire-modal'>
            <Text as='h2' size='xs' weight='bold' align='center'>
                {ab_questionnaire[1].question}
            </Text>
            <ul
                data-testid='questionnaire-modal-variant'
                className={classNames({
                    'questionnaire-modal__answers': a_variant,
                    'questionnaire-modal__options': !a_variant,
                })}
            >
                {ab_questionnaire[1]?.answers.map(({ code, text, header }, index) => {
                    return (
                        <Button
                            key={`${code}_questionnaire`}
                            data-testid={`${code}_questionnaire`}
                            onClick={() => onClickAnswer(code, index + 1)}
                            transparent
                        >
                            <li
                                className={classNames({
                                    'questionnaire-modal__answers_content': a_variant,
                                    'questionnaire-modal__options_card': !a_variant,
                                })}
                            >
                                {header && (
                                    <Text as='p' size='xs' weight='bold'>
                                        {header}
                                    </Text>
                                )}
                                <Text as='p' size='xs'>
                                    {text}
                                </Text>
                            </li>
                        </Button>
                    );
                })}
            </ul>
        </div>
    );
};

export default QuestionnaireModal;
