import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { getCardLabels } from '@deriv/shared';
import { Money } from '@deriv/components';
import classNames from 'classnames';

type TTotalProfitLossProps = {
    currency?: string;
    hasBottomAlignment?: boolean;
    totalProfitLoss: number;
};

const TotalProfitLoss = ({ currency, hasBottomAlignment, totalProfitLoss }: TTotalProfitLossProps) => (
    <div className={classNames('total-profit-loss', { bottom: hasBottomAlignment })} data-testid='dt_total_profit_loss'>
        <Text bold size='sm'>
            {getCardLabels().TOTAL_PROFIT_LOSS}
        </Text>
        <Text
            className={classNames('total-profit-loss__amount', {
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
