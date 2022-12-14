import React, { HTMLAttributes, ReactNode } from 'react';
import './listing-container.scss';
import SelectedAccountCard from './selected-account-card';
import AddOptionsAccount from 'Components/add-options-account';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';

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
    const { tradinghub } = useStores();
    const { has_any_real_account, selected_account_type } = tradinghub;
    const is_demo = selected_account_type === 'demo';
    return (
        <div className='listing-container'>
            <div className='listing-container__top-container'>
                <div className='listing-container__title'>
                    {title}
                    {description}
                </div>
                {is_deriv_platform && <SelectedAccountCard />}
            </div>
            {!is_deriv_platform && !is_demo && !has_any_real_account && <AddOptionsAccount />}
            <div className='listing-container__content'>{children}</div>
        </div>
    );
};

export default observer(ListingContainer);
