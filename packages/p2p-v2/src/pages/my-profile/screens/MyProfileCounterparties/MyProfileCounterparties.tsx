import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './MyProfileCounterparties.scss';
import MyProfileCounterpartiesEmpty from './MyProfileCounterpartiesEmpty';
import MyProfileCounterpartiesHeader from './MyProfileCounterpartiesHeader';
import MyProfileCounterpartiesTable from './MyProfileCounterpartiesTable';
import { useAdvertiserList } from '@deriv/api';

const MyProfileCounterparties = () => {
    const [searchValue, setSearchValue] = React.useState('');
    const [dropdownValue, setDropdownValue] = React.useState('all');

    console.log('dropdownvalue', dropdownValue);

    const { data } = useAdvertiserList({ trade_partners: 1, advertiser_name: searchValue, is_blocked: dropdownValue === 'blocked' ? 1: 0  });
    
    if (false) {
        return <MyProfileCounterpartiesEmpty />
    }
    return <>
        <Text as='p' >
            {`When you block someone, you won’t see their ads and they won’t be able to place orders on your ads`}
        </Text>
        <MyProfileCounterpartiesEmpty />
        <MyProfileCounterpartiesHeader dropdownValue={dropdownValue} setDropdownValue={setDropdownValue} searchValue={searchValue} />
        <MyProfileCounterpartiesTable />
        </>
};

export default MyProfileCounterparties;
