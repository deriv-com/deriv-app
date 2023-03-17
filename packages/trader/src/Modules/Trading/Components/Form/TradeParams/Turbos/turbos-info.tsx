import classNames from 'classnames';
import React from 'react';
import { Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

type TTurbosInfo = {
    className?: string;
};

const TurbosInfo = observer(({ className }: TTurbosInfo) => {
    const {
        modules: { trade },
    } = useStore();
    const { currency, max_stake, min_stake } = trade;
    return (
        <div className={classNames('turbos-trade-info', className)}>
            {['Min', 'Max'].map(text => (
                <Text
                    key={text}
                    as='p'
                    line_height='s'
                    size='xxxs'
                    className={classNames({ [`${className}-tooltip-text`]: className })}
                >
                    <Localize
                        i18n_default_text='{{text}}. stake <0/>'
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
        </div>
    );
});

export default TurbosInfo;
