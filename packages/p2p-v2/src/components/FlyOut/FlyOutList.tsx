import React, { isValidElement, ReactNode } from 'react';

type TFlyOutListProps = {
    isOpen?: boolean;
    listItems?: ReactNode[];
};

const FlyOutList = ({ isOpen = false, listItems }: TFlyOutListProps) => {
    return isOpen ? (
        <ul className='p2p-v2-flyout__list'>
            {listItems?.map(listItem => {
                return <li key={isValidElement(listItem) ? listItem.key : listItem?.toString()}>{listItem}</li>;
            })}
        </ul>
    ) : null;
};

export default FlyOutList;
