import * as React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import Divider from 'Components/elements/divider';

const Facts: React.FC = () => {
    return (
        <section className='dw-facts'>
            <Divider horizontal />
            <div className='dw-facts__item-wrapper'>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Leverage')}
                    </Text>
                    <Text weight='bold'>{localize('Up to 1:4000')}</Text>
                </div>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Margin call')}
                    </Text>
                    <Text weight='bold'>{localize('100%')}</Text>
                </div>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Stop out')}
                    </Text>
                    <Text weight='bold'>{localize('50%')}</Text>
                </div>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Assets')}
                    </Text>
                    <Text weight='bold'>{localize('10')}</Text>
                </div>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Min. stake')}
                    </Text>
                    <Text weight='bold'>{localize('$5')}</Text>
                </div>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Duration')}
                    </Text>
                    <Text weight='bold'>{localize('1 tick - 365 days')}</Text>
                </div>
            </div>
            <Divider horizontal />
        </section>
    );
};

export default Facts;
