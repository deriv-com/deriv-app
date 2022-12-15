import React, { HTMLAttributes, ReactNode } from 'react';
import CurrencySwitcherCard from 'Components/currency-switcher-card';
import GridContainer from 'Components/containers/grid-container';
import './listing-container.scss';

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
                {is_deriv_platform && <CurrencySwitcherCard />}
            </div>
            <GridContainer>{children}</GridContainer>
        </div>
    );
};

export default ListingContainer;
