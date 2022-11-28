import React from 'react';
import { connect } from 'Stores/connect';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { formatDate, formatTime } from '@deriv/shared';

const CooldownWarningModal = ({
    should_show_cooldown_modal,
    setShouldShowCooldownModal,
    real_account_creation_unlock_date,
}) => {
    const unblock_date = formatDate(real_account_creation_unlock_date, 'DD MMMM');
    const unblock_time = formatTime(real_account_creation_unlock_date, 'hh:mm a');
    const real_account_unblock_date = localize('{{unblock_date}} at {{unblock_time}}', { unblock_date, unblock_time });

    return (
        <Modal
            width='44rem'
            title={localize('24-hour Cool Down Warning')}
            is_open={should_show_cooldown_modal}
            className='center-risk-modal'
            has_close_icon={false}
        >
            <Modal.Body>
                <Icon icon='IcRedWarning' size={63} />
                <Text as='p' size='xs' align='center' className='risk-acceptance__text'>
                    <Localize
                        i18n_default_text='You can create your account on {{real_account_unblock_date}}. <0/>Please click ‘OK’ to continue.'
                        values={{ real_account_unblock_date }}
                        components={[<br key={0} />]}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type='button'
                    large
                    text={localize('OK')}
                    primary
                    onClick={() => {
                        setShouldShowCooldownModal(false);
                    }}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default connect(({ client, ui }) => ({
    real_account_creation_unlock_date: client.real_account_creation_unlock_date,
    should_show_cooldown_modal: ui.should_show_cooldown_modal,
    setShouldShowCooldownModal: ui.setShouldShowCooldownModal,
}))(CooldownWarningModal);
