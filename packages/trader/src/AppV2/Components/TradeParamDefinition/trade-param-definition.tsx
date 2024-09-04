import React from 'react';
import clsx from 'clsx';
import { ActionSheet, Text } from '@deriv-com/quill-ui';

type TTradeParamDefinitionProps = {
    classname?: string;
    description?: React.ReactNode;
    is_custom_description?: boolean;
};

const TradeParamDefinition = ({ classname, description, is_custom_description }: TTradeParamDefinitionProps) => {
    if (!description) return null;
    return (
        <ActionSheet.Content className={clsx('trade-param-definition', classname)}>
            {is_custom_description ? description : <Text>{description}</Text>}
        </ActionSheet.Content>
    );
};

export default TradeParamDefinition;
