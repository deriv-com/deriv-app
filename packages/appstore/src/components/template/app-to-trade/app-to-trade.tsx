import * as React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import AppToTradeCard from './app-to-trade-card';
import AppToTradeBenefit from './app-to-trade-benefit';

const AppToTrade: React.FC<TAppToTradeProps> = ({ title, cards, benefit_description, benefit_data }) => {
    return (
        <div className='dw-app-to-trade'>
            <Text size='m' weight='bold' line_height='m'>
                {title}
            </Text>
            <div
                className={classNames('dw-app-to-trade__cards-wrapper', {
                    'dw-app-to-trade__cards-wrapper--three-column': cards.length === 3,
                })}
            >
                {cards.map((data, idx) => (
                    <div key={idx}>
                        <AppToTradeCard
                            title={data.title}
                            subtitle={data.sub_title}
                            icon={data.icon}
                            is_big_size={cards.length <= 2} // if the cards are less than 2, they should be in big size
                        />
                    </div>
                ))}
            </div>
            <div className='dw-app-to-trade__line' />
            <Text line_height='m'>{benefit_description}</Text>
            <div
                className={classNames('dw-app-to-trade__benefits-wrapper', {
                    'dw-app-to-trade__benefits-wrapper--three-column': benefit_data.length / 2 === 3,
                })}
            >
                {benefit_data.map((data, idx) => (
                    <div key={idx}>
                        <AppToTradeBenefit icon={data.icon} description={data.description} />
                    </div>
                ))}
            </div>

            <div className='dw-app-to-trade__line' />
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
    cards: Array<TCardDataItem>;
    benefit_data: Array<TBenefitDataItem>;
};

export default AppToTrade;
