import React from 'react';
import classNames from 'classnames';
import { getDecimalPlaces } from '@deriv/shared';
import { ButtonToggle, InputField } from '@deriv/components';
// import { CSSTransition } from 'react-transition-group';

const NewTradeParamPopup = ({ onClick, show_details }: { onClick: () => void; show_details?: boolean }) => {
    const [value, setValue] = React.useState('1.00');
    const onFocusHandler = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        (e.target as HTMLInputElement)?.focus({ preventScroll: true });
    };
    const onClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        // setShouldExpand(true);
    };

    return (
        <div className='trade-param_popup_overlay' onClick={onClick}>
            <div onClick={onClickHandler} className='trade-param_popup_container'>
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
                            <div>Take profit </div>
                            <React.Fragment>
                                <input
                                    className={classNames('dc-toggle-switch')}
                                    id='123'
                                    type='checkbox'
                                    checked={true}
                                    // onChange={handleToggle}
                                />
                                <label className={classNames('dc-toggle-switch__label')} htmlFor='123'>
                                    <span className={classNames('dc-toggle-switch__button')} />
                                </label>
                            </React.Fragment>
                        </div>
                        <input
                            type='number'
                            min='0'
                            inputMode='numeric'
                            // pattern='[0-9]*'
                            title='Non-negative integral number'
                            className='trade-param_popup_input'
                            defaultValue='1.00'
                            onFocus={onFocusHandler as unknown as React.FocusEventHandler<HTMLInputElement>}
                        />
                        <div className='trade-param_popup_input_text'>Value higher than 0.10 USD</div>
                    </div>
                    <div>
                        <div className='trade-param_popup_section'>
                            <div>Stop loss</div>
                            <React.Fragment>
                                <input
                                    className={classNames('dc-toggle-switch')}
                                    id='123'
                                    type='checkbox'
                                    checked={true}
                                    // onChange={handleToggle}
                                />
                                <label className={classNames('dc-toggle-switch__label')} htmlFor='123'>
                                    <span className={classNames('dc-toggle-switch__button')} />
                                </label>
                            </React.Fragment>
                        </div>
                        <input
                            type='number'
                            min='0'
                            inputMode='numeric'
                            // pattern='[0-9]*'
                            title='Non-negative integral number'
                            className='trade-param_popup_input'
                            defaultValue='1.00'
                        />
                        <div className='trade-param_popup_input_text'>Value higher than 0.10 USD</div>
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
