import React from 'react';
// import classNames from 'classnames';

import { Icon } from '@deriv/components';

const NewTradeTypeWidget = () => (
    <div className='trade-type_section'>
        <div className='trade-type_container'>
            <div className='trade-type_container_left'>
                <Icon icon='IcTradetypeMultup' size={17} color='brand' />
                <Icon icon='IcUnderlying1HZ75V' size={20} />
                <div className='trade-type_name'>
                    Multipliers
                    <span className='trade-type_dot' />
                    <span style={{ color: 'var(--core-color-opacity-black-400, rgba(0, 0, 0, 0.48))' }}>
                        Volatility 75 (1s) Index
                    </span>
                </div>
            </div>
            <div className='trade-type_container_right'>
                <Icon icon='IcChevronRight' height={24} width={20} />
            </div>
        </div>
    </div>
);

export default NewTradeTypeWidget;
