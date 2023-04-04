import React, { HTMLAttributes, ReactNode } from 'react';
import CurrencySwitcherCard from 'Components/currency-switcher-card';
import GridContainer from 'Components/containers/grid-container';
import './listing-container.scss';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';
import TitleCardLoader from 'Components/pre-loader/title-card-loader';

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
    const { client } = useStores();
    const { is_landing_company_loaded } = client;

    const Options = () => {
        if (is_landing_company_loaded) {
            return (
                <div className='listing-container__title'>
                    {title}
                    {description}
                </div>
            );
        } else if (!is_deriv_platform) {
            return (
                <div className='listing-container__title'>
                    {title}
                    {description}
                </div>
            );
        }
        return <TitleCardLoader />;
    };

    return (
        <div className='listing-container'>
            <div className='listing-container__top-container'>
                <Options />
                {is_deriv_platform && <CurrencySwitcherCard />}
            </div>
            <GridContainer>{children}</GridContainer>
        </div>
    );
};

export default observer(ListingContainer);
