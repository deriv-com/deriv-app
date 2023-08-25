import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const AccumulatorTradeDescription = ({ onClick }: { onClick: () => void }) => {
    return (
        <React.Fragment>
            <Text as='p'>
                <Localize
                    i18n_default_text={
                        'Accumulators allow you to express a view on the range of movement of an index and grow your stake exponentially at a fixed <0>growth rate</0>.'
                    }
                    components={[<span className='contract-type-info__content-definition' onClick={onClick} key={0} />]}
                />
            </Text>
            <Text as='p'>
                <Localize
                    i18n_default_text={'Your <0>payout</0> is the sum of your inital stake and profit.'}
                    components={[<span className='contract-type-info__content-definition' onClick={onClick} key={0} />]}
                />
            </Text>
            <Text as='p'>
                <Localize
                    i18n_default_text={
                        'Your stake will continue to grow as long as the current spot price remains within a specified <0>range</0> from the <0>previous spot price</0>. Otherwise, you lose your stake and the trade is terminated.'
                    }
                    components={[<span className='contract-type-info__content-definition' onClick={onClick} key={0} />]}
                />
            </Text>
            <Text as='p'>
                <Localize
                    i18n_default_text={'You can close your trade anytime. However, be aware of <0>slippage risk<0/>.'}
                    components={[<span className='contract-type-info__content-definition' onClick={onClick} key={0} />]}
                />
            </Text>
        </React.Fragment>
    );
};

export default AccumulatorTradeDescription;
