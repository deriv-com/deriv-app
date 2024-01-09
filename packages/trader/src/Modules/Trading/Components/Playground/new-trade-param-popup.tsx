import React from 'react';
// import classNames from 'classnames';
// import { ButtonToggle } from '@deriv/components';

const NewTradeParamPopup = ({ onClick }: { onClick: () => void }) => {
    const onClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div className='trade-param_popup_overlay' onClick={onClick}>
            <div className='trade-param_popup_container' onClick={onClickHandler}>
                <div className='trade-param_popup_top'>
                    <div className='footer-new_bottom-sheet_separator' />
                    <div className='trade-param_popup_title'>
                        Duration <span>i</span>
                    </div>
                    <div className='trade-param_popup_duration'>
                        <span>Ticks</span>
                        <span>Seconds</span>
                        <span
                            style={{
                                backgroundColor: ' var(--core-color-opacity-black-800, rgba(0, 0, 0, 0.88))',
                                color: 'var(--core-color-solid-slate-50, #FFF)',
                            }}
                        >
                            Minutes
                        </span>
                    </div>
                    <div>
                        <input
                            type='number'
                            min='0'
                            inputMode='numeric'
                            pattern='[0-9]*'
                            title='Non-negative integral number'
                            className='trade-param_popup_input'
                            value={1}
                        />
                        <div className='trade-param_popup_input_text'>Acceptable range: 1 - 1,440 minutes</div>
                    </div>
                </div>
                <div className='trade-param_popup_bottom'>
                    <button className='footer-new_bottom-sheet_button'>Save</button>
                </div>
            </div>
        </div>
    );
};

export default NewTradeParamPopup;
