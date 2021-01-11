import * as React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { AppToTradeBenefit, AppToTradeCard } from './elements';

const AppToTrade: React.FC<TAppToTradeProps> = ({ title, card_data, benefit_description, benefit_data }) => {
    return (
        <div className='dw-template__app-to-trade'>
            <Text size='m' weight='bold' styles={{ lineHeight: '36px' }}>
                {title}
            </Text>
            <div
                className={classNames('dw-template__app-to-trade-card', {
                    'dw-template__app-to-trade-card--three-column': card_data.length === 3,
                })}
            >
                {card_data.map((data, idx) => (
                    <div key={idx}>
                        <AppToTradeCard
                            title={data.title}
                            sub_title={data.sub_title}
                            icon={data.icon}
                            is_big_size={card_data.length === 2}
                        />
                    </div>
                ))}
            </div>
            <div className='dw-template__line' />
            <div>
                <Text styles={{ lineHeight: '24px' }}>{benefit_description}</Text>
                <div
                    className={classNames('dw-template__app-to-trade-benefit', {
                        'dw-template__app-to-trade-benefit--three-column': benefit_data.length / 2 === 3,
                    })}
                >
                    {benefit_data.map((data, idx) => (
                        <div key={idx}>
                            <AppToTradeBenefit icon={data.icon} description={data.description} />
                        </div>
                    ))}
                </div>
            </div>
            <div className='dw-template__line' />
        </div>
    );
};

type TCardDataItem = {
    title: string;
    sub_title: string;
    icon: string;
};
type TBenefitDataItem = {
    description: string;
    icon: string;
};

type TAppToTradeProps = {
    benefit_description: string;
    title: string;
    card_data: Array<TCardDataItem>;
    benefit_data: Array<TBenefitDataItem>;
};

export default observer(AppToTrade);
