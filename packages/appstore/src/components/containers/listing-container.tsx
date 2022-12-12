import React, { HTMLAttributes, ReactNode } from 'react';
import './listing-container.scss';

type ListingContainerProps = {
    title: ReactNode;
    description: ReactNode;
};

const ListingContainer = ({
    title,
    description,
    children,
}: ListingContainerProps & Omit<HTMLAttributes<HTMLDivElement>, 'title'>) => {
    return (
        <div className='listing-container'>
            <div className='listing-container__title'>{title}</div>
            <div className='listing-container__description'> {description}</div>
            <div className='listing-container__content'>{children}</div>
        </div>
    );
};

export default ListingContainer;
