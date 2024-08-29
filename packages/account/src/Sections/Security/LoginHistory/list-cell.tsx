import { Fragment } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv/components';

type TListCell = {
    title: JSX.Element | string;
    text: JSX.Element | string;
    className?: string;
    align?: 'left' | 'right';
};

const ListCell = ({ title, text, className, align = 'left' }: TListCell) => (
    <Fragment>
        <Text as='h3' align={align} weight='bold' className='login-history__list__row__cell--title'>
            {title}
        </Text>
        <Text
            className={clsx(className, { 'login-history__list__row__cell--right': align === 'right' })}
            line_height='xs'
            size='xs'
            align={align}
        >
            {text}
        </Text>
    </Fragment>
);

export default ListCell;
