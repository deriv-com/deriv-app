import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/quill-ui';
import { getCardLabels } from '@deriv/shared';
import { Money } from '@deriv/components';

type TTotalProfitLossProps = {
    currency?: string;
    hasBottomAlignment?: boolean;
    totalProfitLoss: number;
};

const TotalProfitLoss = ({ currency, hasBottomAlignment, totalProfitLoss }: TTotalProfitLossProps) => (
    <div className={clsx('total-profit-loss', hasBottomAlignment && 'bottom')} data-testid='dt_total_profit_loss'>
        <Text bold size='sm'>
            {getCardLabels().TOTAL_PROFIT_LOSS}
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
