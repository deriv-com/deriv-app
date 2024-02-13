import React from 'react';
import { ButtonToggle } from '@deriv/components';

const NewTradeParamsContainer = ({
    onClick,
    setSelectedType,
    selected_left_type,
    selected_multiplier,
}: {
    onClick: (trade_param: string) => void;
    setSelectedType: (selected_left_type: boolean) => void;
    selected_left_type: boolean;
    selected_multiplier: string;
}) => {
    return (
        <div className='trade-param_section'>
            <div className='trade-param_section_title'>
                <div className='trade-param_section_title_top'>
                    <div className='bold'>Parameters</div>
                    <div className='bold' style={{ color: 'var(--core-color-opacity-black-400, rgba(0, 0, 0, 0.48))' }}>
                        222904.7662
                    </div>
                </div>
                <div className='trade-param_section_title_bottom'>
                    <div>Set trade parameters.</div>
                    <div style={{ color: 'var(--core-color-solid-emerald-700, #00C390)' }}>+0.87%</div>
                </div>
            </div>
            <div className='contract-type-info__button-wrapper trade-param_toggle-button'>
                <ButtonToggle
                    buttons_arr={[
                        { text: 'Up', value: 'Up' },
                        { text: 'Down', value: 'Down' },
                    ]}
                    name='description_glossary_filter'
                    is_animated
                    has_rounded_button
                    onChange={() => setSelectedType(!selected_left_type)}
                    value={selected_left_type ? 'Up' : 'Down'}
                />
            </div>
            <div
                className='trade-param_container'
                onClick={() => onClick('multiplier')}
                onKeyDown={() => onClick('multiplier')}
            >
                <div className='trade-param_name'>Multiplier</div>
                <div style={{ fontSize: '16px', lineHeight: '24px' }}>{selected_multiplier}</div>
            </div>
            <div className='trade-param_container' onClick={() => onClick('stake')} onKeyDown={() => onClick('stake')}>
                <div className='trade-param_name'>Stake</div>
                <div style={{ fontSize: '16px', lineHeight: '24px' }}>10.00 USD</div>
            </div>
            <div
                className='trade-param_container'
                onClick={() => onClick('risk_management')}
                onKeyDown={() => onClick('risk_management')}
            >
                <div className='trade-param_name'>Risk management</div>
                <div style={{ fontSize: '16px', lineHeight: '24px' }}>Take profit: 1.00 USD</div>
            </div>
        </div>
    );
};

export default NewTradeParamsContainer;
