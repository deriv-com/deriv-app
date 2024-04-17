import React from 'react';
import { Text } from '@deriv-com/ui';
import { FormDropDownField } from '../../components/FormFields';

type TTradingAssessmentContainer = {
    answerList: { text: string; value: string }[];
    name: string;
    question: string;
};

export const TradingAssessmentContainer = ({ answerList, name, question }: TTradingAssessmentContainer) => {
    return (
        <div className='flex flex-col gap-16'>
            <Text as='p' size='sm' weight='bold'>
                {question}
            </Text>
            <FormDropDownField list={answerList} name={name} />
        </div>
    );
};
