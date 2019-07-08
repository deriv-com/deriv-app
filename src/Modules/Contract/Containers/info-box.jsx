import PropTypes           from 'prop-types';
import React               from 'react';
import { SlideIn }         from 'App/Components/Animations';
import { connect }         from 'Stores/connect';
import ContractError       from '../Components/contract-error.jsx';
import { InfoBoxLongcode } from '../Components/InfoBox';
import ChartCloseBtn       from '../../SmartChart/Components/chart-close-btn.jsx';

const InfoBox = ({
    contract_info,
    is_contract_mode,
    is_trade_page,
    onClose,
    error_message,
    removeError,
    replay_info,
}) => {
    const Contents = InfoBoxLongcode;
    const info     = is_trade_page ? contract_info : replay_info;
    const is_ready = is_contract_mode && !!(info.longcode);
    return (
        <SlideIn
            is_visible={is_ready}
            className='info-box-container'
            keyname='info-box-container'
        >
            { info.contract_type &&
                <div className='info-box'>
                    <Contents
                        contract_info={info}
                    />
                </div>
            }
            <ContractError
                message={error_message}
                onClickClose={removeError}
            />
            <ChartCloseBtn
                is_contract_mode={is_contract_mode}
                onClose={onClose}
            />
        </SlideIn>
    );
};

InfoBox.propTypes = {
    contract_info   : PropTypes.object,
    error_message   : PropTypes.string,
    is_contract_mode: PropTypes.bool,
    is_trade_page   : PropTypes.bool,
    onClose         : PropTypes.func,
    removeError     : PropTypes.func,
    replay_info     : PropTypes.object,
};

export default connect(
    ({ modules }) => ({
        contract_info   : modules.contract.contract_info,
        error_message   : modules.contract.error_message,
        replay_info     : modules.contract.replay_info,
        removeError     : modules.contract.removeErrorMessage,
        onClose         : modules.contract.onCloseContract,
        is_contract_mode: modules.smart_chart.is_contract_mode,
    })
)(InfoBox);
