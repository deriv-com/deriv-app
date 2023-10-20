import React from 'react';
import { Text } from '@deriv/components';

type TDataListTemplateEntry = {
    title: JSX.Element | string;
    content: JSX.Element | string;
};

const DataListTemplateEntry = ({ title, content }: TDataListTemplateEntry) => (
    <React.Fragment>
        <Text size='xxs' weight='bold'>
            {title}
        </Text>
        <Text size='xxs'>{content}</Text>
    </React.Fragment>
);

export default DataListTemplateEntry;
