import React, { PropsWithChildren, useState } from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { p2p } from '@deriv/api';
import { useDevice } from '../../../../hooks';
import { BlockUnblockUserFilterModal } from '../../../../components/Modals/BlockUnblockUserFilterModal';
import { FullPageMobileWrapper } from '../../../../components';
import MyProfileCounterpartiesEmpty from './MyProfileCounterpartiesEmpty';
import MyProfileCounterpartiesHeader from './MyProfileCounterpartiesHeader';
import MyProfileCounterpartiesTable from './MyProfileCounterpartiesTable';
import MyProfileCounterpartiesTableRow from './MyProfileCounterpartiesTableRow';
import './MyProfileCounterparties.scss';

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
                <Text as='p' size='sm'>
                    {`When you block someone, you won’t see their ads, and they can’t see yours. Your ads will be hidden from their search results, too.`}
                </Text>
                <MyProfileCounterpartiesHeader
                    dropdownValue={dropdownValue}
                    onClickFilter={onClickFilter}
                    setDropdownValue={setDropdownValue}
                    setSearchValue={setSearchValue}
                />
                <div className='p2p-v2-my-profile-counterparties__content'>
                    <MyProfileCounterpartiesTable
                        columns={[]}
                        data={data}
                        isFetching={isFetching}
                        isLoading={isLoading}
                        loadMoreAdvertisers={loadMoreAdvertisers}
                        rowRender={item => (
                            <MyProfileCounterpartiesTableRow
                                id={item.id!}
                                isBlocked={item.is_blocked}
                                nickname={item.name!}
                            />
                        )}
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
