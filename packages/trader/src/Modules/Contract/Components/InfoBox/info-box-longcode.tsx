import { observer } from 'mobx-react';
import React from 'react';
import { Icon, Text } from '@deriv/components';

type InfoBoxLongcodeProps = {
    longcode: string;
};

const InfoBoxLongcode = ({ contract_info }: InfoBoxLongcodeProps) => {
    return (
        <div className='info-box-longcode'>
            <Icon icon='IcContractFlag' className='info-box-longcode-icon' size={24} />
            <Text size='xs' className='info-box-longcode-text'>
                {contract_info.longcode}
            </Text>
        </div>
    );
};

export default observer(InfoBoxLongcode);
