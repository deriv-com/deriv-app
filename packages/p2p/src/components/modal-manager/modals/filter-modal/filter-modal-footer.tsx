import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';

type TFilterModalFooterProps = {
    class_name?: string;
    has_selected_payment_methods: boolean;
    has_made_changes: boolean;
    onClickApply: () => void;
    onClickClearPaymentMethods: () => void;
    onClickConfirmPaymentMethods: () => void;
    onClickReset: () => void;
    selected_methods: string[];
};

const FilterModalFooter = ({
    class_name = '',
    has_made_changes,
    has_selected_payment_methods,
    onClickApply,
    onClickClearPaymentMethods,
    onClickConfirmPaymentMethods,
    onClickReset,
    selected_methods,
}: TFilterModalFooterProps) => {
    const { buy_sell_store } = useStores();
    const { show_filter_payment_methods } = buy_sell_store;

    return (
        <React.Fragment>
            {show_filter_payment_methods ? (
                <Button.Group className={class_name}>
                    <Button
                        disabled={selected_methods.length === 0}
                        large
                        secondary
                        onClick={onClickClearPaymentMethods}
                    >
                        <Localize i18n_default_text='Clear' />
                    </Button>
                    <Button
                        disabled={!has_selected_payment_methods}
                        large
                        primary
                        onClick={onClickConfirmPaymentMethods}
                    >
                        <Localize i18n_default_text='Confirm' />
                    </Button>
                </Button.Group>
            ) : (
                <Button.Group className={class_name}>
                    <Button large secondary onClick={onClickReset}>
                        <Localize i18n_default_text='Reset' />
                    </Button>
                    <Button disabled={!has_made_changes} large primary onClick={onClickApply}>
                        <Localize i18n_default_text='Apply' />
                    </Button>
                </Button.Group>
            )}
        </React.Fragment>
    );
};

export default FilterModalFooter;
