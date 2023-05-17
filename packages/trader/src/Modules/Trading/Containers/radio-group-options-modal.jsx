import React from 'react';
import { Div100vhContainer, Modal, usePreventIOSZoom } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getGrowthRatePercentage, getTickSizeBarrierPercentage, isEmptyObject } from '@deriv/shared';
import MultiplierOptions from 'Modules/Trading/Containers/Multiplier/multiplier-options.jsx';
import RadioGroupWithInfoMobile from 'Modules/Trading/Components/Form/RadioGroupWithInfoMobile';

const RadioGroupOptionsModal = ({
    accumulator_range_list,
    enableApp,
    disableApp,
    growth_rate,
    is_open,
    modal_title,
    onChange,
    proposal_info,
    tick_size_barrier,
    toggleModal,
}) => {
    // Fix to prevent iOS from zooming in erratically on quick taps
    usePreventIOSZoom();
    const has_error_or_not_loaded =
        proposal_info?.ACCU?.has_error || !proposal_info?.ACCU?.id || isEmptyObject(proposal_info);

    return (
        <React.Fragment>
            <Modal
                id='dt_trade_parameters_mobile'
                className='trade-params'
                enableApp={enableApp}
                is_open={is_open}
                is_title_centered
                should_header_stick_body={false}
                disableApp={disableApp}
                toggleModal={toggleModal}
                height='auto'
                width='calc(100vw - 32px)'
                title={modal_title}
            >
                <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='48px'>
                    {modal_title === localize('Multiplier') ? (
                        <MultiplierOptions toggleModal={toggleModal} />
                    ) : (
                        <RadioGroupWithInfoMobile
                            contract_name='accumulator'
                            current_value_object={{ name: 'growth_rate', value: growth_rate }}
                            info={localize(
                                'Your stake will grow by {{growth_rate}}% at every tick starting from the second tick, as long as the price remains within a range of ±{{tick_size_barrier}} from the previous tick price.',
                                {
                                    growth_rate: getGrowthRatePercentage(growth_rate),
                                    tick_size_barrier: getTickSizeBarrierPercentage(tick_size_barrier),
                                }
                            )}
                            is_tooltip_disabled={has_error_or_not_loaded}
                            items_list={accumulator_range_list.map(value => ({
                                text: `${getGrowthRatePercentage(value)}%`,
                                value,
                            }))}
                            onChange={onChange}
                            popover_alignment='bottom'
                            toggleModal={toggleModal}
                        />
                    )}
                </Div100vhContainer>
            </Modal>
        </React.Fragment>
    );
};

export default connect(({ modules, ui }) => ({
    accumulator_range_list: modules.trade.accumulator_range_list,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    growth_rate: modules.trade.growth_rate,
    onChange: modules.trade.onChange,
    proposal_info: modules.trade.proposal_info,
    tick_size_barrier: modules.trade.tick_size_barrier,
}))(RadioGroupOptionsModal);
