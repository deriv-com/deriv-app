import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'Stores/connect';
import { Button, Modal, Text, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getStaticUrl, PlatformContext, toTitleCase } from '@deriv/shared';

const UnlinkSuccessModal = ({ onClose, is_open, social_identity_provider, identifier_title }) => {
    const { is_dashboard } = React.useContext(PlatformContext);

    const onClickButton = () => {
        onClose();
        window.location.href = getStaticUrl('/', { is_dashboard });
    };

    return (
        <Modal is_open={is_open} has_close_icon toggleModal={onClose} width='440px'>
            <React.Fragment>
                <Icon
                    className='unlink-email-success__modal-icon'
                    icon={`IcUnlink${toTitleCase(social_identity_provider)}`}
                    size={128}
                />
                <Text className='unlink-email-success__modal-title' weight='bold' size='s'>
                    <Localize i18n_default_text='Success!' />
                </Text>
                <Text className='unlink-email-success__modal-title' size='xs'>
                    <Localize
                        i18n_default_text='Your Deriv account has been unlinked from your {{identifier_title}} account. You can now log in to Deriv using your new email address and password.'
                        values={{ identifier_title }}
                    />
                </Text>
                <Modal.Footer className='unlink-email-success__footer'>
                    <Button onClick={onClickButton} has_effect text={localize('Login now')} primary large />
                </Modal.Footer>
            </React.Fragment>
        </Modal>
    );
};

UnlinkSuccessModal.prototypes = {
    onClose: PropTypes.func,
    is_open: PropTypes.bool,
    social_identity_provider: PropTypes.string,
    identifier_title: PropTypes.string,
};

export default connect(({ client }) => ({
    social_identity_provider: client.social_identity_provider,
}))(UnlinkSuccessModal);
