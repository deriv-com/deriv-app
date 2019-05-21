import PropTypes           from 'prop-types';
import React               from 'react';
import { CSSTransition }   from 'react-transition-group';
import { connect }         from 'Stores/connect';
import ContractError       from '../Components/contract-error.jsx';
import { InfoBoxLongcode } from '../Components/InfoBox';
import ChartCloseBtn       from '../../SmartChart/Components/chart-close-btn.jsx';

const InfoBox = ({
    contract_info,
    is_contract_mode,
    is_trade_page,
    onClickNewTrade,
    onClose,
    error_message,
    removeError,
    replay_info,
}) => {
    const Contents = InfoBoxLongcode;
    const info     = is_trade_page ? contract_info : replay_info;
    return (
        <CSSTransition
            in={is_contract_mode}
            timeout={250}
            classNames={{
                enter    : 'info-box-container--enter',
                enterDone: 'info-box-container--enter-done',
                exit     : 'info-box-containert--exit',
            }}
            unmountOnExit
        >
            <React.Fragment>
                <div className='info-box-container'>
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
                        onClose={(e) => {
                            onClose();
                            onClickNewTrade(e);
                        }}
                    />
                </div>
            </React.Fragment>
        </CSSTransition>
    );
};

InfoBox.propTypes = {
    contract_info   : PropTypes.object,
    error_message   : PropTypes.string,
    is_contract_mode: PropTypes.bool,
    is_trade_page   : PropTypes.bool,
    onClickNewTrade : PropTypes.func,
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
        onClickNewTrade : modules.trade.onClickNewTrade,
        onClose         : modules.contract.onCloseContract,
        is_contract_mode: modules.smart_chart.is_contract_mode,
    })
)(InfoBox);
