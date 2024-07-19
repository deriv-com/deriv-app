import React from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { ActionSheet, ToggleSwitch, Text, TextField } from '@deriv-com/quill-ui';
import { LabelPairedArrowLeftMdRegularIcon, LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import { Localize, localize } from '@deriv/translations';
import { hasCallPutEqual, hasDurationForCallPutEqual } from 'Stores/Modules/Trading/Helpers/allow-equals';
import { useTraderStore } from 'Stores/useTraderStores';
import Carousel from 'AppV2/Components/Carousel';

type TAllowEqualsProps = {
    is_minimized?: boolean;
};

const AllowEquals = observer(({ is_minimized }: TAllowEqualsProps) => {
    const { contract_types_list, contract_start_type, duration_unit, expiry_type, is_equal, onChange } =
        useTraderStore();

    const [is_open, setIsOpen] = React.useState(false);
    const [is_allow_equal_enabled, setIsAllowEqualEnabled] = React.useState(!!is_equal);
    const [should_reset_carousel, setShouldResetCarousel] = React.useState(false);

    const has_callputequal_duration = hasDurationForCallPutEqual(
        contract_types_list,
        duration_unit,
        contract_start_type
    );
    const has_callputequal = hasCallPutEqual(contract_types_list);
    const has_allow_equals = (has_callputequal_duration || expiry_type === 'endtime') && has_callputequal;

    const onSaveButtonClick = () => {
        if (!!is_equal !== is_allow_equal_enabled)
            onChange({ target: { name: 'is_equal', value: Number(is_allow_equal_enabled) } });
    };
    const onActionSheetClose = () => {
        setIsOpen(false);
        //TODO: check if we need these 2 resets below after latest Quill Action sheet changes will be in our branch
        setIsAllowEqualEnabled(!!is_equal);
        setShouldResetCarousel(true);
    };
    //TODO: check if we need function below after latest Quill Action sheet changes will be in our branch
    const onPageChange = (page_index: number) => {
        if (!page_index) setShouldResetCarousel(false);
    };

    const action_sheet_content = [
        {
            id: 1,
            component: (onNextClick: () => void) => (
                <React.Fragment>
                    <ActionSheet.Header
                        title={<Localize i18n_default_text='Allow equals' />}
                        icon={<LabelPairedCircleInfoMdRegularIcon onClick={onNextClick} />}
                    />
                    <ActionSheet.Content className='allow-equals__wrapper'>
                        <div className='allow-equals__content'>
                            <Text>
                                <Localize i18n_default_text='Allow equals' />
                            </Text>
                            <ToggleSwitch
                                checked={is_allow_equal_enabled}
                                onChange={(is_enabled: boolean) => setIsAllowEqualEnabled(is_enabled)}
                            />
                        </div>
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='vertical'
                        primaryAction={{
                            content: <Localize i18n_default_text='Save' />,
                            onAction: onSaveButtonClick,
                        }}
                    />
                </React.Fragment>
            ),
        },
        {
            id: 2,
            component: (onPrevClick: () => void) => (
                <React.Fragment>
                    <ActionSheet.Header
                        title={<Localize i18n_default_text='Allow equals' />}
                        icon={<LabelPairedArrowLeftMdRegularIcon onClick={onPrevClick} />}
                        className='icon--left'
                    />
                    <ActionSheet.Content className='allow-equals__wrapper--definition'>
                        <div className='allow-equals__content'>
                            <Text>
                                <Localize i18n_default_text='Win payout if exit spot is also equal to entry spot.' />
                            </Text>
                        </div>
                    </ActionSheet.Content>
                </React.Fragment>
            ),
        },
    ];

    React.useEffect(() => {
        setIsAllowEqualEnabled(!!is_equal);
    }, [is_equal]);

    if (!has_allow_equals) return null;

    return (
        <React.Fragment>
            <TextField
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Allow equals.' />}
                value={is_equal ? localize('Enabled') : '-'}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                onClick={() => setIsOpen(true)}
            />
            <ActionSheet.Root isOpen={is_open} onClose={onActionSheetClose} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <Carousel
                        pages={action_sheet_content}
                        should_reset_carousel={should_reset_carousel}
                        onChange={onPageChange}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default AllowEquals;
