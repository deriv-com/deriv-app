import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/quill-ui';
import { getCardLabels } from '@deriv/shared';
import { Money } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TTotalProfitLossProps = {
    currency?: string;
    hasBottomAlignment?: boolean;
    positionsCount?: number | string;
    totalProfitLoss: number;
};

const TotalProfitLoss = ({
    currency,
    hasBottomAlignment,
    positionsCount = '',
    totalProfitLoss,
}: TTotalProfitLossProps) => (
    <div className={clsx('total-profit-loss', hasBottomAlignment && 'bottom')} data-testid='dt_total_profit_loss'>
        <Text bold size='sm'>
            {hasBottomAlignment ? (
                <Localize i18n_default_text='Last {{positionsCount}} contracts:' values={{ positionsCount }} />
            ) : (
                getCardLabels().TOTAL_PROFIT_LOSS
            )}
        </Text>
        <Text
            className={clsx('total-profit-loss__amount', {
                positive: totalProfitLoss > 0,
                negative: totalProfitLoss < 0,
            })}
            bold
            size='sm'
        >
            <Money amount={totalProfitLoss} currency={currency} show_currency has_sign />
        </Text>
    </div>
);

export default TotalProfitLoss;
