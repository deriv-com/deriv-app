import React from 'react';
import classNames from 'classnames';

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
    >
        {label}
    </li>
);

export default ListItem;
