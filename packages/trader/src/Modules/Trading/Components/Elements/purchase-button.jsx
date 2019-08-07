import classNames                 from 'classnames';
import PropTypes                  from 'prop-types';
import React                      from 'react';
import { Button }                 from 'deriv-components';
import { localize }               from 'App/i18n';
import Icon                       from 'Assets/icon.jsx';
import { getContractTypeDisplay } from 'Constants/contract';
import { memoize }                from 'Utils/React/memoize';

const memoizedGetContractTypeDisplay = memoize(getContractTypeDisplay);

const PurchaseButton = ({
    buy_info,
    icon_type,
    index,
    info,
    is_contract_mode,
    is_disabled,
    is_high_low,
    is_loading,
    is_proposal_empty,
    purchased_states_arr,
    should_fade,
    type,
    buttonOnClick,
}) => {
    const is_button_disabled = ((is_contract_mode || is_disabled) && !is_loading) || is_proposal_empty;

    return (
        <Button
            is_disabled={is_contract_mode || is_disabled}
            id={`dt_purchase_${type.toLowerCase()}_button`}
            className={classNames(
                'btn-purchase',
                {
                    'btn-purchase--disabled'       : is_button_disabled || !!(buy_info.error),
                    'btn-purchase--animated--slide': is_loading && !should_fade,
                    'btn-purchase--animated--fade' : is_loading && should_fade,
                    'btn-purchase--swoosh'         : !!(purchased_states_arr[index]),
                })}
            onClick={buttonOnClick}
        >
            <React.Fragment>
                <div className='btn-purchase__info btn-purchase__info--left'>
                    <div className='btn-purchase__type-wrapper'>
                        <div className='btn-purchase__icon_wrapper'>
                            <Icon
                                icon='IconTradeType'
                                className='btn-purchase__icon'
                                type={icon_type}
                            />
                        </div>
                        <div className='btn-purchase__text_wrapper'>
                            <span className='btn-purchase__text'>
                                {(!should_fade && is_loading) ? '' : localize('{{value}}', { value: memoizedGetContractTypeDisplay(type, is_high_low) })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='btn-purchase__effect-detail' />
                <div className='btn-purchase__effect-detail--arrow' />
                <div className='btn-purchase__info btn-purchase__info--right'>
                    <div className='btn-purchase__text_wrapper'>
                        <span className='btn-purchase__text'>{!(is_loading || is_disabled) ? info.returns : ''}</span>
                    </div>
                </div>
            </React.Fragment>
        </Button>
    );
};

PurchaseButton.propTypes = {
    buttonOnClick       : PropTypes.func,
    buy_info            : PropTypes.object,
    currency            : PropTypes.string,
    icon_type           : PropTypes.string,
    index               : PropTypes.number,
    info                : PropTypes.object,
    is_contract_mode    : PropTypes.bool,
    is_disabled         : PropTypes.bool,
    is_high_low         : PropTypes.bool,
    is_loading          : PropTypes.bool,
    is_proposal_empty   : PropTypes.bool,
    purchased_states_arr: PropTypes.array,
    type                : PropTypes.string,
};

export default React.memo(PurchaseButton);
