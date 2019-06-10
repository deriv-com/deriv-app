import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import Icon         from 'Assets/icon.jsx';

const InfoBoxLongcode = ({
    contract_info,
}) => (
    <div className='info-box-longcode'>
        <Icon icon='IconFlag' className='info-box-longcode-icon' />
        <span className='info-box-longcode-text'>{contract_info.longcode}</span>
    </div>
);

InfoBoxLongcode.propTypes = {
    longcode: PropTypes.string,
};

export default observer(InfoBoxLongcode);
