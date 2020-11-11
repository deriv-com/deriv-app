import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';

const InfoBoxLongcode = ({ contract_info }) => {
    return (
        <div className='info-box-longcode'>
            <Icon icon='IcContractFlag' className='info-box-longcode-icon' size={24} />
            <Text size='xs' className='info-box-longcode-text'>
                {contract_info.longcode}
            </Text>
        </div>
    );
};

InfoBoxLongcode.propTypes = {
    longcode: PropTypes.string,
};

export default observer(InfoBoxLongcode);
