import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TDataListTemplateEntry = {
    title: string;
    content: string;
};

const DataListTemplateEntry = ({ title, content }: TDataListTemplateEntry) => {
    const text_size = 'xxs';

    return (
        <React.Fragment>
            <Text size={text_size} weight='bold'>
                <Localize i18n_default_text={title} />
            </Text>
            <Text size={text_size}>
                <Localize i18n_default_text={content} />
            </Text>
        </React.Fragment>
    );
};

export default DataListTemplateEntry;
