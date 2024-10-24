import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, ToggleSwitch, Text, Heading } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { clickAndKeyEventHandler } from '@deriv/shared';
import { hasCallPutEqual, hasDurationForCallPutEqual } from 'Stores/Modules/Trading/Helpers/allow-equals';
import { useTraderStore } from 'Stores/useTraderStores';

const AllowEquals = observer(() => {
    const {
        contract_types_list,
        contract_start_type,
        duration_unit,
        expiry_type,
        is_equal,
        is_market_closed,
        onChange,
    } = useTraderStore();

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

    const openDescription = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        if (is_market_closed) return;
        clickAndKeyEventHandler(() => setIsOpen(true), e);
    };

    const closeDescription = () => setIsOpen(false);

    if (!has_allow_equals) return null;

    return (
        <React.Fragment>
            <div className='allow-equals__wrapper'>
                <Text
                    size='sm'
                    className={clsx('allow-equals__title', is_market_closed && 'allow-equals__title--disabled')}
                    onClick={openDescription}
                    onKeyDown={openDescription}
                >
                    <Localize i18n_default_text='Allow equals' />
                </Text>
                <ToggleSwitch checked={!!is_equal} onChange={onToggleSwitch} disabled={is_market_closed} />
            </div>
            <ActionSheet.Root isOpen={is_open} onClose={closeDescription} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Content className='allow-equals__definition__wrapper'>
                        <Heading.H4 className='allow-equals__definition__title'>
                            <Localize i18n_default_text='Allow equals' />
                        </Heading.H4>
                        <Text as='div'>
                            <Localize i18n_default_text='Win payout if exit spot is also equal to entry spot.' />
                        </Text>
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='vertical'
                        primaryAction={{
                            content: <Localize i18n_default_text='Got it' />,
                            onAction: closeDescription,
                        }}
                        className='allow-equals__button'
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default AllowEquals;
