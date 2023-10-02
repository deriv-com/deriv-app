/* eslint-disable simple-import-sort/imports */
import React from 'react';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { observer } from '@deriv/stores';
import './quick-strategy.scss';
import SymbolSelect from './selects/symbol';
import { Form, Formik } from 'formik';
import TradeTypeSelect from './selects/tradetype';
import DurationTypeSelect from './selects/duration-unit';
import { TFormData } from 'Stores/quick-strategy-store-1';
import QSInput from './inputs/qs-input';
import QSInputLabel from './inputs/qs-input-label';

const QuickStrategyForm = observer(() => {
    const { quick_strategy_store_1 } = useDBotStore();
    const { form_data, setFormData } = quick_strategy_store_1;

    const handleSubmit = (form_fields: { [key: string]: string }) => {
        // eslint-disable-next-line no-console
        console.log(form_fields);
    };

    const handleChange = (data: TFormData) => {
        setFormData(data);
    };

    // eslint-disable-next-line no-console
    console.log(form_data, 'form_data');

    const Symbol = () => <SymbolSelect value={form_data.symbol} onChange={handleChange} />;

    const TradeType = () => (
        <TradeTypeSelect value={form_data.trade_type} symbol={form_data.symbol} onChange={handleChange} />
    );

    return (
        <Formik initialValues={{}} onSubmit={handleSubmit}>
            {() => {
                return (
                    <Form>
                        <div className='qs__body__content__form__group'>
                            <Symbol />
                            <TradeType />
                            <div className='qs__form__field'>
                                <QSInputLabel
                                    label={localize('Initial Stake')}
                                    description={localize('The amount that you pay to enter a trade.')}
                                />
                            </div>
                            <div className='qs__form__field'>
                                <QSInput type='number' value={form_data.stake} onChange={handleChange} />
                            </div>
                            <div className='qs__form__field'>
                                <DurationTypeSelect
                                    value={form_data.duration_unit}
                                    data={{
                                        symbol: form_data?.symbol,
                                        trade_type: form_data?.trade_type,
                                    }}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='qs__form__field'>
                                <QSInput type='number' value={form_data.duration_value} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='qs__body__content__form__group'>
                            <div className='qs__form__field'>
                                <QSInputLabel
                                    label={localize('Profit Threshold')}
                                    description={localize(
                                        `The bot will stop trading if your total ${'Profit'} exceeds this amount.`
                                    )}
                                />
                            </div>
                            <div className='qs__form__field'>
                                <QSInput type='number' value={form_data.profit_threshold} onChange={handleChange} />
                            </div>
                            <div className='qs__form__field'>
                                <QSInputLabel
                                    label={localize('Loss Threshold')}
                                    description={localize(
                                        `The bot will stop trading if your total ${'Profit'} exceeds this amount.`
                                    )}
                                />
                            </div>
                            <div className='qs__form__field'>
                                <QSInput type='number' value={form_data.loss_threshold} onChange={handleChange} />
                            </div>
                            <div className='qs__form__field'>
                                <QSInputLabel
                                    label={localize('Size')}
                                    description={localize(
                                        'The multiplier amount used to increase your stake if you’re losing a trade. Value must be higher than 2.'
                                    )}
                                />
                            </div>
                            <div className='qs__form__field'>
                                <QSInput type='number' value={form_data.size} onChange={handleChange} />
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
});

export default QuickStrategyForm;
