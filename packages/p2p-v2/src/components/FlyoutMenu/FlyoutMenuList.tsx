import React, { isValidElement, ReactNode } from 'react';

type TFlyoutListProps = {
    isOpen?: boolean;
    listItems?: ReactNode[];
};

const FlyoutList = ({ isOpen = false, listItems }: TFlyoutListProps) => {
    return isOpen ? (
        <ul className='p2p-v2-flyout-menu__list'>
            {listItems?.map(listItem => {
                return <li key={isValidElement(listItem) ? listItem.key : listItem?.toString()}>{listItem}</li>;
            })}
        </ul>
    ) : null;
};

export default FlyoutList;
