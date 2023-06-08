import React from 'react';
import { Div100vhContainer, Modal, usePreventIOSZoom } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getGrowthRatePercentage, getTickSizeBarrierPercentage, isEmptyObject } from '@deriv/shared';
import MultiplierOptions from 'Modules/Trading/Containers/Multiplier/multiplier-options.jsx';
import RadioGroupWithInfoMobile from 'Modules/Trading/Components/Form/RadioGroupWithInfoMobile';
import { TCoreStores } from '@deriv/stores/types';
import { BuyContractRequest, Proposal, PriceProposalRequest, ProposalOpenContract } from '@deriv/api-types';

type TRadioGroupOptionsModal = {
    accumulator_range_list?: number[];
    growth_rate: ProposalOpenContract['growth_rate'] &
        Pick<NonNullable<BuyContractRequest['parameters']>, 'growth_rate'> &
        PriceProposalRequest['growth_rate'];
    is_open: boolean;
    modal_title: string;
    onChange: React.ComponentProps<typeof RadioGroupWithInfoMobile>['onChange'];
    proposal_info: {
        ACCU?: {
            has_error?: boolean;
            id?: string;
        };
    };
    tick_size_barrier: NonNullable<Required<Proposal['contract_details']>>['tick_size_barrier'];
    toggleModal: () => void;
};

const RadioGroupOptionsModal = ({
    accumulator_range_list,
    growth_rate,
    is_open,
    modal_title,
    onChange,
    proposal_info,
    tick_size_barrier,
    toggleModal,
}: TRadioGroupOptionsModal) => {
    // Fix to prevent iOS from zooming in erratically on quick taps
    usePreventIOSZoom();
    const has_error_or_not_loaded =
        proposal_info?.ACCU?.has_error ?? !proposal_info?.ACCU?.id ?? isEmptyObject(proposal_info);

    return (
        <React.Fragment>
            <Modal
                id='dt_trade_parameters_mobile'
                className='trade-params'
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
};

export default connect(({ modules }: TCoreStores) => ({
    accumulator_range_list: modules.trade.accumulator_range_list,
    growth_rate: modules.trade.growth_rate,
    onChange: modules.trade.onChange,
    proposal_info: modules.trade.proposal_info,
    tick_size_barrier: modules.trade.tick_size_barrier,
}))(RadioGroupOptionsModal);
