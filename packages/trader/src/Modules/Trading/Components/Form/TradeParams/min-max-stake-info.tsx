import classNames from 'classnames';
import React from 'react';
import { Money, Text } from '@deriv/components';
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

    return (
        <section className={classNames('trade-container__stake-field', className)}>
            {!isNaN(min_stake) &&
                !isNaN(max_stake) &&
                ['Min', 'Max'].map(text => (
                    <Text
                        key={text}
                        as='p'
                        line_height='s'
                        size={isMobile() ? 'xxs' : 'xxxs'}
                        className={`trade-container__stake-field--${text.toLowerCase()}`}
                    >
                        <Localize
                            i18n_default_text='{{text}}. stake<0/>'
                            values={{ text }}
                            components={[
                                <Money
                                    key={0}
                                    amount={text === 'Min' ? min_stake : max_stake}
                                    currency={currency}
                                    show_currency
                                />,
                            ]}
                        />
                    </Text>
                ))}
        </section>
    );
});

export default MinMaxStakeInfo;
