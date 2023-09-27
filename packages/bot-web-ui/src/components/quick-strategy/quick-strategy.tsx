/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */
import React from 'react';
import { MobileFullPageModal, Modal, MobileWrapper, DesktopWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { observer } from '@deriv/stores';
import './quick-strategy.scss';
import DesktopFormWrapper from './form-wrappers/desktop-form-wrapper';
import MobileFormWrapper from './form-wrappers/mobile-form-wrapper';
import Form from './form';

const QuickStrategy = observer(() => {
    const { quick_strategy_store_1 } = useDBotStore();
    const { is_open, setFormVisibility } = quick_strategy_store_1;

    const handleClose = () => {
        setFormVisibility(false);
    };

    return (
        <>
            <MobileWrapper>
                <MobileFullPageModal
                    is_modal_open={is_open}
                    className='quick-strategy__wrapper'
                    header={localize('Quick Strategy')}
                    onClickClose={handleClose}
                    height_offset='8rem'
                >
                    <MobileFormWrapper>
                        <Form />
                    </MobileFormWrapper>
                </MobileFullPageModal>
            </MobileWrapper>
            <DesktopWrapper>
                <Modal className='modal--strategy' is_open={is_open} toggleModal={handleClose} width={'99.6rem'}>
                    <DesktopFormWrapper>
                        <Form />
                    </DesktopFormWrapper>
                </Modal>
            </DesktopWrapper>
        </>
    );
});

export default QuickStrategy;
