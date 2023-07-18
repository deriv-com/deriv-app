import React from 'react';
import { Button, Checkbox, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { api_error_codes } from 'Constants/api-error-codes';
import { useStores } from 'Stores/index';

const AdCreatedModal = () => {
    const { my_ads_store } = useStores();
    const { setIsAdCreatedModalVisible, setShowAdForm, advert_details } = my_ads_store;
    const { hideModal, is_modal_open, showModal } = useModalManagerContext();
    const should_not_show_auto_archive_message_again = React.useRef(false);
    const { AD_EXCEEDS_BALANCE, AD_EXCEEDS_DAILY_LIMIT } = api_error_codes;

    const onCheckboxChange = () =>
        (should_not_show_auto_archive_message_again.current = !should_not_show_auto_archive_message_again.current);

    const onClickOkCreatedAd = () => {
        localStorage.setItem(
            'should_not_show_auto_archive_message',
            JSON.stringify(should_not_show_auto_archive_message_again.current)
        );
        setIsAdCreatedModalVisible(false);
        hideModal();

        //TODO: use advert_details directly from AdVisibilityErrorModal once it's refactored
        if (advert_details?.visibility_status?.includes(AD_EXCEEDS_BALANCE)) {
            showModal(
                {
                    key: 'AdVisibilityErrorModal',
                    props: { error_code: AD_EXCEEDS_BALANCE },
                },
                { should_stack_modal: isMobile() }
            );
        } else if (advert_details?.visibility_status?.includes(AD_EXCEEDS_DAILY_LIMIT)) {
            showModal(
                {
                    key: 'AdVisibilityErrorModal',
                    props: { error_code: AD_EXCEEDS_DAILY_LIMIT },
                },
                { should_stack_modal: isMobile() }
            );
        }
        setShowAdForm(false);
    };

    return (
        <Modal has_close_icon={false} is_open={is_modal_open} small title={localize("You've created an ad")}>
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    <Localize
                        i18n_default_text="If the ad doesn't receive an order for {{adverts_archive_period}} days, it will be deactivated."
                        values={{ adverts_archive_period: my_ads_store.adverts_archive_period }}
                    />
                </Text>
                <br />
                <Checkbox
                    label={localize('Don’t show this message again.')}
                    onChange={onCheckboxChange}
                    value={should_not_show_auto_archive_message_again.current}
                    data-testid='dt_ad_created_modal_checkbox'
                />
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('Ok')} onClick={onClickOkCreatedAd} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(AdCreatedModal);
