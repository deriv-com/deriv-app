import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { isMobile, isVanillaContract } from '@deriv/shared';

type TMinMaxStakeInfo = {
    className?: string;
};

const MinMaxStakeInfo = observer(({ className }: TMinMaxStakeInfo) => {
    const {
        modules: { trade },
    } = useStore();
    const { contract_type, currency, stake_boundary, vanilla_trade_type } = trade;

    const { min_stake, max_stake } =
        (isVanillaContract(contract_type)
            ? stake_boundary[vanilla_trade_type]
            : stake_boundary[contract_type.toUpperCase()]) || {};

    if (isNaN(min_stake) || isNaN(max_stake)) return null;
    return (
        <section className={classNames('trade-container__stake-field', className)}>
            {['Min', 'Max'].map(text => (
                <Text
                    key={text}
                    as='p'
                    line_height='s'
                    size={isMobile() ? 'xxs' : 'xxxs'}
                    className={`trade-container__stake-field--${text.toLowerCase()}`}
                >
                    <Localize
                        i18n_default_text='{{text}}. stake<0>{{amount}} {{currency}}</0>'
                        values={{ text, amount: text === 'Min' ? min_stake : max_stake, currency }}
                        components={[<Text key={0} size='xxs' line_height='s' />]}
                    />
                </Text>
            ))}
        </section>
    );
});

export default MinMaxStakeInfo;
