import React, { useEffect, useState } from 'react';
import ContractCard from 'Components/contract-card';
import Wrapper from '../../shared/wrapper';
import { getCardLabels, getContractTypeDisplay } from '../statics/contract';
import sampleData from '../sample-data/sampleData.json';
import '../contract-card.stories.scss';

const Basic = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    const data = sampleData.not_multiplier_complete;

    return (
        <Wrapper>
            <div style={{ width: '240px' }}>
                <div id='modal_root' />
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
                            contract_info={data.contract_info}
                            getCardLabels={getCardLabels}
                            is_multiplier={data.is_multiplier}
                            is_positions
                            is_sell_requested={data.is_sell_requested}
                            onClickCancel={data.onClickCancel}
                            onClickSell={data.onClickSell}
                            should_show_transition
                        />
                    </ContractCard>
                )}
            </div>
        </Wrapper>
    );
};

export default Basic;
