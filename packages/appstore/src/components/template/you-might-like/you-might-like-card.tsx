import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from '@deriv/translations';

const YouMightLikeCard: React.FC<TYouMightLikeCardProps> = ({ title, subtitle }) => {
    return (
        <div className='dw-you-might-like__card'>
            <Text weight='bold' line_height='l'>
                {localize(title)}
            </Text>
            <Text size='xs' color='less-prominent' line_height='m'>
                {localize(subtitle)}
            </Text>
        </div>
    );
};

type TYouMightLikeCardProps = {
    bg_image_url: string;
    title: string;
    subtitle: string;
};

export default observer(YouMightLikeCard);
