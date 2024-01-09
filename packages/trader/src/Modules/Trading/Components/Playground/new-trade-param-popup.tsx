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
                    <div>Duration</div>
                    <div>Minutes</div>
                    {/* <input
                        type='number'
                        style={{ border: '1px solid black' }}
                        min='0'
                        inputMode='numeric'
                        pattern='[0-9]*'
                        title='Non-negative integral number'
                    /> */}
                    <input type='text' style={{ border: '1px solid black' }} />
                    <div>Acceptable range: 1 - 1,440</div>
                </div>
                <div className='trade-param_popup_bottom'>
                    <button className='footer-new_bottom-sheet_button'>Save</button>
                </div>
            </div>
        </div>
    );
};

export default NewTradeParamPopup;
