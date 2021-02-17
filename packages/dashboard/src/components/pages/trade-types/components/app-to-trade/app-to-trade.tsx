import * as React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import AppToTradeCard from './app-to-trade-card';

const AppToTrade: React.FC<TAppToTradeProps> = ({ title, cards, benefit_description }) => {
    return (
        <div className='dw-app-to-trade'>
            <Text size='m' as='h3' weight='bold' line_height='m'>
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
            <Text className='dw-app-to-trade__benefit-description' line_height='m' as='p'>
                {benefit_description}
            </Text>
        </div>
    );
};

type TCardDataItem = {
    title: string;
    sub_title: string;
    icon: string;
};

type TAppToTradeProps = {
    benefit_description: string;
    title: string;
    cards: Array<TCardDataItem>;
};

export default AppToTrade;
