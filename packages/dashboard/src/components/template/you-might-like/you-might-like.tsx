import * as React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import YouMightLikeCard from './you-might-like-card';

const trader_types = [
    {
        code: '1',
        bg: 'trade-type/bg-digital-option.png',
        title: 'Digital options',
        sub_title: 'Earn fixed payouts by predicting an asset price movements',
    },
    {
        code: '2',
        bg: 'trade-type/bg-multipliers.png',
        title: 'Multipliers',
        sub_title: 'Amplify your gains without losing more than your stake.',
    },
    {
        code: '3',
        bg: 'trade-type/bg-margin.png',
        title: 'Margin',
        sub_title: 'Trade with leverage and low spreads for better returns on successful trades.',
    },
];
const YouMightLike: React.FC<TYouMightLikeProps> = ({ trade_type }) => {
    return (
        <div className='dw-you-might-like'>
            <Text size='sm' weight='bold'>
                {localize('You might also like')}
            </Text>
            <div className='dw-you-might-like__wrapper'>
                {trader_types.map(
                    item =>
                        trade_type !== item.code && (
                            <div key={item.code}>
                                <YouMightLikeCard bg_image_url={item.bg} title={item.title} subtitle={item.sub_title} />
                            </div>
                        )
                )}
            </div>
        </div>
    );
};

type TYouMightLikeProps = {
    trade_type: string;
};
export default YouMightLike;
