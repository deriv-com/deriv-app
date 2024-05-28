import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { Loading } from '@deriv/components';
import { toMoment } from '@deriv/shared';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';
import ContractCardList from './contract-card-list';

type TContractCardsSections = {
    isLoadingMore?: boolean;
    positions?: TClosedPosition[];
};

const ContractCardsSections = ({ isLoadingMore, positions }: TContractCardsSections) => {
    const formatTime = (time: number) => toMoment(time).format('DD MMM YYYY');

    const dates = positions?.map(element => {
        const purchaseTime = element.contract_info.purchase_time_unix;
        return purchaseTime && formatTime(purchaseTime);
    });

    const uniqueDates = [...new Set(dates)];

    if (!positions?.length) return null;
    return (
        <div className='contract-cards-sections'>
            {uniqueDates.map(date => (
                <div className='contract-cards-section' key={date}>
                    <Text as='p' className='contract-cards-section__title' bold size='sm'>
                        {date}
                    </Text>
                    <ContractCardList
                        positions={positions.filter(position => {
                            const purchaseTime = position.contract_info.purchase_time_unix;
                            return purchaseTime && formatTime(purchaseTime) === date;
                        })}
                    />
                    {isLoadingMore && <Loading is_fullscreen={false} />}
                </div>
            ))}
        </div>
    );
};

export default React.memo(ContractCardsSections);
