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
    const [has_made_changes, setHasMadeChanges] = useSavedState('has_made_changes', false);

    const diff = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));
    // if user has previously already selected some payment methods and clicked Apply
    const has_already_selected_payment_methods =
        buy_sell_store.selected_payment_method_value?.length &&
        (selected_methods.length !== buy_sell_store.selected_payment_method_value.length ||
            diff(selected_methods, buy_sell_store.selected_payment_method_value).length > 0);
    // if user is selecting payment methods for the first time and has selected some payment methods
    const has_recently_selected_payment_methods =
        buy_sell_store.selected_payment_method_value?.length === 0 && selected_methods.length > 0;
    const has_selected_payment_methods = has_already_selected_payment_methods || has_recently_selected_payment_methods;

    const onChange = payment_method => {
        if (!selected_methods.includes(payment_method.value)) {
            setSelectedMethods(prev_selected_methods => [...prev_selected_methods, payment_method.value]);
            setSelectedMethodsText(prev_selected_methods_text => [...prev_selected_methods_text, payment_method.text]);
        } else {
            setSelectedMethods(prev_selected_methods => prev_selected_methods.filter(i => i !== payment_method.value));
            setSelectedMethodsText(prev_selected_methods_text =>
                prev_selected_methods_text.filter(i => i !== payment_method.text)
            );
        }
    };

    const onClose = () => {
        if (has_selected_payment_methods || has_made_changes) {
            showModal({
                key: 'LeavePageModal',
                props: {
                    onLeavePage: () => {
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
                        setSelectedMethods(buy_sell_store.selected_payment_method_value);
                        setSelectedMethodsText(buy_sell_store.selected_payment_method_text);
                        hideModal({
                            should_restore_local_state: false,
                            should_hide_all_modals: true,
                        });
                    },
                },
            });
        } else {
            buy_sell_store.setShowFilterPaymentMethods(false);
            my_profile_store.setSearchTerm('');
            my_profile_store.setSearchResults([]);
            hideModal({
                should_restore_local_state: false,
            });
        }
    };

    const onClickReset = () => {
        buy_sell_store.setShouldUseClientLimits(false);

        setSelectedMethods([]);
        setSelectedMethodsText([]);

        setHasMadeChanges(
            buy_sell_store.selected_payment_method_value.length > 0 &&
                diff(selected_methods, buy_sell_store.selected_payment_method_value).length === 0
        );
    };

    const onClickConfirmPaymentMethods = () => {
        my_profile_store.setSearchTerm('');
        my_profile_store.setSearchResults([]);
        buy_sell_store.setShowFilterPaymentMethods(false);
        setHasMadeChanges(true);
    };

    const onClickClearPaymentMethods = () => {
        setSelectedMethods([]);
        setSelectedMethodsText([]);
    };

    const onClickApply = () => {
        buy_sell_store.setSelectedPaymentMethodValue(selected_methods);
        buy_sell_store.setSelectedPaymentMethodText(selected_methods_text);
        buy_sell_store.onClickApply(selected_methods, selected_methods_text);
        hideModal();
    };

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();

        return () => {
            my_profile_store.setSearchTerm('');
            my_profile_store.setSearchResults([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageHeaderReturnFn = () => {
        if (buy_sell_store.show_filter_payment_methods) {
            my_profile_store.setSearchTerm('');
            my_profile_store.setSearchResults([]);
            setSelectedMethods(buy_sell_store.selected_payment_method_value);
            setSelectedMethodsText(buy_sell_store.selected_payment_method_text);
            buy_sell_store.setShowFilterPaymentMethods(false);
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
                    toggleModal={onClose}
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
                                        handleToggle={() => {
                                            buy_sell_store.setShouldUseClientLimits(
                                                !buy_sell_store.should_use_client_limits
                                            );
                                            setHasMadeChanges(true);
                                        }}
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
                                    {localize('Confirm')}
                                </Button>
                            </Button.Group>
                        ) : (
                            <Button.Group>
                                <Button large secondary onClick={onClickReset}>
                                    {localize('Reset')}
                                </Button>
                                <Button disabled={!has_made_changes} large primary onClick={onClickApply}>
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
                    onClickClose={onClose}
                    renderPageFooterChildren={() => {
                        return (
                            <React.Fragment>
                                {buy_sell_store.show_filter_payment_methods ? (
                                    <Button.Group className='filter-modal__footer-button-group'>
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
                                            {localize('Confirm')}
                                        </Button>
                                    </Button.Group>
                                ) : (
                                    <Button.Group className='filter-modal__footer-button-group'>
                                        <Button large secondary onClick={onClickReset}>
                                            {localize('Reset')}
                                        </Button>
                                        <Button disabled={!has_made_changes} large primary onClick={onClickApply}>
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
                                    handleToggle={() => {
                                        buy_sell_store.setShouldUseClientLimits(
                                            !buy_sell_store.should_use_client_limits
                                        );
                                        setHasMadeChanges(true);
                                    }}
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
