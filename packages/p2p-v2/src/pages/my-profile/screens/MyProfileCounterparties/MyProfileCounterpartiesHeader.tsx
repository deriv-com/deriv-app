import React from 'react';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Search } from '../../../../components/Search';
import { Dropdown } from '../../../../components/Dropdown';
import { useDevice } from '../../../../hooks';
import SortIcon from '../../../../public/ic-cashier-sort.svg';
import './MyProfileCounterpartiesHeader.scss';

type MyProfileCounterpartiesHeaderProps = {
    dropdownValue: string;
    onClickFilter: () => void;
    setDropdownValue: (value: string) => void;
    setSearchValue: (value: string) => void;
};

const DROPDOWN_LIST = [
    { value: 'all', text: 'All' },
    { value: 'blocked', text: 'Blocked' },
];

const MyProfileCounterpartiesHeader = ({
    dropdownValue,
    onClickFilter,
    setDropdownValue,
    setSearchValue,
}: MyProfileCounterpartiesHeaderProps) => {
    const { isMobile } = useDevice();
    return (
        <div className='p2p-v2-my-profile-counterparties-header'>
            {/* TODO: to be replaced by deriv-com/ui search component */}
            <Search name='counterparties-search' onSearch={setSearchValue} placeholder='Search by nickname' />
            {/* TODO: to be replaced by deriv-com/ui dropdown component */}
            {isMobile ? (
                <Button className='p2p-v2-my-profile-counterparties-header__sort-icon' onClick={onClickFilter}>
                    <SortIcon />
                </Button>
            ) : (
                <Dropdown
                    label='Filter by'
                    list={DROPDOWN_LIST}
                    listHeight='sm'
                    name='counterparty-filter'
                    onSelect={setDropdownValue}
                    value={dropdownValue}
                />
            )}
        </div>
    );
};
export default MyProfileCounterpartiesHeader;
