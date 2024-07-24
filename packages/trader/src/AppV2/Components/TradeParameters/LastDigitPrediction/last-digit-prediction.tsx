import React from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { ActionSheet, CaptionText, TextField } from '@deriv-com/quill-ui';
import { Skeleton } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import LastDigitSelector from './last-digit-selector';

type TLastDigitSelectorProps = {
    is_minimized?: boolean;
    is_stats_mode?: boolean;
};

const displayed_digits = [...Array(10).keys()]; // digits array [0 - 9]

const LastDigitPrediction = observer(({ is_minimized, is_stats_mode }: TLastDigitSelectorProps) => {
    const { digit_stats = [], last_digit, onChange } = useTraderStore();
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
        //TODO: check if we need these 2 resets below after latest Quill Action sheet changes will be in our branch
        setSelectedDigit(last_digit);
    };

    if (is_minimized)
        return (
            <>
                <TextField
                    variant='fill'
                    readOnly
                    label={
                        <Localize
                            i18n_default_text='Last digit prediction'
                            key={`last-digit${is_minimized ? '--minimized' : ''}`}
                        />
                    }
                    value={last_digit}
                    className={clsx('trade-params__option', 'trade-params__option--minimized')}
                    onClick={() => setIsOpen(true)}
                    id={`last-digit${is_minimized ? '--minimized' : ''}`}
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
                                is_stats_mode={is_stats_mode}
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
    if (!digit_stats.length) return <Skeleton height={182} />;
    return (
        <div className={clsx('last-digit-prediction', is_stats_mode && 'last-digit-prediction--stats-mode')}>
            {!is_stats_mode && (
                <CaptionText size='sm' className='last-digit-prediction__title'>
                    <Localize i18n_default_text='Last digit prediction' />
                </CaptionText>
            )}
            <LastDigitSelector
                digits={displayed_digits}
                digit_stats={digit_stats}
                onDigitSelect={handleLastDigitChange}
                selected_digit={last_digit}
                is_stats_mode={is_stats_mode}
            />
        </div>
    );
});

export default LastDigitPrediction;
