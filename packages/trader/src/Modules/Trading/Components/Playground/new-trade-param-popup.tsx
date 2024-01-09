import React from 'react';
import classNames from 'classnames';
// import { CSSTransition } from 'react-transition-group';

const NewTradeParamPopup = ({ onClick, show_details }: { onClick: () => void; show_details?: boolean }) => {
    const [should_expand, setShouldExpand] = React.useState(false);

    const onClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setShouldExpand(!should_expand);
    };

    return (
        <div className='trade-param_popup_overlay' onClick={onClick}>
            {/* <CSSTransition
                in={show_details}
                timeout={500}
                classNames={{
                    enter: 'trade-param_popup_container--enter',
                    enterDone: 'trade-param_popup_container--enterDone',
                    exit: 'trade-param_popup_container--exit',
                }}
                unmountOnExit
            > */}
            <div
                onClick={onClickHandler}
                className={classNames('trade-param_popup_container', {
                    'trade-param_popup_container--expanded': should_expand,
                })}
            >
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
                            defaultValue={1}
                        />
                        <div className='trade-param_popup_input_text'>Acceptable range: 1 - 1,440 minutes</div>
                    </div>
                </div>
                <div className='trade-param_popup_bottom'>
                    <button className='footer-new_bottom-sheet_button'>Save</button>
                </div>
            </div>
            {/* </CSSTransition> */}
        </div>
    );
};

export default NewTradeParamPopup;
