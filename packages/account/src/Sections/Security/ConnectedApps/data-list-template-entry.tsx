import { Fragment } from 'react';
import { Text } from '@deriv/components';

type TDataListTemplateEntry = {
    title: JSX.Element | string;
    content: JSX.Element | string;
};

const DataListTemplateEntry = ({ title, content }: TDataListTemplateEntry) => (
    <Fragment>
        <Text size='xxs' weight='bold'>
            {title}
        </Text>
        <Text size='xxs'>{content}</Text>
    </Fragment>
);

export default DataListTemplateEntry;
