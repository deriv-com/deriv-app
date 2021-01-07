import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { AppToTradeCard } from '../shared';

const AppToTrade: React.FC<TAppToTradeProps> = ({ title, card_data }) => {
    return (
        <React.Fragment>
            <div className='trade-type-template'>
                <Text size='m' weight='bold' styles={{ lineHeight: '36px' }}>
                    {title}
                </Text>
                <div className='trade-type-template__app-to-trade'>
                    {card_data.map((data, idx) => (
                        <div key={idx}>
                            <AppToTradeCard title={data.title} sub_title={data.sub_title} icon={data.icon} />
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};

type TCardDataItem = {
    title: string;
    sub_title: string;
    icon: string;
};

type TAppToTradeProps = {
    title: string;
    card_data: Array<TCardDataItem>;
};

export default observer(AppToTrade);
