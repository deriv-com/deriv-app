import React from 'react';
// import classNames from 'classnames';

import { Icon } from '@deriv/components';

const NewTradeTypeWidget = () => (
    <div className='trade-type_section'>
        <div className='trade-type_container'>
            <div className='trade-type_container_left'>
                <Icon icon='IcUnderlyingR_75' size={32} />
                <div className='trade-type_name'>
                    <div>Turbos - Long/Short</div>
                    <div style={{ color: 'var(--core-color-opacity-black-400, rgba(0, 0, 0, 0.48))' }}>
                        Volatility 75 Index
                    </div>
                </div>
            </div>
            <div className='trade-type_container_right'>
                <div className='trade-type_price'>
                    <div>333440.0000</div>
                    <div style={{ color: 'var(--core-color-solid-emerald-700, #00C390)' }}>+ 0.00%</div>
                </div>
                <Icon icon='IcChevronRight' size={24} />
            </div>
        </div>
    </div>
);

export default NewTradeTypeWidget;
