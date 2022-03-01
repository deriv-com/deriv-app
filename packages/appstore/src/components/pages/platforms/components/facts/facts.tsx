import * as React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import Divider from 'Components/elements/divider';
import { TStringTranslation } from 'Types';

const Facts: React.FC<TFacts> = ({ leverage, margin_call, stop_out, assets, min_stake, duration }) => {
    return (
        <section className='dw-facts'>
            <Divider horizontal />
            <div className='dw-facts__item-wrapper'>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Leverage')}
                    </Text>
                    <Text weight='bold'>{leverage}</Text>
                </div>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Margin call')}
                    </Text>
                    <Text weight='bold'>{margin_call}</Text>
                </div>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Stop out')}
                    </Text>
                    <Text weight='bold'>{stop_out}</Text>
                </div>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Assets')}
                    </Text>
                    <Text weight='bold'>{assets}</Text>
                </div>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Min. stake')}
                    </Text>
                    <Text weight='bold'>{min_stake}</Text>
                </div>
                <div className='dw-facts__item'>
                    <Text size='xxs' color='less-prominent'>
                        {localize('Duration')}
                    </Text>
                    <Text weight='bold'>{duration}</Text>
                </div>
            </div>
            <Divider horizontal />
        </section>
    );
};

type TFacts = {
    leverage: TStringTranslation;
    margin_call: TStringTranslation;
    stop_out: TStringTranslation;
    assets: TStringTranslation;
    min_stake: TStringTranslation;
    duration: TStringTranslation;
};

export default Facts;
