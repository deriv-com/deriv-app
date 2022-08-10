import React from 'react';
import { Icon, Modal, Text, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import PropTypes from 'prop-types';
import '../sass/app/_common/components/new-affiliate-account-modal.scss';

const affiliateAccountOptions = [
    { icon: 'withdrawal', title: localize('Withdrawals') },
    { icon: 'transfer', title: localize(`Inter-account transfers`) },
    { icon: 'statement', title: localize('View statement') },
];

const NewAffiliateAccountModal = ({ is_new_affiliate_account_modal_visible, toggleNewAffiliateAccountModal }) => {
    return (
        <Modal
            is_open={is_new_affiliate_account_modal_visible}
            toggleModal={toggleNewAffiliateAccountModal}
            width='44rem'
        >
            <Modal.Body>
                <Text as='h2' weight='bold'>
                    {localize('Here’s what you can do with your new Affiliate account')}
                </Text>

                <div className='new-affiliate-account-modal__body'>
                    {affiliateAccountOptions.map(({ icon, title }, idx) => (
                        <div key={idx} className='new-affiliate-account-modal__option'>
                            <Icon icon={icon} size={48} />
                            <Text as='p' size='xs' align='center'>
                                {title}
                            </Text>
                        </div>
                    ))}
                </div>
            </Modal.Body>

            <Modal.Footer className='new-affiliate-account-modal__footer'>
                <Button
                    className='new-affiliate-account-modal__button'
                    text={localize('OK')}
                    primary
                    onClick={toggleNewAffiliateAccountModal}
                />
            </Modal.Footer>
        </Modal>
    );
};

NewAffiliateAccountModal.propTypes = {
    is_new_affiliate_account_modal_visible: PropTypes.bool,
    toggleNewAffiliateAccountModal: PropTypes.func,
};

export default connect(({ client }) => ({
    is_new_affiliate_account_modal_visible: client.is_new_affiliate_account_modal_visible,
    toggleNewAffiliateAccountModal: client.toggleNewAffiliateAccountModal,
}))(NewAffiliateAccountModal);
