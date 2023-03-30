import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import PageReturn from 'Components/page-return/page-return.jsx';

const FilterModalHeader = () => {
    const { buy_sell_store, my_profile_store } = useStores();

    if (buy_sell_store.show_filter_payment_methods) {
        return (
            <PageReturn
                onClick={() => {
                    buy_sell_store.setShowFilterPaymentMethods(false);
                    my_profile_store.setSearchTerm('');
                    my_profile_store.setSearchResults([]);
                }}
                page_title={localize('Payment methods')}
            />
        );
    }

    return <Localize i18n_default_text='Filter' />;
};

export default observer(FilterModalHeader);
