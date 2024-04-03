import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { FormSubHeader } from '../../components/FormSubHeader';
import { getTradingAssessmentQuestions } from '../../constants/tradingAssessmentQuestions';
import { RiskToleranceWarningModal } from './RiskToleranceWarningModal';
import { TestWarningModal } from './TestWarningModal';
import { TradingAssessmentContainer } from './TradingAssessmentContainer';

export const TradingAssessmentForm = () => {
    const [shouldShowRiskTolerence, setShouldShowRiskTolerence] = useState(false);
    const [shouldShowTestWarningModal, setShouldShowTestWarningModal] = useState(false);
    const tradingAssessmentQuestions = getTradingAssessmentQuestions();

    const handleAcceptRiskTolerence = () => {
        setShouldShowRiskTolerence(false);
    };

    if (shouldShowRiskTolerence) {
        return (
            <RiskToleranceWarningModal handleSubmit={handleAcceptRiskTolerence} isModalOpen={shouldShowRiskTolerence} />
        );
    }

    if (shouldShowTestWarningModal) {
        return (
            <TestWarningModal
                handleSubmit={() => setShouldShowTestWarningModal(false)}
                isModalOpen={shouldShowTestWarningModal}
            />
        );
    }

    return (
        //TODO: implement onSubmit function and implement initialValues when tradingAssessment hooks is ready
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <Formik initialValues={{}} onSubmit={() => {}}>
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
            </Form>
        </Formik>
    );
};
