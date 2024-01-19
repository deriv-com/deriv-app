import React from 'react';
import './MyProfileCounterpartiesHeader.scss';
import { Search } from '../../../../components/Search';
import { Dropdown } from '../../../../components/Dropdown';

type MyProfileCounterpartiesHeaderProps = {
    searchValue: string;
    dropdownValue: string;
    setDropdownValue: (value: string) => void;
};

const DROPDOWN_LIST = [
    { value: 'all', text: 'All' },
    { value: 'blocked', text: 'Blocked' },
];

const MyProfileCounterpartiesHeader = ({ searchValue, dropdownValue, setDropdownValue }: MyProfileCounterpartiesHeaderProps) => {

    return <div className='p2p-v2-my-profile-counterparties-header'>    
       <Search name='counterparties-search' placeholder='Search by nickname' />
       <Dropdown
            label='Filter by'
            list={DROPDOWN_LIST}
            listHeight='sm'
            name='counterparty-filter'
            onSelect={setDropdownValue}
            value={dropdownValue}
        />
    </div>
}

export default MyProfileCounterpartiesHeader;
