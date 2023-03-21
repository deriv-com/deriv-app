import PropTypes from 'prop-types';
import React from 'react';
import { SlideIn } from 'App/Components/Animations';
import InfoBoxLongcode from './info-box-longcode.jsx';
import ContractError from '../contract-error.jsx';

const InfoBox = ({ contract_info, error_message, removeError }) => {
    const is_ready = !!contract_info.longcode;
    return (
        <SlideIn is_visible={is_ready} className='info-box-container' keyname='info-box-container'>
            {!!contract_info.contract_type && (
                <div className='info-box'>
                    <InfoBoxLongcode contract_info={contract_info} />
                </div>
            )}
            <ContractError message={error_message} onClickClose={removeError} />
        </SlideIn>
    );
};

InfoBox.propTypes = {
    contract_info: PropTypes.object,
    error_message: PropTypes.string,
    removeError: PropTypes.func,
};

export default InfoBox;
