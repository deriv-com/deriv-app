import * as React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import YouMightLikeCard from './you-might-like-card';

// TODO: UPDATE ICON STRINGS ONCE NEW SVGS HAVE BEEN UPLOADED
const trader_types = [
    {
        code: '1',
        bg: '/trade-types/bg-options.png',
        icon: 'IcDerivOutline',
        title: localize('Digital options'),
        sub_title: localize('Earn fixed payouts by predicting an asset price movements'),
    },
    {
        code: '2',
        bg: '/trade-types/bg-multipliers.png',
        icon: 'IcDerivOutline',
        title: localize('Multipliers'),
        sub_title: localize('Amplify your gains without losing more than your stake.'),
    },
    {
        code: '3',
        bg: '/trade-types/bg-margin.png',
        icon: 'IcDerivOutline',
        title: localize('Margin'),
        sub_title: localize('Trade with leverage and low spreads for better returns on successful trades.'),
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
                                <YouMightLikeCard
                                    bg_image_url={item.bg}
                                    icon={item.icon}
                                    title={item.title}
                                    subtitle={item.sub_title}
                                />
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
