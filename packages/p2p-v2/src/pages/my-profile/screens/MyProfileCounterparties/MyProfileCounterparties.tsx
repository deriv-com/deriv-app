import React, { PropsWithChildren, useState } from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { useDevice } from '../../../../hooks';
import { BlockUnblockUserFilterModal } from '../../../../components/Modals/BlockUnblockUserFilterModal';
import { FullPageMobileWrapper } from '../../../../components';
import MyProfileCounterpartiesHeader from './MyProfileCounterpartiesHeader';
import MyProfileCounterpartiesTable from './MyProfileCounterpartiesTable';
import './MyProfileCounterparties.scss';

type TMyProfileCounterpartiesTableRowRendererProps = {
    id?: string | undefined;
    is_blocked: boolean;
    name?: string | undefined;
};

const MyProfileCounterpartiesDisplayWrapper = ({ children }: PropsWithChildren<unknown>) => {
    const { isMobile } = useDevice();
    if (isMobile) {
        return (
            <FullPageMobileWrapper
                renderHeader={() => (
                    <Text className='p2p-v2-my-profile-counterparties__header' size='md' weight='bold'>
                        My counterparties
                    </Text>
                )}
            >
                {children}
            </FullPageMobileWrapper>
        );
    }
    return children;
};

const MyProfileCounterparties = () => {
    const [searchValue, setSearchValue] = useState('');
    const [dropdownValue, setDropdownValue] = useState('all');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(false);

    const onClickFilter = () => {
        setIsFilterModalOpen(true);
    };

    const onToggle = (value: string) => {
        setDropdownValue(value);
        setIsFilterModalOpen(false);
    };

    return (
        <MyProfileCounterpartiesDisplayWrapper>
            <div className='p2p-v2-my-profile-counterparties'>
                {showHeader && (
                    <MyProfileCounterpartiesHeader
                        dropdownValue={dropdownValue}
                        onClickFilter={onClickFilter}
                        setDropdownValue={setDropdownValue}
                        setSearchValue={setSearchValue}
                    />
                )}
                <div className='p2p-v2-my-profile-counterparties__content'>
                    <MyProfileCounterpartiesTable
                        dropdownValue={dropdownValue}
                        searchValue={searchValue}
                        setShowHeader={setShowHeader}
                    />
                </div>
                <BlockUnblockUserFilterModal
                    isModalOpen={isFilterModalOpen}
                    onRequestClose={() => setIsFilterModalOpen(false)}
                    onToggle={onToggle}
                    selected={dropdownValue}
                />
            </div>
        </MyProfileCounterpartiesDisplayWrapper>
    );
};

export default MyProfileCounterparties;
