import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import RegulatorsCompareModalContent from './regulators-compare-modal-content';

const RegulatorsCompareModal = () => {
    const { tradinghub } = useStores();
    const { is_regulators_compare_modal_visible, toggleRegulatorsCompareModal } = tradinghub;

    const closeModal = () => {
        toggleRegulatorsCompareModal();
    };

    return (
        <Modal
            title={localize('Non-EU and EU regulator')}
            is_open={is_regulators_compare_modal_visible}
            toggleModal={closeModal}
            height='792px'
            width='792px'
            className='regulator-modal'
        >
            <div className='regulator-modal__separator' />
            <RegulatorsCompareModalContent />
        </Modal>
    );
};

export default observer(RegulatorsCompareModal);
