import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const FilterModalHeader = ({ has_selected_payment_methods }) => {
    const { buy_sell_store, my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();

    if (buy_sell_store.show_filter_payment_methods) {
        return (
            <PageReturn
                onClick={() => {
                    if (has_selected_payment_methods) {
                        showModal({
                            key: 'LeavePageModal',
                        });
                    } else {
                        buy_sell_store.setShowFilterPaymentMethods(false);
                        my_profile_store.setSearchTerm('');
                        my_profile_store.setSearchResults([]);
                    }
                }}
                page_title={localize('Payment methods')}
            />
        );
    }

    return <Localize i18n_default_text='Filter' />;
};

export default observer(FilterModalHeader);
