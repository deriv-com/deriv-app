import React from 'react';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown, Text } from '@deriv-com/ui';

type TTradingAssessmentContainer = {
    answerList: { text: string; value: string }[];
    key: React.Key;
    name: string;
    question: string;
};

export const TradingAssessmentContainer = ({ answerList, key, name, question }: TTradingAssessmentContainer) => {
    return (
        <div className='flex flex-col gap-16' key={key}>
            <Text as='p' size='sm' weight='bold'>
                {question}
            </Text>
            <Dropdown
                dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                list={answerList}
                name={name}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onSelect={() => {}}
            />
        </div>
    );
};
