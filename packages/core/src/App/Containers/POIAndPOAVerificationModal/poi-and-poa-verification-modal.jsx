import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import Icon from '@deriv/components/src/components/icon';
import 'Sass/poa-poi-address-modal.scss';

const PoiAndPoaVerificationModal = ({ modal_title, isOpenModal, closeModal }) => {
    return (
        <Modal
            className={'poa-poi-verification'}
            width={'480px'}
            title={
                <div className={'title-element'}>
                    <Icon icon='IcArrowRight' color='active' size={36} />
                    <Text as='p' color='prominent' line_height='l' weight='bold' align='center'>
                        <Localize i18n_default_text={modal_title} />
                    </Text>
                </div>
            }
            id='poi_poa_modal'
            is_open={isOpenModal}
            has_close_icon={false}
        >
            <div className='modal-content'>
                <div className='proof-text-container'>
                    <Text size='xs' as='span' line_height='m'>
                        <Localize i18n_default_text='Upload document to verify your identity' />
                    </Text>
                    <Button
                        className='arrow-icon-container'
                        has_effect
                        icon={<Icon icon='IcArrowRight' color='active' size={16} />}
                        onClick={() => {
                            // eslint-disable-next-line no-console
                            console.log('POI');
                        }}
                        primary
                    />
                </div>
                <div className='proof-text-container'>
                    <Text size='xs' as='span' line_height='m'>
                        <Localize i18n_default_text='Upload document to verify your address' />
                    </Text>
                    <Button
                        className='arrow-icon-container'
                        has_effect
                        icon={<Icon icon='IcArrowRight' color='active' size={16} />}
                        onClick={() => {
                            // eslint-disable-next-line no-console
                            console.log('POA');
                        }}
                        primary
                    />
                </div>
                <div className='bottom-button'>
                    <Button
                        // className='acc-info__button'
                        has_effect
                        secondary
                        onClick={() => {
                            closeModal();
                        }}
                        text={localize('Not now')}
                    />
                </div>
            </div>
        </Modal>
    );
};
export default PoiAndPoaVerificationModal;

PoiAndPoaVerificationModal.propTypes = {
    modal_title: PropTypes.string,
    isOpenModal: PropTypes.bool,
    closeModal: PropTypes.func,
};
