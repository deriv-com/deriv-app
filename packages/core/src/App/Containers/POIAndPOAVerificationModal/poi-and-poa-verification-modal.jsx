import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonLink, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import Icon from '@deriv/components/src/components/icon';
import 'Sass/poa-poi-address-modal.scss';
import { routes } from '@deriv/shared';
import PoaPoiInform from 'Assets/SvgComponents/settings//poa_poi_inform.svg';
import { connect } from 'Stores/connect';

const PoiAndPoaVerificationModal = ({ modal_title, is_poi_poa_inform_modal_visible, closePoaPoiInformModal }) => {
    return (
        <Modal
            className={'poa-poi-verification'}
            width={'480px'}
            id='poi_poa_modal'
            is_open={is_poi_poa_inform_modal_visible}
            has_close_icon={false}
            title={
                <div className={'title-element'}>
                    <PoaPoiInform />
                    <Text
                        className={'modal_text_title'}
                        as='p'
                        color='prominent'
                        line_height='l'
                        weight='bold'
                        align='center'
                    >
                        <Localize i18n_default_text={modal_title} />
                    </Text>
                </div>
            }
        >
            <div className='modal-content'>
                <div className='proof-text-container'>
                    <Text size='xs' as='span' line_height='m'>
                        <Localize i18n_default_text='Upload document to verify your identity' />
                    </Text>
                    <ButtonLink
                        className='arrow-icon-container'
                        to={routes.proof_of_identity}
                        onClick={closePoaPoiInformModal}
                        primary
                    >
                        <Icon icon='IcArrowRight' color='active' size={24} />
                    </ButtonLink>
                </div>
                <div className='proof-text-container'>
                    <Text size='xs' as='span' line_height='m'>
                        <Localize i18n_default_text='Upload document to verify your address' />
                    </Text>
                    <ButtonLink
                        className='arrow-icon-container'
                        to={routes.proof_of_address}
                        onClick={closePoaPoiInformModal}
                        primary
                    >
                        <Icon icon='IcArrowRight' color='active' size={24} />
                    </ButtonLink>
                </div>
                <div className='bottom-button'>
                    <Button
                        // className='acc-info__button'
                        has_effect
                        secondary
                        onClick={closePoaPoiInformModal}
                        text={localize('Not now')}
                    />
                </div>
            </div>
        </Modal>
    );
};

PoiAndPoaVerificationModal.propTypes = {
    modal_title: PropTypes.string,
    closePoaPoiInformModal: PropTypes.func,
    is_poi_poa_inform_modal_visible: PropTypes.bool,
};
export default connect(({ ui }) => ({
    is_poi_poa_inform_modal_visible: ui.is_poi_poa_inform_modal_visible,
    closePoaPoiInformModal: ui.closePoaPoiInformModal,
}))(PoiAndPoaVerificationModal);
