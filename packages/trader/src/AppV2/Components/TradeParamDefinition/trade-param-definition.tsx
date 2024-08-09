import React from 'react';
import { ActionSheet, Text } from '@deriv-com/quill-ui';

type TTradeParamDefinitionProps = {
    description?: React.ReactNode;
};

const TradeParamDefinition = ({ description }: TTradeParamDefinitionProps) => {
    if (!description) return null;
    return (
        <ActionSheet.Content className='trade-param-definition'>
            <Text>{description}</Text>
        </ActionSheet.Content>
    );
};

export default TradeParamDefinition;
