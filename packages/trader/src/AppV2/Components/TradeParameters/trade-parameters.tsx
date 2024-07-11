import React from 'react';
import clsx from 'clsx';
import { TextField, Text } from '@deriv-com/quill-ui';
import Guide from '../Guide';

type TTradeParameters = {
    is_minimized?: boolean;
    trade_parameters_list: { label: React.ReactNode; value: string | number }[];
};

const TradeParameters = ({ is_minimized, trade_parameters_list }: TTradeParameters) => (
    <section className={clsx('trade-params', is_minimized && 'trade-params--minimized')}>
        {!is_minimized && (
            <div className='trade-params__title'>
                <Text>Set your trade</Text>
                <Guide has_label />
            </div>
        )}
        <div
            className={clsx(
                'trade-params__options__wrapper',
                is_minimized && 'trade-params__options__wrapper--minimized'
            )}
        >
            {trade_parameters_list.map(({ label, value }) => (
                <TextField
                    variant='fill'
                    readOnly
                    label={label}
                    value={value}
                    key={value}
                    className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                />
            ))}
        </div>
    </section>
);

export default TradeParameters;
