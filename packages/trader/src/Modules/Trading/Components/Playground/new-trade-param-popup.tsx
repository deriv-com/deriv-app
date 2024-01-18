import React from 'react';
import classNames from 'classnames';
import { ButtonToggle } from '@deriv/components';
import { useSwipeable } from 'react-swipeable';
import { CSSTransition } from 'react-transition-group';

const NewTradeParamPopup = ({ onClick, show_details }: { onClick: () => void; show_details?: boolean }) => {
    const [value, setValue] = React.useState('1.00');
    const [hide_parent, setHideParent] = React.useState(true);
    const [show_take_profit, setShowTakeProfit] = React.useState(true);
    const [show_stop_loss, setShowStopLoss] = React.useState(false);

    const onFocusHandler = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        (e.target as HTMLInputElement)?.focus({ preventScroll: true });
    };

    const swipe_handlers = useSwipeable({
        onSwipedDown: onClick,
    });

    const onClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div
            className='trade-param_popup_overlay'
            onClick={onClick}
            style={{ opacity: `${hide_parent ? '0' : '1'}`, pointerEvents: `${hide_parent ? 'none' : 'auto'}` }}
        >
            <CSSTransition
                appear
                classNames={{
                    appear: `trade-param_popup_container-appear`,
                    appearDone: `trade-param_popup_container-appear-done`,
                    enter: `trade-param_popup_container-enter`,
                    enterDone: `trade-param_popup_container-enter-done`,
                    exit: `trade-param_popup_container-exit`,
                }}
                in={show_details}
                timeout={300}
                unmountOnExit
                onEnter={() => setHideParent(false)}
                onExited={() => setHideParent(true)}
            >
                <div className='trade-param_popup_container' {...swipe_handlers} onClick={onClickHandler}>
                    <div className='trade-param_popup_top'>
                        <div className='footer-new_bottom-sheet_separator' />
                        <div className='trade-param_popup_title'>Risk management [IN PROGRESS]</div>
                        <div className='contract-type-info__button-wrapper trade-param_toggle-button'>
                            <ButtonToggle
                                buttons_arr={[
                                    { text: 'TP & SL', value: 'TP & SL' },
                                    { text: 'Deal cancellation', value: 'Deal cancellation' },
                                ]}
                                name='description_glossary_filter'
                                is_animated
                                has_rounded_button
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                onChange={() => {}}
                                value='TP & SL'
                            />
                        </div>
                        <div>
                            <div className='trade-param_popup_section'>
                                <div>
                                    Take profit <span className='info-icon'>i</span>
                                </div>
                                <React.Fragment>
                                    <input
                                        className={classNames('dc-toggle-switch')}
                                        id='take_profit'
                                        type='checkbox'
                                        checked={show_take_profit}
                                        onChange={() => setShowTakeProfit(!show_take_profit)}
                                    />
                                    <label className={classNames('dc-toggle-switch__label')} htmlFor='take_profit'>
                                        <span className={classNames('dc-toggle-switch__button')} />
                                    </label>
                                </React.Fragment>
                            </div>
                            {show_take_profit && (
                                <React.Fragment>
                                    <input
                                        type='number'
                                        min='0'
                                        inputMode='numeric'
                                        title='Non-negative integral number'
                                        className='trade-param_popup_input'
                                        defaultValue='1.00'
                                        onFocus={onFocusHandler as unknown as React.FocusEventHandler<HTMLInputElement>}
                                    />
                                    <div className='trade-param_popup_input_text'>Value higher than 0.10 USD</div>
                                </React.Fragment>
                            )}
                        </div>
                        <div>
                            <div className='trade-param_popup_section'>
                                <div>
                                    Stop loss <span className='info-icon'>i</span>
                                </div>
                                <React.Fragment>
                                    <input
                                        className={classNames('dc-toggle-switch')}
                                        id='stop_loss'
                                        type='checkbox'
                                        checked={show_stop_loss}
                                        onChange={() => setShowStopLoss(!show_stop_loss)}
                                    />
                                    <label className={classNames('dc-toggle-switch__label')} htmlFor='stop_loss'>
                                        <span className={classNames('dc-toggle-switch__button')} />
                                    </label>
                                </React.Fragment>
                            </div>
                            {show_stop_loss && (
                                <React.Fragment>
                                    <input
                                        type='number'
                                        min='0'
                                        inputMode='numeric'
                                        title='Non-negative integral number'
                                        className='trade-param_popup_input'
                                        defaultValue='1.00'
                                    />
                                    <div className='trade-param_popup_input_text'>Value higher than 0.10 USD</div>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    <div className='trade-param_popup_bottom'>
                        <button className='footer-new_bottom-sheet_button'>Save</button>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};

export default NewTradeParamPopup;
