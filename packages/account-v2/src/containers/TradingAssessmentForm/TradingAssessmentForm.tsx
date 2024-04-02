import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { Button } from '@deriv-com/ui';
import { FormSubHeader } from '../../components/FormSubHeader';
import { getTradingAssessmentQuestions } from '../../constants/tradingAssessmentQuestions';
import { RiskToleranceWarningModal } from './RiskToleranceWarningModal';
import { TradingAssessmentContainer } from './TradingAssessmentContainer';

export const TradingAssessmentForm = () => {
    const [shouldShowRiskTolerence, setshouldShowRiskTolerence] = useState(false);
    const tradingAssessmentQuestions = getTradingAssessmentQuestions();

    const handleSubmit = () => {
        setshouldShowRiskTolerence(true);
    };

    const handleAcceptRiskTolerence = () => {
        setshouldShowRiskTolerence(false);
    };

    if (shouldShowRiskTolerence) {
        return (
            <RiskToleranceWarningModal handleSubmit={handleAcceptRiskTolerence} isModalOpen={shouldShowRiskTolerence} />
        );
    }

    return (
        <Formik initialValues={''} onSubmit={handleSubmit}>
            <Form>
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
                        }
                        return item?.questions?.map(question => (
                            <TradingAssessmentContainer
                                answerList={question.answerOptions}
                                key={question.formControl}
                                name={question.formControl}
                                question={question.questionText}
                            />
                        ));
                    })}
                </div>
                <div className='sticky bottom-0 flex justify-end flex-shrink-0 w-full px-24 py-16 border-solid bg-solid-slate-0 border-t-1 border-solid-grey-2'>
                    <Button disabled={false} isFullWidth={false} isLoading={false} size='lg' type='submit'>
                        Submit
                    </Button>
                </div>
            </Form>
        </Formik>
    );
};
