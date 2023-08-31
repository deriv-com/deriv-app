import classNames from 'classnames';
import React from 'react';
import { Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { isMobile, isVanillaContract } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';

type TMinMaxStakeInfo = {
    className?: string;
};
type TStakeBoundary = { [key: string]: { min_stake: number; max_stake: number } };

const MinMaxStakeInfo = observer(({ className }: TMinMaxStakeInfo) => {
    const { contract_type, currency, stake_boundary, vanilla_trade_type } = useTraderStore();
    // remove assertion and local TStakeBoundary type after TS migration for trade package is complete
    const { min_stake, max_stake } =
        (isVanillaContract(contract_type)
            ? (stake_boundary as TStakeBoundary)[vanilla_trade_type]
            : (stake_boundary as TStakeBoundary)[contract_type.toUpperCase()]) || {};

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
