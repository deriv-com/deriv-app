import React from 'react';
import { Text } from '@deriv/components';
import classNames from 'classnames';

type TListCell = {
    title: JSX.Element | string;
    text: JSX.Element | string;
    className?: string;
    is_align_right?: boolean;
};

const ListCell = ({ title, text, className, is_align_right }: TListCell) => (
    <React.Fragment>
        <Text
            as='h3'
            align={is_align_right ? 'right' : 'left'}
            weight='bold'
            className='login-history__list__row__cell--title'
        >
            {title}
        </Text>
        <Text
            className={classNames(className, { 'login-history__list__row__cell--right': is_align_right })}
            line_height='xs'
            size='xs'
            align={is_align_right ? 'right' : 'left'}
        >
            {text}
        </Text>
    </React.Fragment>
);

export default ListCell;
