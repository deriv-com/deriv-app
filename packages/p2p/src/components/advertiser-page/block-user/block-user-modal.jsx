import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize, localize } from 'Components/i18next';

const BlockUserModal = ({ is_advertiser_blocked, onSubmit, onCancel }) => {
    const { advertiser_page_store } = useStores();

    return (
        <Modal
            has_close_icon={false}
            is_open={advertiser_page_store.is_block_user_modal_open}
            small
            title={
                <Text color='prominent' size='s' weight='bold'>
                    <Localize
                        i18n_default_text='{{is_advertiser_blocked}} {{advertiser_details_name}}?'
                        values={{
                            advertiser_details_name: advertiser_page_store.advertiser_details_name,
                            is_advertiser_blocked: is_advertiser_blocked ? 'Unblock' : 'Block',
                        }}
                    />
                </Text>
            }
        >
            <Modal.Body>
                <Text color='prominent' size='xs'>
                    <Localize
                        i18n_default_text={
                            is_advertiser_blocked
                                ? "You will be able to see {{ advertiser_details_name }}'s ads. They'll be able to place orders on your ads, too."
                                : "You won't see {{advertiser_details_name}}'s ads anymore and they won't be able to place orders on your ads."
                        }
                        values={{ advertiser_details_name: advertiser_page_store.advertiser_details_name }}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button secondary onClick={onCancel} large>
                    {localize('Cancel')}
                </Button>
                <Button primary large onClick={onSubmit}>
                    {localize('{{is_advertiser_blocked}}', {
                        is_advertiser_blocked: is_advertiser_blocked ? 'Unblock' : 'Block',
                    })}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

BlockUserModal.propTypes = {
    is_advertiser_blocked: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default observer(BlockUserModal);
