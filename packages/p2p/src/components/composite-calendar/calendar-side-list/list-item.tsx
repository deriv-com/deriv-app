import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';

type TListItem = {
    label: string | React.ReactElement | Array<string>;
    is_active: boolean;
    onClick: () => void;
};

const ListItem = ({ onClick, is_active, label }: TListItem) => (
    <li
        className={classNames({
            'calendar-side-list--is-active': is_active,
        })}
        onClick={onClick}
        onKeyDown={onClick}
    >
        <Text weight={is_active ? 'bold' : 'normal'} size='xs' line_height='xl'>
            {label}
        </Text>
    </li>
);

export default ListItem;
