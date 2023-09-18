import React from 'react';
import { MobileFullPageModal, Modal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { QuickStrategyContainer } from './quick-strategy-components';

const QuickStrategy = observer(() => {
    const is_mobile = isMobile();
    const { quick_strategy } = useDBotStore();
    const { is_strategy_modal_open, loadDataStrategy } = quick_strategy;

    return (
        <>
            {is_mobile ? (
                <MobileFullPageModal
                    is_modal_open={is_strategy_modal_open}
                    className='quick-strategy__wrapper'
                    header={localize('Quick Strategy')}
                    onClickClose={loadDataStrategy}
                    height_offset='8rem'
                >
                    <QuickStrategyContainer />
                </MobileFullPageModal>
            ) : (
                <Modal
                    title={localize('Quick strategy')}
                    className='modal--strategy'
                    is_open={is_strategy_modal_open}
                    toggleModal={loadDataStrategy}
                    width={'78rem'}
                >
                    <div className='modal__content'>
                        <QuickStrategyContainer />
                    </div>
                </Modal>
            )}
        </>
    );
});

export default QuickStrategy;
