import React, { useEffect, useState } from 'react';
import ContractCard from 'Components/contract-card';
import { getCardLabels, getContractTypeDisplay } from '../statics/contract';
import sampleData from '../sample-data/sampleData.json';
import '../contract-card.stories.scss';

const Basic = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    const data = sampleData.not_multiplier__complete;
    data.getContractById = () => {};

    return (
        <React.Fragment>
            <div id='modal_root' />
            <div className={'contract-card__wrapper'}>
                {loaded && (
                    <ContractCard
                        contract_info={data.contract_info}
                        getCardLabels={getCardLabels}
                        is_multiplier={data.is_multiplier}
                        profit_loss={data.profit_loss}
                        should_show_result_overlay={true}
                    >
                        <ContractCard.Header
                            contract_info={data.contract_info}
                            getCardLabels={getCardLabels}
                            getContractTypeDisplay={getContractTypeDisplay}
                            has_progress_slider={!data.is_multiplier}
                            is_mobile={false}
                            is_sell_requested={false}
                            onClickSell={() => {}}
                            server_time={null}
                        />
                        <ContractCard.Body
                            contract_info={data.contract_info}
                            contract_update={data.contract_update}
                            currency={data.currency}
                            getCardLabels={getCardLabels}
                            is_mobile={false}
                            is_multiplier={data.is_multiplier}
                            status={data.status}
                            server_time={null}
                        />
                        <ContractCard.Footer
                            addToast={data.addToast}
                            connectWithContractUpdate={null}
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
                            server_time={data.server_time}
                            should_show_cancellation_warning={data.should_show_cancellation_warning}
                            status={data.status}
                            toggleCancellationWarning={data.toggleCancellationWarning}
                        />
                    </ContractCard>
                )}
            </div>
        </React.Fragment>
    );
};

export default Basic;
