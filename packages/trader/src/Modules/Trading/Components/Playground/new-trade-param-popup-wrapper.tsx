import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { ButtonToggle } from '@deriv/components';
import { useSwipeable } from 'react-swipeable';
import { CSSTransition } from 'react-transition-group';
// import WheelPicker from './Wheel-picker/wheel-picker';
import Picker from './Wheel-picker-2/wheek-picker';

const NewTradeParamPopupWrapper = ({
    onClick,
    show_details,
    is_risk_management,
    is_stake,
    is_multiplier,
    is_portal,
    valueGroups,
    optionGroups,
    setValueGroups,
}: {
    onClick: () => void;
    show_details?: boolean;
    is_risk_management?: boolean;
    is_stake?: boolean;
    is_multiplier?: boolean;
    is_portal?: boolean;
    valueGroups: any;
    optionGroups: any;
    setValueGroups: any;
}) => {
    const [hide_parent, setHideParent] = React.useState(true);
    const [show_take_profit, setShowTakeProfit] = React.useState(true);
    const [show_stop_loss, setShowStopLoss] = React.useState(false);
    const input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    React.useEffect(() => {
        return () => clearTimeout(focus_timeout.current);
    }, []);

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

    React.useEffect(() => {
        if (show_details) setHideParent(false);
        if (!show_details) setTimeout(() => setHideParent(true), 300);
    }, [show_details]);

    const content = (
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
                onEnter={() => (focus_timeout.current = setTimeout(() => input_ref?.current?.focus(), 100))}
                // onEntered={() => input_ref?.current?.focus({ focusVisible: true })}
                // onExited={() => setHideParent(true)}
            >
                <div
                    className={classNames('trade-param_popup_container', {
                        'trade-param_popup_container--risk': is_risk_management,
                        'trade-param_popup_container--stake': is_stake,
                        'trade-param_popup_container--is_multiplier': is_multiplier,
                    })}
                    onClick={onClickHandler}
                >
                    <div className='trade-param_popup_top'>
                        <div className='footer-new_bottom-sheet_separator' {...swipe_handlers} />
                        {is_risk_management && (
                            <React.Fragment>
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
                                    <div
                                        className='trade-param_popup_section'
                                        style={{ marginBottom: `${show_take_profit ? '0.8rem' : '1.6rem'}` }}
                                    >
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
                                            <label
                                                className={classNames('dc-toggle-switch__label')}
                                                htmlFor='take_profit'
                                            >
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
                                                onFocus={
                                                    onFocusHandler as unknown as React.FocusEventHandler<HTMLInputElement>
                                                }
                                            />
                                            <div className='trade-param_popup_input_text'>
                                                Value higher than 0.10 USD
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                                <div>
                                    <div
                                        className='trade-param_popup_section'
                                        style={{ marginBottom: `${show_stop_loss ? '0.8rem' : '1.6rem'}` }}
                                    >
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
                                            <label
                                                className={classNames('dc-toggle-switch__label')}
                                                htmlFor='stop_loss'
                                            >
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
                                            <div className='trade-param_popup_input_text'>
                                                Value higher than 0.10 USD
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                            </React.Fragment>
                        )}
                        {is_stake && (
                            <React.Fragment>
                                <div className='trade-param_popup_title' style={{ height: '6.4rem' }}>
                                    Stake <span className='info-icon'>i</span>
                                </div>
                                <div style={{ marginTop: '1.6rem' }}>
                                    <React.Fragment>
                                        <input
                                            type='number'
                                            min='0'
                                            inputMode='numeric'
                                            title='Non-negative integral number'
                                            className='trade-param_popup_input'
                                            defaultValue='10.00'
                                            // autoFocus={should_focus}
                                            ref={input_ref}
                                        />
                                        <div className='trade-param_popup_input_text'>
                                            Acceptable range: 1.00 - 2,000.00 USD
                                        </div>
                                    </React.Fragment>
                                </div>
                            </React.Fragment>
                        )}
                        {is_multiplier && (
                            <React.Fragment>
                                <div className='trade-param_popup_title' style={{ height: '6.4rem' }}>
                                    Multipliers <span className='info-icon'>i</span>
                                </div>
                                <p style={{ fontSize: '16px', lineHeight: '24px', textAlign: 'center' }}>
                                    Multiply your potential profit
                                </p>
                                {/* <WheelPicker
                                    // @ts-expect-error library has no types
                                    animation='flat'
                                    data={multipliers}
                                    height={40}
                                    parentHeight={200}
                                    fontSize={16}
                                    defaultSelection={selected_multiplier}
                                    updateSelection={(index: number) => {
                                        setSelectedMultiplier(index);
                                        setMultiplier(index);
                                    }}
                                    scrollerId='scroll-select-subject'
                                /> */}
                                <Picker
                                    optionGroups={optionGroups}
                                    valueGroups={valueGroups}
                                    onChange={(name: string, value: string) => setValueGroups({ [name]: value })}
                                    itemHeight={40}
                                />
                                <div className='trade-param_popup_tooltip-container'>
                                    <div className='trade-param_popup_tooltip-text'>Commission: 0.10 USD</div>
                                    <div className='trade-param_popup_tooltip-text'>Stop out: 10.00 USD</div>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                    <div className='trade-param_popup_bottom' style={{ width: '100%' }}>
                        <button className='footer-new_bottom-sheet_button'>Save</button>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
    if (is_portal) {
        return ReactDOM.createPortal(content, document.getElementById('modal_root') as HTMLElement);
    }
    return content;
};

export default React.memo(NewTradeParamPopupWrapper);
