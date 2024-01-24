import React from 'react';
import { Search } from '../../../../components/Search';
import { Dropdown } from '../../../../components/Dropdown';
import { useDevice } from '../../../../hooks';
import SortIcon from '../../../../public/ic-cashier-sort.svg';
import './MyProfileCounterpartiesHeader.scss';

type MyProfileCounterpartiesHeaderProps = {
    dropdownValue: string;
    setDropdownValue: (value: string) => void;
    setSearchValue: (value: string) => void;
    onClickFilter: () => void;
};

const DROPDOWN_LIST = [
    { value: 'all', text: 'All' },
    { value: 'blocked', text: 'Blocked' },
];

const MyProfileCounterpartiesHeader = ({
    dropdownValue,
    setDropdownValue,
    setSearchValue,
    onClickFilter
}: MyProfileCounterpartiesHeaderProps) => {
    const { isMobile } = useDevice();
    return (
        <div className='p2p-v2-my-profile-counterparties-header'>
            {/* TODO: to be replaced by deriv-com/ui search component */}
            <Search name='counterparties-search' onSearch={setSearchValue} placeholder='Search by nickname' />
            {/* TODO: to be replaced by deriv-com/ui dropdown component */}
            {isMobile ?
                <button className='p2p-v2-my-profile-counterparties-header__sort-icon' onClick={onClickFilter} >
                    <SortIcon />
                </button>
                :
                <Dropdown
                    label='Filter by'
                    list={DROPDOWN_LIST}
                    listHeight='sm'
                    name='counterparty-filter'
                    onSelect={setDropdownValue}
                    value={dropdownValue}
                />
            }
        </div>
    );
}
export default MyProfileCounterpartiesHeader;
