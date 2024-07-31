import React from 'react';
import { ActionSheet, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

const TakeProfitDescription = () => (
    <ActionSheet.Content className='take-profit__wrapper--definition'>
        <Text>
            <Localize i18n_default_text='When your profit reaches or exceeds the set amount, your trade will be closed automatically.' />
        </Text>
    </ActionSheet.Content>
);

export default TakeProfitDescription;
