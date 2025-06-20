import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/quill-ui';
import { toMoment } from '@deriv/shared';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';
import ContractCardList from './contract-card-list';
import { StandaloneLoaderBoldIcon } from '@deriv/quill-icons';

type TContractCardsSections = {
    isLoadingMore?: boolean;
    hasBottomMargin?: boolean;
    positions?: TClosedPosition[];
    currency?: string;
};

const ContractCardsSections = ({ isLoadingMore, hasBottomMargin, positions, currency }: TContractCardsSections) => {
    const formatTime = (time: number | string) => {
        if (typeof time === 'string') {
            const parts = time.split(' ');
            return `${parts[0]} ${parts[1]} ${parts[2]}`;
        }
        return toMoment(time).format('DD MMM YYYY');
    };

    const dates = positions?.map(element => {
        // Use sell_time for closed contracts
        if (element.contract_info.sell_time) {
            return formatTime(element.contract_info.sell_time);
        }
        return element.contract_info.purchase_time_unix && formatTime(element.contract_info.purchase_time_unix);
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
                                // Use sell_time for closed contracts
                                if (position.contract_info.sell_time) {
                                    return formatTime(position.contract_info.sell_time) === date;
                                }
                                return (
                                    position.contract_info.purchase_time_unix &&
                                    formatTime(position.contract_info.purchase_time_unix) === date
                                );
                            })}
                            currency={currency}
                        />
                    </div>
                ))}
            </div>
            {isLoadingMore && (
                <div className='load-more-spinner' data-testid='dt_load_more_spinner'>
                    <StandaloneLoaderBoldIcon iconSize='md' />
                </div>
            )}
        </React.Fragment>
    );
};

export default React.memo(ContractCardsSections);
