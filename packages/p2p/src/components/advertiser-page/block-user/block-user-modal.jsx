import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';

const BlockUserModal = ({ advertiser, is_advertiser_blocked, is_block_user_modal_open, onCancel, onSubmit }) => {
    return (
        <Modal
            has_close_icon={false}
            is_open={is_block_user_modal_open}
            small
            title={
                <Text color='prominent' size='s' weight='bold'>
                    {is_advertiser_blocked ? (
                        <Localize
                            i18n_default_text='Unblock {{advertiser_name}}?'
                            values={{
                                advertiser_name: advertiser.name,
                            }}
                        />
                    ) : (
                        <Localize
                            i18n_default_text='Block {{advertiser_name}}?'
                            values={{
                                advertiser_name: advertiser.name,
                            }}
                        />
                    )}
                </Text>
            }
        >
            <Modal.Body>
                <Text color='prominent' size='xs'>
                    {is_advertiser_blocked ? (
                        <Localize
                            i18n_default_text="You will be able to see {{ advertiser_name }}'s ads. They'll be able to place orders on your ads, too."
                            values={{ advertiser_name: advertiser.name }}
                        />
                    ) : (
                        <Localize
                            i18n_default_text="You won't see {{advertiser_name}}'s ads anymore and they won't be able to place orders on your ads."
                            values={{ advertiser_name: advertiser.name }}
                        />
                    )}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button secondary onClick={onCancel} large>
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button primary large onClick={onSubmit}>
                    {is_advertiser_blocked ? (
                        <Localize i18n_default_text='Unblock' />
                    ) : (
                        <Localize i18n_default_text='Block' />
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

BlockUserModal.propTypes = {
    advertiser: PropTypes.object.isRequired,
    is_advertiser_blocked: PropTypes.bool.isRequired,
    is_block_user_modal_open: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default observer(BlockUserModal);
