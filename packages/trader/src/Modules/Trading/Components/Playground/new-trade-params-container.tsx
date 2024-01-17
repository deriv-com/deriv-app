import React from 'react';
// import classNames from 'classnames';
import { ButtonToggle } from '@deriv/components';

const NewTradeParamsContainer = ({ onClick }: { onClick: () => void }) => {
    return (
        <div className='trade-param_section'>
            <div className='trade-param_section_title'>
                <div className='bold'>Parameters</div>
                <div>Configure your trade parameters here.</div>
            </div>
            <div className='contract-type-info__button-wrapper trade-param_toggle-button'>
                <ButtonToggle
                    buttons_arr={[
                        { text: 'Long', value: 'Long' },
                        { text: 'Short', value: 'Short' },
                    ]}
                    name='description_glossary_filter'
                    is_animated
                    has_rounded_button
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onChange={() => {}}
                    value='Long'
                />
            </div>
            <div className='trade-param_container' onClick={onClick} onKeyDown={onClick}>
                <div className='trade-param_name'>Duration</div>
                <div style={{ fontSize: '16px', lineHeight: '24px' }}>End at 19:45 GMT</div>
            </div>
            <div className='trade-param_container'>
                <div className='trade-param_name'>Barrier</div>
                <div style={{ fontSize: '16px', lineHeight: '24px' }}>+1.00</div>
            </div>
            <div className='trade-param_container'>
                <div className='trade-param_name'>Stake</div>
                <div style={{ fontSize: '16px', lineHeight: '24px' }}>10.00 USD</div>
            </div>
            <div className='trade-param_container'>
                <div className='trade-param_name'>Risk management</div>
                <div style={{ fontSize: '16px', lineHeight: '24px' }}>-</div>
            </div>
        </div>
    );
};

export default NewTradeParamsContainer;
