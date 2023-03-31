import * as React from 'react';
import { observer } from 'mobx-react-lite';
import {
    Button,
    Checkbox,
    DesktopWrapper,
    Icon,
    Loading,
    MobileFullPageModal,
    MobileWrapper,
    Modal,
    Text,
    ThemedScrollbars,
    ToggleSwitch,
} from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import FilterModalHeader from './filter-modal-header.jsx';
import FilterModalSearch from './filter-modal-search.jsx';
import FilterModalNoResults from './filter-modal-no-results.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { isMobile } from '@deriv/shared';

const FilterModalResult = observer(({ onChange, selected_methods }) => {
    const { buy_sell_store, my_profile_store } = useStores();
    if (buy_sell_store.is_filter_modal_loading) return <Loading is_fullscreen={false} />;
    else if (my_profile_store.search_term) {
        if (my_profile_store.search_results && my_profile_store.search_results.length > 0) {
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

const FilterModal = () => {
    const { buy_sell_store, my_profile_store } = useStores();
    const { hideModal, is_modal_open, showModal, useSavedState } = useModalManagerContext();

    const [selected_methods, setSelectedMethods] = useSavedState(
        'selected_methods',
        buy_sell_store.selected_payment_method_value ?? []
    );
    const [selected_methods_text, setSelectedMethodsText] = useSavedState(
        'selected_methods_text',
        buy_sell_store.selected_payment_method_text ?? []
    );

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

    /**
     * this is to ensure when user clicks the back button after selecting some payment methods and clicking Leave Page button in the modal
     * the previously selected payment methods should not be saved in the filter_payment_methods observable (by default its saved due to the onChange function applied to the checkbox)
     * otherwise, when user goes back to the payment methods selection, it will assume that the user has already selected those previous payment methods
     **/
    const resetFilterPaymentMethods = () => {
        buy_sell_store.filter_payment_methods = buy_sell_store.filter_payment_methods.filter(
            filtered_payment_method => !selected_methods.includes(filtered_payment_method)
        );
    };

    const onClickClose = () => {
        resetFilterPaymentMethods();
        buy_sell_store.setShowFilterPaymentMethods(false);
        my_profile_store.setSearchTerm('');
        my_profile_store.setSearchResults([]);
        hideModal({
            should_restore_local_state: false,
        });
    };

    const onClickReset = () => {
        buy_sell_store.onClickReset();
        onClickClear();
    };

    const onClickConfirmPaymentMethods = () => {
        buy_sell_store.setSelectedPaymentMethodValue(selected_methods);
        buy_sell_store.setSelectedPaymentMethodText(selected_methods_text);
        buy_sell_store.setShowFilterPaymentMethods(false);
    };

    const onClickApply = () => {
        buy_sell_store.onClickApply(selected_methods, selected_methods_text);
        hideModal();
    };

    const diff = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));
    // if user has previously already selected some payment methods and clicked Apply
    const has_already_selected_payment_methods =
        buy_sell_store.selected_payment_method_value?.length &&
        (selected_methods.length !== buy_sell_store.selected_payment_method_value.length ||
            diff(selected_methods, buy_sell_store.selected_payment_method_value).length > 0);
    // if user is selecting payment methods for the first time and has selected some payment methods
    const has_recently_selected_payment_methods =
        buy_sell_store.selected_payment_method_value?.length === 0 && selected_methods.length > 0;
    // if user has previously selected all payment methods
    const has_selected_all_payment_methods =
        buy_sell_store.selected_payment_method_value.length === my_profile_store.payment_methods_list.length;
    const has_selected_payment_methods = has_already_selected_payment_methods || has_recently_selected_payment_methods;

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();

        return () => {
            my_profile_store.setSearchTerm('');
            my_profile_store.setSearchResults([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageHeaderReturnFn = () => {
        if (has_selected_payment_methods) {
            showModal({
                key: 'LeavePageModal',
                props: {
                    onLeavePage: () => {
                        resetFilterPaymentMethods();
                        if (isMobile()) {
                            setSelectedMethods(
                                selected_methods.filter(selected_method =>
                                    buy_sell_store.selected_payment_method_value.includes(selected_method)
                                )
                            );
                            setSelectedMethodsText(
                                selected_methods_text.filter(selected_method_text =>
                                    buy_sell_store.selected_payment_method_text.includes(selected_method_text)
                                )
                            );
                        }
                    },
                },
            });
        } else if (buy_sell_store.show_filter_payment_methods) {
            buy_sell_store.setShowFilterPaymentMethods(false);
            my_profile_store.setSearchTerm('');
            my_profile_store.setSearchResults([]);
        } else {
            hideModal({
                should_restore_local_state: false,
            });
        }
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='payment-methods'
                    has_close_icon
                    height='56rem'
                    title={<FilterModalHeader pageHeaderReturnFn={pageHeaderReturnFn} />}
                    is_open={is_modal_open}
                    toggleModal={onClickClose}
                    width='44rem'
                >
                    <Modal.Body>
                        {buy_sell_store.show_filter_payment_methods ? (
                            <React.Fragment>
                                <FilterModalSearch />
                                <div className='filter-modal__checkbox-container'>
                                    <ThemedScrollbars is_scrollbar_hidden>
                                        <FilterModalResult selected_methods={selected_methods} onChange={onChange} />
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
                                        {selected_methods_text.length ===
                                        my_profile_store.payment_methods_list_items.length ? (
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
                                            buy_sell_store.setShouldUseClientLimits(
                                                !buy_sell_store.should_use_client_limits
                                            )
                                        }
                                        is_enabled={buy_sell_store.should_use_client_limits}
                                    />
                                </div>
                            </React.Fragment>
                        )}
                    </Modal.Body>
                    <Modal.Footer has_separator>
                        {buy_sell_store.show_filter_payment_methods ? (
                            <Button.Group>
                                <Button
                                    disabled={!has_selected_payment_methods && !has_selected_all_payment_methods}
                                    large
                                    secondary
                                    onClick={onClickClear}
                                >
                                    <Localize i18n_default_text='Clear' />
                                </Button>
                                <Button
                                    disabled={!has_selected_payment_methods}
                                    large
                                    primary
                                    onClick={onClickConfirmPaymentMethods}
                                >
                                    {localize('Confirm')}
                                </Button>
                            </Button.Group>
                        ) : (
                            <Button.Group>
                                <Button large secondary onClick={onClickReset}>
                                    {localize('Reset')}
                                </Button>
                                <Button large primary onClick={onClickApply}>
                                    {localize('Apply')}
                                </Button>
                            </Button.Group>
                        )}
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='filter-modal__body'
                    is_modal_open={is_modal_open}
                    height_offset='80px'
                    is_flex
                    header={<FilterModalHeader pageHeaderReturnFn={pageHeaderReturnFn} />}
                    onClickClose={onClickClose}
                    renderPageFooterChildren={() => {
                        return (
                            <React.Fragment>
                                {buy_sell_store.show_filter_payment_methods ? (
                                    <Button.Group className='filter-modal__footer-button-group'>
                                        <Button
                                            disabled={
                                                !has_selected_payment_methods && !has_selected_all_payment_methods
                                            }
                                            large
                                            secondary
                                            onClick={onClickClear}
                                        >
                                            <Localize i18n_default_text='Clear' />
                                        </Button>
                                        <Button
                                            disabled={!has_selected_payment_methods}
                                            large
                                            primary
                                            onClick={onClickConfirmPaymentMethods}
                                        >
                                            {localize('Confirm')}
                                        </Button>
                                    </Button.Group>
                                ) : (
                                    <Button.Group className='filter-modal__footer-button-group'>
                                        <Button large secondary onClick={onClickReset}>
                                            {localize('Reset')}
                                        </Button>
                                        <Button large primary onClick={onClickApply}>
                                            {localize('Apply')}
                                        </Button>
                                    </Button.Group>
                                )}
                            </React.Fragment>
                        );
                    }}
                >
                    {buy_sell_store.show_filter_payment_methods ? (
                        <React.Fragment>
                            <FilterModalSearch />
                            <div className='filter-modal__checkbox-container'>
                                <ThemedScrollbars is_scrollbar_hidden>
                                    <FilterModalResult selected_methods={selected_methods} onChange={onChange} />
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
                                    {selected_methods_text.length ===
                                    my_profile_store.payment_methods_list_items.length ? (
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
                                        buy_sell_store.setShouldUseClientLimits(
                                            !buy_sell_store.should_use_client_limits
                                        )
                                    }
                                    is_enabled={buy_sell_store.should_use_client_limits}
                                />
                            </div>
                        </React.Fragment>
                    )}
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(FilterModal);
