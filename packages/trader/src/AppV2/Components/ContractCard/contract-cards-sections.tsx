import React from 'react';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';
import { TPortfolioPosition } from '@deriv/stores/types';
import { Text } from '@deriv-com/quill-ui';
import { formatDate } from 'AppV2/Utils/positions-utils';
import ContractCardList from './contract-card-list';

type TContractCardsSections = {
    positions?: (TClosedPosition | TPortfolioPosition)[];
};

const ContractCardsSections = ({ positions }: TContractCardsSections) => {
    const dates = positions?.map(element => {
        const sellTime = element.contract_info.sell_time;
        return sellTime && formatDate({ time: sellTime });
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
                            const sellTime = position.contract_info.sell_time;
                            return sellTime && formatDate({ time: sellTime }) === date;
                        })}
                    />
                </div>
            ))}
        </div>
    );
};

export default ContractCardsSections;
