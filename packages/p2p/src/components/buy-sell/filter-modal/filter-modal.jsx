import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Checkbox, Icon, Loading, Modal, Text, ThemedScrollbars, ToggleSwitch } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import FilterModalHeader from './filter-modal-header.jsx';
import FilterModalSearch from './filter-modal-search.jsx';

const FilterModal = () => {
    const { buy_sell_store, my_profile_store } = useStores();

    React.useEffect(() => {
        buy_sell_store.setShowFilterPaymentMethods(false);
        my_profile_store.getPaymentMethodsList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal
            className={'payment-methods'}
            has_close_icon
            height={'56rem'}
            title={<FilterModalHeader />}
            is_open={buy_sell_store.is_filter_modal_open}
            toggleModal={() => buy_sell_store.setIsFilterModalOpen(false)}
        >
            <Modal.Body>
                {buy_sell_store.show_filter_payment_methods ? (
                    <React.Fragment>
                        <FilterModalSearch />
                        <div className='filter-modal__checkbox-container'>
                            <ThemedScrollbars is_scrollbar_hidden>
                                {buy_sell_store.is_filter_modal_loading && <Loading is_fullscreen={false} />}
                                {my_profile_store.search_term
                                    ? my_profile_store.search_results.map((payment_method, key) => {
                                          return (
                                              <Checkbox
                                                  key={key}
                                                  label={payment_method.text}
                                                  onChange={e => buy_sell_store.onChange(e)}
                                                  // value={payment_method.value}
                                              />
                                          );
                                      })
                                    : my_profile_store.payment_methods_list_items.map((payment_method, key) => {
                                          return (
                                              <Checkbox
                                                  key={key}
                                                  label={payment_method.text}
                                                  onChange={e => buy_sell_store.onChange(e)}
                                                  // value={payment_method.value}
                                              />
                                          );
                                      })}
                            </ThemedScrollbars>
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <div className='filter-modal__row'>
                            <div className='filter-modal__column'>
                                <Text color='prominent' size='xs'>
                                    <Localize i18n_default_text='Payment methods' />
                                </Text>
                                {/* <Text color='less-prominent' size='xs'>
                                    <Localize i18n_default_text='All' />
                                </Text> */}
                            </div>
                            <Icon
                                icon='IcChevronRight'
                                onClick={() => buy_sell_store.setShowFilterPaymentMethods(true)}
                                size={18}
                            />
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
                                className='filter-modal__toggle'
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
                    <Button
                        className='filter-modal__footer-button'
                        large
                        secondary
                        onClick={() => buy_sell_store.onClickReset()}
                    >
                        <Localize i18n_default_text='Clear' />
                    </Button>
                ) : (
                    <Button.Group>
                        <Button large secondary onClick={() => buy_sell_store.onClickReset()}>
                            {localize('Reset')}
                        </Button>
                        <Button large primary onClick={() => buy_sell_store.onClickApply()}>
                            {localize('Apply')}
                        </Button>
                    </Button.Group>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default observer(FilterModal);
