import React, { useState } from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { p2p } from '@deriv/api';
import MyProfileCounterpartiesEmpty from './MyProfileCounterpartiesEmpty';
import MyProfileCounterpartiesHeader from './MyProfileCounterpartiesHeader';
import MyProfileCounterpartiesTable from './MyProfileCounterpartiesTable';
import MyProfileCounterpartiesTableRow from './MyProfileCounterpartiesTableRow';
import './MyProfileCounterparties.scss';

const MyProfileCounterparties = () => {
    const [searchValue, setSearchValue] = useState('');
    const [dropdownValue, setDropdownValue] = useState('all');

    const {
        data = [],
        isFetching,
        isLoading,
        loadMoreAdvertisers,
    } = p2p.advertiser.useGetList({
        trade_partners: 1,
        is_blocked: dropdownValue === 'blocked' ? 1 : 0,
        advertiser_name: searchValue,
    });
    if (!isFetching && data.length === 0 && searchValue === '') {
        return <MyProfileCounterpartiesEmpty />;
    }

    return (
        <div className='p2p-v2-my-profile-counterparties'>
            <Text as='p'>
                {`When you block someone, you won’t see their ads and they won’t be able to place orders on your ads`}
            </Text>
            <MyProfileCounterpartiesHeader
                dropdownValue={dropdownValue}
                setDropdownValue={setDropdownValue}
                setSearchValue={setSearchValue}
            />
            <MyProfileCounterpartiesTable
                columns={[]}
                data={data}
                isFetching={isFetching}
                isLoading={isLoading}
                loadMoreAdvertisers={loadMoreAdvertisers}
                rowRender={item => (
                    <MyProfileCounterpartiesTableRow id={item.id!} isBlocked={item.is_blocked} nickname={item.name!} />
                )}
            />
        </div>
    );
};

export default MyProfileCounterparties;
