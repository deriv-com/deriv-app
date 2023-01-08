import classNames from 'classnames';
import React from 'react';

type TListItem = {
    label: string | React.ReactElement | Array<string>;
    is_active: boolean;
    onClick: () => void;
};

const ListItem = ({ onClick, is_active, label }: TListItem) => (
    <li
        className={classNames({
            'composite-calendar__prepopulated-list--is-active': is_active,
        })}
        onClick={onClick}
    >
        {label}
    </li>
);

export default ListItem;
