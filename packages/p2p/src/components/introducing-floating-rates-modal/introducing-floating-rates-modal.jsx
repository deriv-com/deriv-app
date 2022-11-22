import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Checkbox, Modal, Text } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { getUrlBase } from '@deriv/shared';
import { useStores } from 'Stores';

const IntroducingFloatingRatesModal = () => {
    const { floating_rate_store, general_store } = useStores();
    const should_not_show_modal_again = React.useRef(false);
    const [is_open, setIsOpen] = React.useState(() => {
        const p2p_settings = general_store.getLocalStorageSettings();
        const show_introduce_fr_notf = p2p_settings[general_store.client.loginid]?.show_introduce_fr_notf;
        return show_introduce_fr_notf ?? true;
    });

    const closeModal = () => {
        setIsOpen(false);
    };

    const onCheckboxChange = () => {
        const p2p_settings = general_store.getLocalStorageSettings();
        should_not_show_modal_again.current = !should_not_show_modal_again.current;
        Object.assign(p2p_settings[general_store.client.loginid], {
            show_introduce_fr_notf: !should_not_show_modal_again.current,
        });
        localStorage.setItem('p2p_settings', JSON.stringify(p2p_settings));
    };

    return (
        <Modal
            width='540px'
            is_open={is_open}
            title={<Localize i18n_default_text='Introducing floating rates' />}
            toggleModal={closeModal}
        >
            <Modal.Body>
                <img
                    className='introducing-floating-rates-modal__image'
                    src={getUrlBase('/public/images/common/dp2p_introduction.png')}
                />
                <Text as='p' line_height='l'>
                    <Localize i18n_default_text='Volatile exchange rates can be difficult to manage when you have open ads and orders.' />
                </Text>
                <Text as='p' line_height='l'>
                    <Localize i18n_default_text="From now on, use floating rates for all your ads; you won't have to worry about the market moving too far away from your price anymore." />
                </Text>
                <Text as='p' line_height='l'>
                    <Localize
                        i18n_default_text='Remember to set floating rates for your existing ads. Fixed-rate ads will be deactivated on {{end_date}}.'
                        values={{ end_date: floating_rate_store.fixed_rate_adverts_end_date }}
                    />
                </Text>
                <Text as='p' line_height='l'>
                    <Localize i18n_default_text='This is a new feature, so if you have any feedback, please let us know.' />
                </Text>
                <Checkbox
                    className='introducing-floating-rates-modal__checkbox'
                    classNameLabel='introducing-floating-rates-modal__checkbox--label'
                    label={localize("Don't show me this message again.")}
                    onChange={onCheckboxChange}
                    value={should_not_show_modal_again.current}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button large primary onClick={closeModal}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(IntroducingFloatingRatesModal);
