import React from 'react';
import { Text } from '@deriv/components';

type TDataListTemplateEntry = {
    title: JSX.Element | string;
    content: JSX.Element | string;
};

const DataListTemplateEntry = ({ title, content }: TDataListTemplateEntry) => {
    const text_size = 'xxs';

    return (
        <React.Fragment>
            <Text size={text_size} weight='bold'>
                {title}
            </Text>
            <Text size={text_size}>{content}</Text>
        </React.Fragment>
    );
};

export default DataListTemplateEntry;
