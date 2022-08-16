import React from 'react';
import { Icon, Modal, Text, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import PropTypes from 'prop-types';
import '../sass/app/_common/components/new-affiliate-account-modal.scss';

const affiliateAccountOptions = [
    { icon: 'ic-withdrawal', title: localize('Withdrawals') },
    { icon: 'ic-transfer', title: localize(`Inter-account transfers`) },
    { icon: 'ic-affiliate-statement', title: localize('View statement') },
];

const NewAffiliateAccountModal = ({ is_new_affiliate_account_modal_visible, toggleNewAffiliateAccountModal }) => {
    return (
        <Modal
            is_open={is_new_affiliate_account_modal_visible}
            toggleModal={toggleNewAffiliateAccountModal}
            width='44rem'
            has_close_icon
        >
            <div className='new-affiliate-account-modal__body'>
                <Text as='h2' weight='bold'>
                    {localize('Here’s what you can do with your new Affiliate account')}
                </Text>

                <div className='new-affiliate-account-modal__content'>
                    {affiliateAccountOptions.map(({ icon, title }) => (
                        <div key={icon} className='new-affiliate-account-modal__option'>
                            <div className='new-affiliate-account-modal__icon'>
                                <Icon icon={icon} size={48} />
                            </div>
                            <Text as='span' size='xs' align='center'>
                                {title}
                            </Text>
                        </div>
                    ))}
                </div>
            </div>

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
