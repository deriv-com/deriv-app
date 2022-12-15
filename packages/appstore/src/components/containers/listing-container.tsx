import React, { HTMLAttributes, ReactNode } from 'react';
import './listing-container.scss';
import SelectedAccountCard from './selected-account-card';

type ListingContainerProps = {
    title: ReactNode;
    description: ReactNode;
    is_deriv_platform?: boolean;
};

const ListingContainer = ({
    title,
    description,
    is_deriv_platform = false,
    children,
}: ListingContainerProps & Omit<HTMLAttributes<HTMLDivElement>, 'title'>) => {
    return (
        <div className='listing-container'>
            <div className='listing-container__top-container'>
                <div className='listing-container__title'>
                    {title}
                    {description}
                </div>
                {is_deriv_platform && <SelectedAccountCard />}
            </div>
            <div className='listing-container__content'>{children}</div>
        </div>
    );
};

export default ListingContainer;
