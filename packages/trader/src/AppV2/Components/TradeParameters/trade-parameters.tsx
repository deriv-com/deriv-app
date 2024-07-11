import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import clsx from 'clsx';
import Guide from '../Guide';
import TradeParams from './trade-params';

type TTradeParameters = {
    is_minimized?: boolean;
};

const TradeParameters = ({ is_minimized }: TTradeParameters) => {
    return (
        <section className={clsx('trade-params', is_minimized && 'trade-params--minimized')}>
            {!is_minimized && (
                <div className='trade-params__title'>
                    <Text>Set your trade</Text>
                    <Guide has_label />
                </div>
            )}
            <TradeParams is_minimized={is_minimized} />
        </section>
    );
};

export default TradeParameters;
