import React from 'react';
import { Text, Icon, ThemedScrollbars, ToggleSwitch } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { TPaymentMethod } from './filter-modal';
import FilterModalResult from './filter-modal-result';
import FilterModalSearch from './filter-modal-search';

type TFilterModalBodyProps = {
    handleToggle: () => void;
    onChange: (payment_method: TPaymentMethod) => void;
    selected_methods: string[];
    selected_methods_text: string[];
};

const FilterModalBody = ({
    handleToggle,
    onChange,
    selected_methods,
    selected_methods_text,
}: TFilterModalBodyProps) => {
    const { buy_sell_store, my_profile_store } = useStores();
    const { setShowFilterPaymentMethods, show_filter_payment_methods, should_use_client_limits } = buy_sell_store;
    const { payment_methods_list_items } = my_profile_store;

    return (
        <React.Fragment>
            {show_filter_payment_methods ? (
                <React.Fragment>
                    <FilterModalSearch />
                    <div className='filter-modal-body__checkbox-container'>
                        <ThemedScrollbars is_scrollbar_hidden>
                            <FilterModalResult selected_methods={selected_methods} onChange={onChange} />
                        </ThemedScrollbars>
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div
                        className='filter-modal-body__row filter-modal-body__select'
                        onClick={() => setShowFilterPaymentMethods(true)}
                    >
                        <div className='filter-modal-body__column'>
                            <Text color='prominent' size='xs'>
                                <Localize i18n_default_text='Payment methods' />
                            </Text>
                            {selected_methods_text.length === payment_methods_list_items?.length ? (
                                <Text color='less-prominent' size='xs'>
                                    <Localize i18n_default_text='All' />
                                </Text>
                            ) : (
                                <Text
                                    className='filter-modal-body__selected-payment-methods'
                                    color='less-prominent'
                                    size='xs'
                                >
                                    {selected_methods_text?.join(', ')}
                                </Text>
                            )}
                        </div>
                        <Icon className='filter-modal-body__arrow' icon='IcChevronRight' size={18} />
                    </div>
                    <div className='filter-modal-body__row'>
                        <div className='filter-modal-body__column'>
                            <Text color='prominent' size='xs'>
                                <Localize i18n_default_text='Matching ads' />
                            </Text>
                            <Text color='less-prominent' size='xs'>
                                <Localize i18n_default_text='Ads that match your Deriv P2P balance and limit.' />
                            </Text>
                        </div>
                        <ToggleSwitch
                            id='toggle-filter-modal'
                            classNameButton='filter-modal__toggle-button'
                            classNameLabel='filter-modal__toggle-label'
                            handleToggle={handleToggle}
                            is_enabled={should_use_client_limits}
                            name='matching_ads_toggler'
                        />
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default observer(FilterModalBody);
