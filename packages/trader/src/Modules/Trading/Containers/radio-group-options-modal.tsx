import React from 'react';
import { Div100vhContainer, Modal, usePreventIOSZoom } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getGrowthRatePercentage, isEmptyObject, TRADE_TYPES } from '@deriv/shared';
import MultiplierOptions from 'Modules/Trading/Containers/Multiplier/multiplier-options';
import RadioGroupWithInfoMobile from 'Modules/Trading/Components/Form/RadioGroupWithInfoMobile';
import { observer } from '@deriv/stores';

type TRadioGroupOptionsModal = {
    is_open: boolean;
    modal_title: React.ReactNode;
    toggleModal: () => void;
};

const RadioGroupOptionsModal = observer(({ is_open, modal_title, toggleModal }: TRadioGroupOptionsModal) => {
    const { accumulator_range_list, growth_rate, onChange, tick_size_barrier_percentage, proposal_info } =
        useTraderStore();

    // Fix to prevent iOS from zooming in erratically on quick taps
    usePreventIOSZoom();
    const has_error_or_not_loaded =
        proposal_info?.ACCU?.has_error || !proposal_info?.ACCU?.id || isEmptyObject(proposal_info);

    return (
        <React.Fragment>
            <Modal
                id='dt_trade_parameters_mobile'
                className='trade-params dc-modal-header--title-bar'
                is_open={is_open}
                is_title_centered
                should_header_stick_body={false}
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
                            contract_name={TRADE_TYPES.ACCUMULATOR}
                            current_value_object={{ name: 'growth_rate', value: growth_rate }}
                            info={localize(
                                'Your stake will grow at {{growth_rate}}% per tick as long as the current spot price remains within ±{{tick_size_barrier_percentage}} from the previous spot price.',
                                {
                                    growth_rate: getGrowthRatePercentage(growth_rate),
                                    tick_size_barrier_percentage,
                                }
                            )}
                            is_tooltip_disabled={has_error_or_not_loaded}
                            items_list={accumulator_range_list?.map(value => ({
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
});

export default RadioGroupOptionsModal;
