import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonLink, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import Icon from '@deriv/components/src/components/icon';
import 'Sass/app/_common/components/poa-poi-address-modal.scss';
import { routes } from '@deriv/shared';
import PoaPoiInform from 'Assets/SvgComponents/settings//poa_poi_inform.svg';
import { connect } from 'Stores/connect';
import populateVerificationStatus from '@deriv/account/src/Sections/Verification/Helpers/verification';

const PoiAndPoaVerificationModal = ({ account_status, is_open, toggleModal }) => {
    const verification_status = populateVerificationStatus(account_status);
    const { has_poa, has_poi } = verification_status;
    let title = '';
    if (has_poi && has_poa) {
        title = 'Your documents are being reviewed, this can take up to 3 days.';
    } else if (has_poi && !has_poa) {
        title = 'Verify your proof of address to trade with real Deriv Multipliers account.';
    } else {
        title = 'Verify your proof of identity to trade with real Deriv Multipliers account.';
    }
    return (
        <Modal
            className={'poa-poi-verification'}
            width={'480px'}
            id='poi_poa_modal'
            is_open={is_open}
            has_close_icon={false}
            title={
                <div className={'title-element'}>
                    <PoaPoiInform />
                    <Text
                        className={'title-text'}
                        as='p'
                        color='prominent'
                        line_height='l'
                        weight='bold'
                        align='center'
                    >
                        <Localize i18n_default_text={title} />
                    </Text>
                </div>
            }
        >
            <Modal.Body>
                <div className='proof-of-identity-text-container'>
                    <Text size='xs' as='span' line_height='m'>
                        <Localize i18n_default_text='Upload document to verify your identity' />
                    </Text>
                    {has_poi ? (
                        <Icon icon={'IcCheckmark'} color={'green'} size={24} />
                    ) : (
                        <ButtonLink
                            className='arrow-icon-container'
                            to={routes.proof_of_identity}
                            onClick={toggleModal}
                            primary
                        >
                            <Icon icon='IcArrowRight' color='active' size={24} />
                        </ButtonLink>
                    )}
                </div>
                <div className='proof-of-address-text-container'>
                    <Text size='xs' as='span' line_height='m'>
                        <Localize i18n_default_text='Upload document to verify your address' />
                    </Text>
                    {has_poa ? (
                        <Icon icon={'IcCheckmark'} color={'green'} size={24} />
                    ) : (
                        <ButtonLink
                            className='arrow-icon-container'
                            to={routes.proof_of_address}
                            onClick={toggleModal}
                            primary
                        >
                            <Icon icon={'IcArrowRight'} color={'active'} size={24} />
                        </ButtonLink>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='footer-container bottom-button'>
                    <Button
                        // className='acc-info__button'
                        has_effect
                        secondary
                        onClick={toggleModal}
                        text={localize('Not now')}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    );
};

PoiAndPoaVerificationModal.propTypes = {
    closePoaPoiInformModal: PropTypes.func,
    is_poi_poa_inform_modal_visible: PropTypes.bool,
    account_status: PropTypes.object,
};
export default connect(({ client }) => ({
    account_status: client.account_status,
}))(PoiAndPoaVerificationModal);
