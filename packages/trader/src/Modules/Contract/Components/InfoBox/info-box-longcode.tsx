import classNames from 'classnames';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile, TContractInfo } from '@deriv/shared';

type TInfoBoxLongcode = { contract_info: TContractInfo };

const InfoBoxLongcode = ({ contract_info }: TInfoBoxLongcode) => {
    const max_longcode_length = isMobile() ? 47 : 150;
    const [is_collapsed, setIsCollapsed] = React.useState(true);

    const handleToggle = () => {
        setIsCollapsed(!is_collapsed);
    };

    return (
        <div className='info-box-longcode'>
            <Icon icon='IcContractFlag' className='info-box-longcode-icon' size={24} />
            <div className='info-box-longcode-wrapper'>
                <Text
                    size='xs'
                    className={classNames('info-box-longcode-text', {
                        'info-box-longcode-text--collapsed': is_collapsed,
                    })}
                >
                    {contract_info.longcode}
                </Text>
                {` `}
                {contract_info?.longcode && contract_info.longcode.length > max_longcode_length && (
                    <Text as='a' href='#' size='xs' onClick={handleToggle} className='info-box-longcode-text'>
                        {is_collapsed ? localize('View more') : localize('View less')}
                    </Text>
                )}
            </div>
        </div>
    );
};

export default InfoBoxLongcode;
