import React from 'react';
import { ActionSheet, SectionMessage, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

type TTakeProfitDescriptionProps = {
    is_accumulator?: boolean;
};

const TakeProfitDescription = ({ is_accumulator }: TTakeProfitDescriptionProps) => (
    <ActionSheet.Content className='take-profit__wrapper--definition'>
        <Text>
            <Localize i18n_default_text='When your profit reaches or exceeds the set amount, your trade will be closed automatically.' />
        </Text>
        {is_accumulator && (
            <SectionMessage
                className='take-profit__warning'
                message={
                    <Localize i18n_default_text="Take profit can't be adjusted for ongoing accumulator contracts." />
                }
                size='sm'
                status='info'
            />
        )}
    </ActionSheet.Content>
);

export default TakeProfitDescription;
