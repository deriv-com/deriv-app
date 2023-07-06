import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const InfoBoxLongcode = ({ contract_info }) => {
    const max_longcode_length = 150;
    const [is_collapsed, setIsCollapsed] = React.useState(true);

    const handleToggle = () => {
      setIsCollapsed(!is_collapsed);
    };
    
    return (
        <div className='info-box-longcode'>
            <Icon icon='IcContractFlag' className='info-box-longcode-icon' size={24} />
            <div className='info-box-longcode-wrapper'>
                <Text size='xs' className={classNames('info-box-longcode-text', {'info-box-longcode-text--collapsed' : is_collapsed})}>
                    {contract_info.longcode}
                </Text>
                {` `}
                {contract_info.longcode.length > max_longcode_length && 
                <Text as='a' href='#' size='xs' onClick={handleToggle} c>
                    {is_collapsed ? localize('View more') : localize('View less')}
                </Text>}
            </div>
        </div>
    );
};

InfoBoxLongcode.propTypes = {
    contract_info: PropTypes.object,
    longcode: PropTypes.string,
    is_vanilla: PropTypes.bool,
};

export default observer(InfoBoxLongcode);
