import classNames from 'classnames';
import React from 'react';

type ListItemProps = {
    label: unknown | () => void,
    is_active: boolean,
    onClick: () => void
};

const ListItem = (
    {
        onClick,
        is_active,
        label
    }: ListItemProps
) => <li
    className={classNames({
        'composite-calendar__prepopulated-list--is-active': is_active,
    })}
    onClick={onClick}
>
    {label}
</li>;

export default ListItem;
