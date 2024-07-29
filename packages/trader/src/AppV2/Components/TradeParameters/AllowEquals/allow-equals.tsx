import React from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { ActionSheet, CaptionText, ToggleSwitch, Text, TextField } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { hasCallPutEqual, hasDurationForCallPutEqual } from 'Stores/Modules/Trading/Helpers/allow-equals';
import { useTraderStore } from 'Stores/useTraderStores';

type TAllowEqualsProps = {
    is_minimized?: boolean;
};

const AllowEquals = observer(({ is_minimized }: TAllowEqualsProps) => {
    const { contract_types_list, contract_start_type, duration_unit, expiry_type, is_equal, onChange } =
        useTraderStore();

    const [is_open, setIsOpen] = React.useState(false);

    const has_callputequal_duration = hasDurationForCallPutEqual(
        contract_types_list,
        duration_unit,
        contract_start_type
    );
    const has_callputequal = hasCallPutEqual(contract_types_list);
    const has_allow_equals = (has_callputequal_duration || expiry_type === 'endtime') && has_callputequal;

    const onToggleSwitch = (is_enabled: boolean) => {
        onChange({ target: { name: 'is_equal', value: Number(is_enabled) } });
        setIsOpen(false);
    };

    if (!has_allow_equals) return null;

    return (
        <React.Fragment>
            <TextField
                variant='fill'
                readOnly
                label={
                    <Localize
                        i18n_default_text='Allow equals'
                        key={`allow-equals${is_minimized ? '-minimized' : ''}`}
                    />
                }
                value={is_equal ? localize('Enabled') : '-'}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                onClick={() => setIsOpen(true)}
            />
            <ActionSheet.Root isOpen={is_open} onClose={() => setIsOpen(false)} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header title={<Localize i18n_default_text='Allow equals' />} />
                    <ActionSheet.Content className='allow-equals__wrapper'>
                        <div className='allow-equals__content'>
                            <Text>
                                <Localize i18n_default_text='Allow equals' />
                            </Text>
                            <ToggleSwitch checked={!!is_equal} onChange={onToggleSwitch} />
                        </div>
                        <CaptionText color='quill-typography__color--subtle'>
                            <Localize i18n_default_text='Win payout if exit spot is also equal to entry spot.' />
                        </CaptionText>
                    </ActionSheet.Content>
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default AllowEquals;
