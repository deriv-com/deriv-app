import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import CreateAdModalCard from './create-ad-modal-card';

const CreateAdModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal
            className='create-ad-modal'
            has_close_icon
            title={<Localize i18n_default_text='Create new ad' />}
            is_open={is_modal_open}
            toggleModal={hideModal}
            width='44rem'
        >
            <Modal.Body className='create-ad-modal__body'>
                <CreateAdModalCard
                    title={<Localize i18n_default_text='Normal P2P' />}
                    text={<Localize i18n_default_text='Convenient way to make small trades' />}
                    type='normal'
                />
                <CreateAdModalCard
                    title={<Localize i18n_default_text='Block trade' />}
                    text={<Localize i18n_default_text='Safe and reliable way to make big trades' />}
                    type='block'
                />
            </Modal.Body>
        </Modal>
    );
};

export default observer(CreateAdModal);
