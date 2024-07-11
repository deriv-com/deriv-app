import React from 'react';
import clsx from 'clsx';
import { Button, TextField, Text } from '@deriv-com/quill-ui';
import { LabelPairedPresentationScreenSmRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

type TTradeParameters = {
    is_minimized?: boolean;
    trade_parameters_list: { label: React.ReactNode; value: string | number }[];
};

const TradeParameters = ({ is_minimized, trade_parameters_list }: TTradeParameters) => (
    <section className={clsx('trade-params', is_minimized && 'trade-params--minimized')}>
        {!is_minimized && (
            <div className='trade-params__title'>
                <Text>Set your trade</Text>
                {/* TODO: temporary, until Guide component will be merged */}
                <Button
                    color='black'
                    icon={<LabelPairedPresentationScreenSmRegularIcon />}
                    label={<Localize i18n_default_text='Guide' />}
                    variant='secondary'
                />
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
