import PropTypes       from 'prop-types';
import React           from 'react';
import { SlideIn }     from 'App/Components/Animations';
import ChartCloseBtn   from 'Modules/SmartChart/Components/chart-close-btn.jsx';
import InfoBoxLongcode from './info-box-longcode.jsx';
import ContractError   from '../contract-error.jsx';

const InfoBox = ({
    contract_info,
    error_message,
    is_contract_mode,
    is_trade_page,
    onClose,
    removeError,
}) => {
    const Contents = InfoBoxLongcode;
    const is_ready = is_contract_mode && !!(contract_info.longcode);
    const has_close_btn = is_trade_page && (typeof onClose === 'function');
    return (
        <SlideIn
            is_visible={is_ready}
            className='info-box-container'
            keyname='info-box-container'
        >
            { !!(contract_info.contract_type) &&
                <div className='info-box'>
                    <Contents
                        contract_info={contract_info}
                    />
                </div>
            }
            <ContractError
                message={error_message}
                onClickClose={removeError}
            />
            {has_close_btn &&
                <ChartCloseBtn
                    is_contract_mode={is_contract_mode}
                    onClose={onClose}
                />
            }
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
};

export default InfoBox;
