import React from 'react';
import ContractCard from 'Components/contract-card';
import { getCardLabels, getContractTypeDisplay } from '../statics/contract';
import sampleData from '../sample-data/sampleData.json';
import { toMoment } from '@deriv/shared';
import '../contract-card.stories.scss';

const Basic = () => {
    const data = sampleData.not_multiplier__open;

    return (
        <React.Fragment>
            <div className={'contract-card__wrapper'}>
                <ContractCard
                    contract_info={data.contract_info}
                    getCardLabels={getCardLabels}
                    is_multiplier={data.is_multiplier}
                    profit_loss={data.profit_loss}
                    should_show_result_overlay={false}
                >
                    <ContractCard.Header
                        contract_info={data.contract_info}
                        getCardLabels={getCardLabels}
                        getContractTypeDisplay={getContractTypeDisplay}
                        has_progress_slider={!data.is_multiplier}
                        is_mobile={false}
                        is_sell_requested={false}
                        onClickSell={() => {}}
                        server_time={toMoment(1603881751)}
                    />
                    <ContractCard.Body
                        contract_info={data.contract_info}
                        contract_update={data.contract_update}
                        currency={data.currency}
                        getCardLabels={getCardLabels}
                        is_mobile={false}
                        is_multiplier={data.is_multiplier}
                        status={data.status}
                        server_time={toMoment(1603881751)}
                    />
                    <ContractCard.Footer
                        addToast={data.addToast}
                        connectWithContractUpdate={data.connectWithContractUpdate}
                        contract_info={data.contract_info}
                        current_focus={data.current_focus}
                        getCardLabels={getCardLabels}
                        getContractById={data.getContractById}
                        is_multiplier={data.is_multiplier}
                        is_positions
                        is_sell_requested={data.is_sell_requested}
                        onClickCancel={data.onClickCancel}
                        onClickSell={data.onClickSell}
                        removeToast={data.removeToast}
                        setCurrentFocus={data.setCurrentFocus}
                        server_time={toMoment(1603881751)}
                        should_show_cancellation_warning={data.should_show_cancellation_warning}
                        status={data.status}
                        toggleCancellationWarning={data.toggleCancellationWarning}
                    />
                </ContractCard>
            </div>
        </React.Fragment>
    );
};

export default Basic;
