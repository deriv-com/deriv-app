import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Checkbox, Loading } from '@deriv/components';
import FilterModalNoResults from '../buy-sell/filter-modal/filter-modal-no-results';
import './quick-add-modal.scss';

const QuickAddModalList = ({ onClickPaymentMethodItem, selected_methods }) => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.setSearchTerm('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!my_profile_store.search_results) {
        return <Loading is_fullscreen={false} />;
    } else if (my_profile_store.search_term) {
        if (!my_profile_store.search_results || my_profile_store.search_results.length > 0) {
            return my_profile_store.search_results?.map((payment_method, key) => {
                return (
                    <Checkbox
                        key={key}
                        label={payment_method.text}
                        onChange={() => onClickPaymentMethodItem(payment_method.value)}
                        value={selected_methods.includes(payment_method.value)}
                        disabled={!selected_methods.includes(payment_method.value) && selected_methods.length === 3}
                    />
                );
            });
        }
        return <FilterModalNoResults text={my_profile_store.search_term} />;
    }
    return my_profile_store.payment_methods_list_items.map((payment_method, key) => {
        return (
            <Checkbox
                name='checkbox'
                key={key}
                label={payment_method.text}
                onChange={() => onClickPaymentMethodItem(payment_method.value)}
                value={selected_methods.includes(payment_method.value)}
                disabled={!selected_methods.includes(payment_method.value) && selected_methods.length === 3}
            />
        );
    });
};

QuickAddModalList.propTypes = {
    onClickPaymentMethodItem: PropTypes.func,
    selected_methods: PropTypes.array,
};

export default observer(QuickAddModalList);
