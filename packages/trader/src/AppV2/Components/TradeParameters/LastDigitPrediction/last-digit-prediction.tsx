import React from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { ActionSheet, CaptionText, TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import LastDigitSelector from './last-digit-selector';
import { TTradeParametersProps } from '../trade-parameters';

const displayed_digits = [...Array(10).keys()]; // digits array [0 - 9]

const LastDigitPrediction = observer(({ is_minimized }: TTradeParametersProps) => {
    const { digit_stats = [], is_market_closed, last_digit, onChange } = useTraderStore();
    const [is_open, setIsOpen] = React.useState(false);
    const [selected_digit, setSelectedDigit] = React.useState(last_digit);

    React.useEffect(() => {
        setSelectedDigit(last_digit);
    }, [last_digit]);

    const handleLastDigitChange = (digit: number) => {
        onChange({ target: { name: 'last_digit', value: digit } });
    };
    const onSaveButtonClick = () => {
        if (last_digit !== selected_digit) handleLastDigitChange(selected_digit);
    };
    const onActionSheetClose = () => {
        setIsOpen(false);
        setSelectedDigit(last_digit);
    };

    if (is_minimized)
        return (
            <>
                <TextField
                    className={clsx('trade-params__option', 'trade-params__option--minimized')}
                    disabled={is_market_closed}
                    variant='fill'
                    readOnly
                    label={
                        <Localize
                            i18n_default_text='Last digit prediction'
                            key={`last-digit-prediction${is_minimized ? '-minimized' : ''}`}
                        />
                    }
                    value={last_digit}
                    onClick={() => setIsOpen(true)}
                />
                <ActionSheet.Root isOpen={is_open} onClose={onActionSheetClose} position='left' expandable={false}>
                    <ActionSheet.Portal shouldCloseOnDrag>
                        <ActionSheet.Header title={<Localize i18n_default_text='Last digit prediction' />} />
                        <ActionSheet.Content>
                            <LastDigitSelector
                                digits={displayed_digits}
                                digit_stats={digit_stats}
                                onDigitSelect={setSelectedDigit}
                                selected_digit={selected_digit}
                            />
                        </ActionSheet.Content>
                        <ActionSheet.Footer
                            alignment='vertical'
                            primaryAction={{
                                content: <Localize i18n_default_text='Save' />,
                                onAction: onSaveButtonClick,
                            }}
                        />
                    </ActionSheet.Portal>
                </ActionSheet.Root>
            </>
        );

    return (
        <div className={clsx('last-digit-prediction', is_market_closed && 'last-digit-prediction--disabled')}>
            <CaptionText size='sm' className='last-digit-prediction__title'>
                <Localize i18n_default_text='Last digit prediction' />
            </CaptionText>
            <LastDigitSelector
                digits={displayed_digits}
                digit_stats={digit_stats}
                onDigitSelect={handleLastDigitChange}
                selected_digit={last_digit}
                is_disabled={is_market_closed}
            />
        </div>
    );
});

export default LastDigitPrediction;
