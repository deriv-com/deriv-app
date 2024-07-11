import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/quill-ui';
import { Loading } from '@deriv-lib/components';
import { toMoment } from '@deriv-lib/shared';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';
import ContractCardList from './contract-card-list';

type TContractCardsSections = {
    isLoadingMore?: boolean;
    hasBottomMargin?: boolean;
    positions?: TClosedPosition[];
};

const ContractCardsSections = ({ isLoadingMore, hasBottomMargin, positions }: TContractCardsSections) => {
    const formatTime = (time: number) => toMoment(time).format('DD MMM YYYY');

    const dates = positions?.map(element => {
        const purchaseTime = element.contract_info.purchase_time_unix;
        return purchaseTime && formatTime(purchaseTime);
    });

    const uniqueDates = [...new Set(dates)];

    if (!positions?.length) return null;
    return (
        <React.Fragment>
            <div
                className={clsx(
                    'contract-cards-sections',
                    hasBottomMargin && 'contract-cards-sections--has-bottom-margin'
                )}
            >
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
                    </div>
                ))}
            </div>
            {isLoadingMore && <Loading is_fullscreen={false} />}
        </React.Fragment>
    );
};

export default React.memo(ContractCardsSections);
