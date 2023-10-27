import React from 'react';
import Draggable from 'Components/draggable';
import { quick_strategy_content } from '../config';
import { MobileFullPageModal, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { localize } from '@deriv/translations';

const QuickStrategyDetailsModal = observer(() => {
    const [screenDimensions, setScreenDimensions] = React.useState({ width: 0, height: 0 });
    const { ui } = useStore();
    const { dashboard } = useDBotStore();
    const { is_mobile } = ui;
    const { is_quick_strategy_modal_open, QuickStrategyDetailsModal } = dashboard;
    const modalWidth = 800;
    const modalHeight = 800;
    const xaxis = (screenDimensions.width - modalWidth) / 2;
    const yAxisValue = (screenDimensions.height - modalHeight) / 2;
    const yaxis = yAxisValue >= 0 ? yAxisValue : 0;

    const handleResize = () => {
        setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    React.useEffect(() => {
        window.addEventListener('resize', handleResize);
        setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const LoadQuickStrategyInfo = () => {
        return (
            <div className='quick-strategy-details-modal'>
                {quick_strategy_content.map(quick_strategy_content => {
                    return quick_strategy_content?.description.map(data => {
                        return (
                            <>
                                {data.title && (
                                    <div className='quick-strategy-details-modal__title'>
                                        <Text
                                            align='center'
                                            weight='bold'
                                            color='prominent'
                                            line_height='s'
                                            size={is_mobile ? 'xxs' : 's'}
                                        >
                                            {data.title}
                                        </Text>
                                    </div>
                                )}
                                {data.content && (
                                    <div className='quick-strategy-details-modal__content'>
                                        <Text
                                            align='center'
                                            color='prominent'
                                            line_height='s'
                                            size={is_mobile ? 'xxs' : 's'}
                                        >
                                            {data.content}
                                        </Text>
                                    </div>
                                )}
                                {data.image && (
                                    <div className='quick-strategy-details-modal__image'>
                                        <img src={data.image} alt={data.title} />
                                    </div>
                                )}
                            </>
                        );
                    });
                })}
            </div>
        );
    };

    return (
        <>
            {is_mobile ? (
                <MobileFullPageModal
                    is_modal_open={is_quick_strategy_modal_open}
                    className='load-strategy__wrapper'
                    header={localize('About Martingale')}
                    onClickClose={QuickStrategyDetailsModal}
                    height_offset='80px'
                    page_overlay
                >
                    {LoadQuickStrategyInfo()}
                </MobileFullPageModal>
            ) : (
                <Draggable
                    bounds='.dashboard__main'
                    dragHandleClassName='react-rnd-wrapper-header'
                    is_visible={is_quick_strategy_modal_open}
                    minWidth={modalWidth}
                    onCloseDraggable={QuickStrategyDetailsModal}
                    width={modalWidth}
                    xaxis={0}
                    yaxis={0}
                    header_title={'About Martingale'}
                >
                    {LoadQuickStrategyInfo()}
                </Draggable>
            )}
        </>
    );
});

export default QuickStrategyDetailsModal;
