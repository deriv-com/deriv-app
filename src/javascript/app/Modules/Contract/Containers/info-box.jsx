import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { CSSTransition }   from 'react-transition-group';
import { connect }         from 'Stores/connect';
import { isEnded }         from 'Stores/Modules/Contract/Helpers/logic';
import ContractError       from '../Components/contract-error.jsx';
import { InfoBoxLongcode } from '../Components/InfoBox';
import ChartCloseBtn       from '../../SmartChart/Components/chart-close-btn.jsx';

const InfoBox = ({
    is_contract_mode,
    contract_info,
    onClickNewTrade,
    onClose,
    removeError,
    sell_info,
}) => {
    const is_ended = isEnded(contract_info);
    const box_class = classNames('info-box', {
        'ended': is_ended,
    });

    const Contents = InfoBoxLongcode;
    return (
        // TODO: Resolve issue with undefined contract_info showing upon unmounting transition
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
                    { contract_info.contract_type &&
                        <div className={box_class}>
                            <Contents
                                contract_info={contract_info}
                                is_ended={is_ended}
                                sell_info={sell_info}
                            />
                        </div>
                    }
                    <ContractError
                        message={sell_info.error_message}
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
    is_contract_mode: PropTypes.bool,
    is_trade_page   : PropTypes.bool,
    onClickNewTrade : PropTypes.func,
    onClose         : PropTypes.func,
    removeError     : PropTypes.func,
    sell_info       : PropTypes.object,
};

export default connect(
    ({ modules }) => ({
        contract_info   : modules.contract.contract_info,
        removeError     : modules.contract.removeSellError,
        sell_info       : modules.contract.sell_info,
        onClickNewTrade : modules.trade.onClickNewTrade,
        onClose         : modules.contract.onCloseContract,
        is_contract_mode: modules.smart_chart.is_contract_mode,
    })
)(InfoBox);
