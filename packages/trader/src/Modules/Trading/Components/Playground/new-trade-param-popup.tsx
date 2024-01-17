import React from 'react';
import classNames from 'classnames';
import { getDecimalPlaces } from '@deriv/shared';
import { ButtonToggle, InputField } from '@deriv/components';
// import { CSSTransition } from 'react-transition-group';

const NewTradeParamPopup = ({ onClick, show_details }: { onClick: () => void; show_details?: boolean }) => {
    const [value, setValue] = React.useState('1.00');

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
                        {/* <input
                            type='number'
                            min='0'
                            inputMode='numeric'
                            // pattern='[0-9]*'
                            title='Non-negative integral number'
                            className='trade-param_popup_input'
                            defaultValue='1.00'
                        /> */}
                        {/* <div>Take profit</div> */}
                        <InputField
                            // className={className}
                            // classNameInlinePrefix={classNameInlinePrefix}
                            // classNameInput={classNameInput}
                            currency='USD'
                            current_focus={null}
                            // error_messages={error_messages}
                            // error_message_alignment={error_message_alignment}
                            // is_error_tooltip_hidden={isMobile()}
                            // is_disabled={!!is_disabled}
                            fractional_digits={getDecimalPlaces('USD')}
                            id={`dc_take_profit_input`}
                            // inline_prefix={is_single_currency ? currency : undefined}
                            is_autocomplete_disabled
                            is_float={getDecimalPlaces('USD') > 0}
                            is_hj_whitelisted
                            is_incrementable
                            is_negative_disabled={true}
                            max_length={10}
                            // max_value={max_value}
                            name={'take_profit'}
                            // onChange={onChange}
                            // onClickInputWrapper={is_disabled ? undefined : enableInputOnClick}
                            type='number'
                            ariaLabel=''
                            inputmode='decimal'
                            value={value}
                            // setCurrentFocus={setCurrentFocus}
                        />
                        <div className='trade-param_popup_input_text'>Value higher than 0.10 USD</div>
                    </div>
                    <div>
                        {/* <input
                            type='number'
                            min='0'
                            inputMode='numeric'
                            // pattern='[0-9]*'
                            title='Non-negative integral number'
                            className='trade-param_popup_input'
                            defaultValue='1.00'
                        /> */}
                        {/* <div>Take profit</div> */}
                        <InputField
                            // className={className}
                            // classNameInlinePrefix={classNameInlinePrefix}
                            // classNameInput={classNameInput}
                            currency='USD'
                            current_focus={null}
                            // error_messages={error_messages}
                            // error_message_alignment={error_message_alignment}
                            // is_error_tooltip_hidden={isMobile()}
                            // is_disabled={!!is_disabled}
                            fractional_digits={getDecimalPlaces('USD')}
                            id={`dc_take_profit_input`}
                            // inline_prefix={is_single_currency ? currency : undefined}
                            is_autocomplete_disabled
                            is_float={getDecimalPlaces('USD') > 0}
                            is_hj_whitelisted
                            is_incrementable
                            is_negative_disabled={true}
                            max_length={10}
                            // max_value={max_value}
                            name={'take_profit'}
                            // onChange={onChange}
                            // onClickInputWrapper={is_disabled ? undefined : enableInputOnClick}
                            type='number'
                            ariaLabel=''
                            inputmode='decimal'
                            value={value}
                            // setCurrentFocus={setCurrentFocus}
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
