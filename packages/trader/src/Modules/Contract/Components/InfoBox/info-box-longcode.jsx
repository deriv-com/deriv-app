import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';

const InfoBoxLongcode = ({ contract_info }) => {
    return (
        <div className='info-box-longcode'>
            <Icon icon='IcContractFlag' className='info-box-longcode-icon' size={24} />
            <span className='info-box-longcode-text'>{contract_info.longcode}</span>
        </div>
    );
};

InfoBoxLongcode.propTypes = {
    longcode: PropTypes.string,
};

export default observer(InfoBoxLongcode);
