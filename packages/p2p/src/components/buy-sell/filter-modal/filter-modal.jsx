import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Checkbox, Icon, Loading, Modal, Text, ThemedScrollbars, ToggleSwitch } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import FilterModalHeader from './filter-modal-header.jsx';
import FilterModalSearch from './filter-modal-search.jsx';
import FilterModalNoResults from './filter-modal-no-results.jsx';

const FilterModal = () => {
    const { buy_sell_store, my_profile_store } = useStores();

    const [selected_methods, setSelectedMethods] = React.useState([]);
    const [selected_methods_text, setSelectedMethodsText] = React.useState([]);

    const onChange = payment_method => {
        if (!buy_sell_store.filter_payment_methods.includes(payment_method.value)) {
            buy_sell_store.filter_payment_methods.push(payment_method.value);
            setSelectedMethods(prev_selected_methods => [...prev_selected_methods, payment_method.value]);
            setSelectedMethodsText(prev_selected_methods_text => [...prev_selected_methods_text, payment_method.text]);
        } else {
            buy_sell_store.filter_payment_methods = buy_sell_store.filter_payment_methods.filter(
                payment_method_id => payment_method_id !== payment_method.value
            );
            setSelectedMethods(prev_selected_methods => prev_selected_methods.filter(i => i !== payment_method.value));
            setSelectedMethodsText(prev_selected_methods_text =>
                prev_selected_methods_text.filter(i => i !== payment_method.text)
            );
        }
    };

    const onClickClear = () => {
        buy_sell_store.filter_payment_methods = [];
        setSelectedMethods([]);
        setSelectedMethodsText([]);
        buy_sell_store.setSelectedPaymentMethodValue([]);
        buy_sell_store.setSelectedPaymentMethodText([]);
    };

    const onBackdropClick = () => {
        buy_sell_store.setShowFilterPaymentMethods(false);
        buy_sell_store.setIsFilterModalOpen(false);
        my_profile_store.setSearchTerm('');
        if (selected_methods_text.length && !buy_sell_store.selected_payment_method_value.length) {
            onClickClear();
        }
    };

    React.useEffect(() => {
        buy_sell_store.setShowFilterPaymentMethods(false);
        my_profile_store.getPaymentMethodsList();

        if (buy_sell_store.selected_payment_method_value.length) {
            setSelectedMethods(buy_sell_store.selected_payment_method_value);
            setSelectedMethodsText(buy_sell_store.selected_payment_method_text);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const FilterModalResult = observer(() => {
        if (buy_sell_store.is_filter_modal_loading) return <Loading is_fullscreen={false} />;
        else if (my_profile_store.search_term) {
            if (!my_profile_store.search_results || my_profile_store.search_results.length > 0) {
                return my_profile_store.search_results?.map((payment_method, key) => {
                    return (
                        <Checkbox
                            key={key}
                            label={payment_method.text}
                            onChange={() => onChange(payment_method)}
                            value={selected_methods.includes(payment_method.value)}
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
                    onChange={() => onChange(payment_method)}
                    value={selected_methods.includes(payment_method.value)}
                />
            );
        });
    });

    return (
        <Modal
            className={'payment-methods'}
            has_close_icon
            height={'56rem'}
            title={<FilterModalHeader />}
            is_open={buy_sell_store.is_filter_modal_open}
            toggleModal={onBackdropClick}
            width='44rem'
        >
            <Modal.Body>
                {buy_sell_store.show_filter_payment_methods ? (
                    <React.Fragment>
                        <FilterModalSearch />
                        <div className='filter-modal__checkbox-container'>
                            <ThemedScrollbars is_scrollbar_hidden>
                                <FilterModalResult />
                            </ThemedScrollbars>
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <div
                            className='filter-modal__row filter-modal__select'
                            onClick={() => buy_sell_store.setShowFilterPaymentMethods(true)}
                        >
                            <div className='filter-modal__column'>
                                <Text color='prominent' size='xs'>
                                    <Localize i18n_default_text='Payment methods' />
                                </Text>
                                {selected_methods_text.length === my_profile_store.payment_methods_list_items.length ? (
                                    <Text color='less-prominent' size='xs'>
                                        <Localize i18n_default_text='All' />
                                    </Text>
                                ) : (
                                    <Text
                                        className='filter-modal__selected-payment-methods'
                                        color='less-prominent'
                                        size='xs'
                                    >
                                        {selected_methods_text.join(', ')}
                                    </Text>
                                )}
                            </div>
                            <Icon className='filter-modal__arrow' icon='IcChevronRight' size={18} />
                        </div>
                        <div className='filter-modal__row'>
                            <div className='filter-modal__column'>
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
                                handleToggle={() =>
                                    buy_sell_store.setShouldUseClientLimits(!buy_sell_store.should_use_client_limits)
                                }
                                is_enabled={buy_sell_store.should_use_client_limits}
                            />
                        </div>
                    </React.Fragment>
                )}
            </Modal.Body>
            <Modal.Footer has_separator>
                {buy_sell_store.show_filter_payment_methods ? (
                    <Button className='filter-modal__footer-button' large secondary onClick={() => onClickClear()}>
                        <Localize i18n_default_text='Clear' />
                    </Button>
                ) : (
                    <Button.Group>
                        <Button
                            large
                            secondary
                            onClick={() => {
                                buy_sell_store.onClickReset();
                                onClickClear();
                            }}
                        >
                            {localize('Reset')}
                        </Button>
                        <Button
                            large
                            primary
                            onClick={() => buy_sell_store.onClickApply(selected_methods, selected_methods_text)}
                        >
                            {localize('Apply')}
                        </Button>
                    </Button.Group>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default observer(FilterModal);
