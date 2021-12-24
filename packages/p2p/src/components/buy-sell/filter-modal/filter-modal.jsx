import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Checkbox, Icon, Modal, Text, ToggleSwitch } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';

const FilterModal = () => {
    const { buy_sell_store, my_profile_store } = useStores();

    React.useEffect(() => {
        buy_sell_store.setShowFilterPaymentMethods(false);
        my_profile_store.getPaymentMethodsList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal
            has_close_icon
            title={localize('Filter')}
            is_open={buy_sell_store.is_filter_modal_open}
            toggleModal={() => buy_sell_store.setIsFilterModalOpen(false)}
        >
            <Modal.Body>
                {buy_sell_store.show_filter_payment_methods ? (
                    my_profile_store.payment_methods_list_items.map((payment_method, key) => {
                        return (
                            <Checkbox
                                key={key}
                                label={payment_method.text}
                                // onChange={() => buy_sell_store.setShouldUseClientLimits(!buy_sell_store.should_use_client_limits)}
                                value={payment_method.value}
                            />
                        );
                    })
                ) : (
                    <>
                        <div className='filter-modal__row'>
                            <div className='filter-modal__column'>
                                <Text color='prominent' size='xs'>
                                    <Localize i18n_default_text='Payment methods' />
                                </Text>
                                <Text color='less-prominent' size='xs'>
                                    idk
                                    {/* <Localize i18n_default_text= /> */}
                                </Text>
                            </div>
                            <div onClick={() => buy_sell_store.setShowFilterPaymentMethods(true)}>
                                <Icon icon='IcChevronRight' size={18} />
                            </div>
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
                                // is_enabled={true}
                                // handleToggle={handleToggle}
                            />
                        </div>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer has_separator>
                <Button.Group>
                    <Button secondary large onClick={() => {}}>
                        {localize('Reset')}
                    </Button>
                    <Button is_disabled={false} large onClick={() => {}} primary>
                        {localize('Apply')}
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(FilterModal);
