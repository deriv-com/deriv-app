import React from 'react';
import { FormSubHeader } from '../../components/FormSubHeader';
import { getTradingAssessmentQuestions } from '../../constants/tradingAssessmentQuestions';
import { TradingAssessmentContainer } from './TradingAssessmentContainer';

export const TradingAssessmentForm = () => {
    const tradingAssessmentQuestions = getTradingAssessmentQuestions();
    return (
        <div>
            <FormSubHeader>Trading assessment</FormSubHeader>
            {tradingAssessmentQuestions.map(item => {
                if (item.fieldType === 'radio') {
                    return (
                        <TradingAssessmentContainer
                            answerList={item.answerOptions}
                            key={item.formControl}
                            name={item.formControl}
                            question={item.questionText}
                        />
                    );
                    // eslint-disable-next-line no-else-return
                } else {
                    return item?.questions?.map(question => (
                        <TradingAssessmentContainer
                            answerList={question.answerOptions}
                            key={question.formControl}
                            name={question.formControl}
                            question={question.questionText}
                        />
                    ));
                }
            })}
        </div>
    );
};
