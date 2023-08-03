import React from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { DesktopWrapper, Input, Icon, MobileWrapper, Text, useInterval } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { TReactChangeEvent } from '../../types';
import { useCashierStore } from '../../stores/useCashierStores';
import { useExchangeRate } from '@deriv/hooks';
import './crypto-fiat-converter.scss';

type TTimerProps = {
    onComplete: VoidFunction;
};

type TInputGroupProps = React.PropsWithChildren<{
    className: string;
}>;

type TCryptoFiatConverterProps = {
    from_currency: string;
    hint?: React.ReactNode;
    onChangeConverterFromAmount: (
        event: { target: { value: string } },
        from_currency: string,
        to_currency: string,
        converted_amount?: number
    ) => void;
    onChangeConverterToAmount: (
        event: TReactChangeEvent,
        from_currency: string,
        to_currency: string,
        converted_amount?: number
    ) => void;
    resetConverter: VoidFunction;
    to_currency: string;
    validateFromAmount: VoidFunction;
    validateToAmount: VoidFunction;
};

const Timer = ({ onComplete }: TTimerProps) => {
    const initial_time = 60;
    const [remaining_time, setRemainingTime] = React.useState<number>(initial_time);

    useInterval(() => {
        if (remaining_time > 0) {
            setRemainingTime(remaining_time - 1);
        }
    }, 1000);

    React.useEffect(() => {
        if (remaining_time === 0) {
            onComplete();
            setRemainingTime(initial_time);
        }
    }, [onComplete, remaining_time]);

    return (
        <Text as='p' size='xs' color='less-prominent' className='timer'>
            <Localize i18n_default_text='{{remaining_time}}s' values={{ remaining_time }} />
        </Text>
    );
};

const InputGroup = ({ children, className }: TInputGroupProps) => {
    return (
        <fieldset>
            <div className={className}>{children}</div>
        </fieldset>
    );
};

const CryptoFiatConverter = observer(
    ({
        from_currency,
        hint,
        onChangeConverterFromAmount,
        onChangeConverterToAmount,
        resetConverter,
        to_currency,
        validateFromAmount,
        validateToAmount,
    }: TCryptoFiatConverterProps) => {
        const { crypto_fiat_converter } = useCashierStore();
        const { getRate } = useExchangeRate();

        const {
            converter_from_amount,
            converter_from_error,
            converter_to_error,
            converter_to_amount,
            is_timer_visible,
        } = crypto_fiat_converter;

        const { handleChange } = useFormikContext();
        const [arrow_icon_direction, setArrowIconDirection] = React.useState<string>('right');

        React.useEffect(() => {
            return () => resetConverter();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        React.useEffect(() => {
            setArrowIconDirection('right');
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [from_currency]);

        return (
            <div className='crypto-fiat-converter'>
                <Field name='converter_from_amount' validate={validateFromAmount}>
                    {({ field }: FieldProps<string>) => (
                        <Input
                            {...field}
                            onFocus={() => {
                                setArrowIconDirection('right');
                            }}
                            onChange={(e: TReactChangeEvent) => {
                                const from_rate = getRate(from_currency || '');
                                const to_rate = getRate(to_currency || '');
                                const converted_amount = (Number(e.target.value) * to_rate) / from_rate;
                                onChangeConverterFromAmount(e, from_currency, to_currency, converted_amount);
                                handleChange(e);
                            }}
                            type='text'
                            error={converter_from_error as string}
                            label={localize('Amount ({{currency}})', {
                                currency: getCurrencyDisplayCode(from_currency),
                            })}
                            value={converter_from_amount}
                            autoComplete='off'
                            required
                            hint={hint}
                            classNameHint='crypto-fiat-converter__hint'
                            data-testid='dt_converter_from_amount_input'
                        />
                    )}
                </Field>
                <MobileWrapper>
                    {arrow_icon_direction === 'right' ? <Icon icon='IcArrowDownBold' /> : <Icon icon='IcArrowUpBold' />}
                </MobileWrapper>
                <DesktopWrapper>
                    {arrow_icon_direction === 'right' ? (
                        <Icon icon='IcArrowRightBold' id='arrow_right_bold' data_testid='dti_arrow_right_bold' />
                    ) : (
                        <Icon icon='IcArrowLeftBold' id='arrow_left_bold' data_testid='dti_arrow_left_bold' />
                    )}
                </DesktopWrapper>
                <Field name='converter_to_amount' validate={validateToAmount}>
                    {({ field }: FieldProps<string>) => (
                        <InputGroup className='input-group'>
                            <Input
                                {...field}
                                onFocus={() => {
                                    setArrowIconDirection('left');
                                }}
                                onChange={(e: TReactChangeEvent) => {
                                    const from_rate = getRate(from_currency || '');
                                    const to_rate = getRate(to_currency || '');
                                    const converted_amount = (Number(e.target.value) * from_rate) / to_rate;
                                    onChangeConverterToAmount(e, to_currency, from_currency, converted_amount);
                                    handleChange(e);
                                }}
                                type='text'
                                error={converter_to_error}
                                label={localize('Amount ({{currency}})', {
                                    currency: getCurrencyDisplayCode(to_currency),
                                })}
                                value={converter_to_amount}
                                autoComplete='off'
                                hint={localize('Approximate value')}
                                classNameHint='crypto-fiat-converter__hint'
                                data-testid='dt_converter_to_amount_input'
                            />
                            {is_timer_visible && (
                                <Timer
                                    onComplete={() => {
                                        const from_rate = getRate(from_currency || '');
                                        const to_rate = getRate(to_currency || '');
                                        const converted_amount = (Number(converter_from_amount) * to_rate) / from_rate;
                                        onChangeConverterFromAmount(
                                            { target: { value: converter_from_amount } },
                                            from_currency,
                                            to_currency,
                                            converted_amount
                                        );
                                    }}
                                />
                            )}
                        </InputGroup>
                    )}
                </Field>
            </div>
        );
    }
);

export default CryptoFiatConverter;
