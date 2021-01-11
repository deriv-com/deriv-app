import * as React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer } from 'mobx-react-lite';
import { YouMightLikeCard } from './elements';

const tradertypes = [
    {
        code: '1',
        bg: 'bg-digital-option',
        title: 'Digital options',
        sub_title: 'Earn fixed payouts by predicting an asset price movements',
    },
    {
        code: '2',
        bg: 'bg-multipliers',
        title: 'Multipliers',
        sub_title: 'Amplify your gains without losing more than your stake.',
    },
    {
        code: '3',
        bg: 'bg-margin',
        title: 'Margin',
        sub_title: 'Trade with leverage and low spreads for better returns on successful trades.',
    },
];
const YouMightLike: React.FC<TYouMightLikeProps> = ({ trade_type }) => {
    return (
        <div className='dw-template__you-might-like'>
            <Text size='sm' weight='bold'>
                {localize('You might also like')}
            </Text>
            <div className='dw-template__you-might-like-wrapper'>
                {tradertypes.map(
                    (item, id) =>
                        trade_type !== item.code && (
                            <div key={id}>
                                <YouMightLikeCard bg_image={item.bg} title={item.title} sub_title={item.sub_title} />
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
export default observer(YouMightLike);
