/* eslint-disable simple-import-sort/imports */
import React from 'react';
import { useDBotStore } from 'Stores/useDBotStore';
import { observer } from '@deriv/stores';
import './quick-strategy.scss';
import SymbolSelect from './selects/symbol';
import { useFormikContext } from 'formik';
import TradeTypeSelect from './selects/trade-type';
import DurationTypeSelect from './selects/duration-unit';
import QSInput from './inputs/qs-input';
import QSInputLabel from './inputs/qs-input-label';
import { STRATEGIES } from './config';
import { isMobile } from '@deriv/shared';
import { TConfigItem, TFormData } from './types';

const QuickStrategyForm = observer(() => {
    const { quick_strategy_store_1 } = useDBotStore();
    const { selected_strategy } = quick_strategy_store_1;
    const config: TConfigItem[][] = STRATEGIES[selected_strategy]?.fields;
    const is_mobile = isMobile();
    const { values, setFieldValue } = useFormikContext<TFormData>();

    React.useEffect(() => {
        window.addEventListener('keydown', handleEnter);
        return () => {
            window.removeEventListener('keydown', handleEnter);
        };
    }, []);

    const handleEnter = (event: KeyboardEvent) => {
        if ((event?.key && event.key === 'Enter') || (event?.keyCode && event.keyCode === 13)) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const renderForm = () => {
        return config.map((group, group_index) => {
            if (!group?.length) return null;
            return (
                <div className='qs__body__content__form__group' key={group_index}>
                    {group.map((field, field_index) => {
                        const key = `${field.name || field.type} + ${field_index}`;

                        if (
                            (is_mobile && field.hide?.includes('mobile')) ||
                            (!is_mobile && field.hide?.includes('desktop'))
                        ) {
                            return null;
                        }
                        switch (field.type) {
                            case 'number':
                                if (!field.name) return null;
                                return (
                                    <QSInput
                                        {...field}
                                        key={key}
                                        type='number'
                                        attached={field.attached}
                                        name={field.name}
                                        setFieldValue={setFieldValue}
                                    />
                                );
                            case 'label':
                                if (!field.label) return null;
                                return (
                                    <QSInputLabel key={key} label={field.label} description={field.description || ''} />
                                );
                            case 'symbol':
                                return <SymbolSelect key={key} fullWidth />;
                            case 'trade_type':
                                return (
                                    <TradeTypeSelect
                                        key={key}
                                        symbol={values?.symbol || ''}
                                        selected={values?.trade_type || ''}
                                        fullWidth
                                    />
                                );
                            case 'duration_unit':
                                return (
                                    <DurationTypeSelect
                                        key={key}
                                        data={{
                                            symbol: values?.symbol || '',
                                            trade_type: values?.trade_type || '',
                                        }}
                                        attached={field.attached}
                                    />
                                );
                            default:
                                return null;
                        }
                    })}
                </div>
            );
        });
    };

    return <div>{renderForm()}</div>;
});

export default QuickStrategyForm;
