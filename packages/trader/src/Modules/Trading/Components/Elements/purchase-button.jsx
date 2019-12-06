import classNames                 from 'classnames';
import PropTypes                  from 'prop-types';
import React                      from 'react';
import { localize }               from 'deriv-translations';
import Icon                       from 'Assets/icon.jsx';
import { getContractTypeDisplay } from 'Constants/contract';

const PurchaseButton = ({
    buy_info,
    index,
    info,
    is_disabled,
    is_high_low,
    is_loading,
    is_proposal_empty,
    purchased_states_arr,
    setPurchaseState,
    should_fade,
    onClickPurchase,
    type,
}) => {
    const getIconType = () => {
        if (!should_fade && is_loading) return '';
        return (is_high_low) ? `${type.toLowerCase()}_barrier` : type.toLowerCase();
    };
    const is_button_disabled = (is_disabled && !is_loading) || is_proposal_empty;

    return (
        <button
            disabled={is_disabled}
            id={`dt_purchase_${type.toLowerCase()}_button`}
            className={classNames(
                'btn-purchase',
                {
                    'btn-purchase--disabled'       : is_button_disabled || !!(buy_info.error),
                    'btn-purchase--animated--slide': is_loading && !should_fade,
                    'btn-purchase--animated--fade' : is_loading && should_fade,
                    'btn-purchase--swoosh'         : !!(purchased_states_arr[index]),
                    'btn-purchase--1'              : index === 0,
                    'btn-purchase--2'              : index === 1,
                })}
            onClick={() => {
                setPurchaseState(index);
                onClickPurchase(info.id, info.stake, type);
            }}
        >
            <React.Fragment>
                <div className='btn-purchase__info btn-purchase__info--left'>
                    <div className='btn-purchase__type-wrapper'>
                        <div className='btn-purchase__icon_wrapper'>
                            <Icon
                                icon='IconTradeType'
                                className='btn-purchase__icon'
                                type={getIconType()}
                            />
                        </div>
                        <div className='btn-purchase__text_wrapper'>
                            <span className='btn-purchase__text'>
                                {(!should_fade && is_loading) ? '' : localize('{{value}}', { value: getContractTypeDisplay(type, is_high_low) })}
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
        </button>
    );
};

PurchaseButton.propTypes = {
    buy_info            : PropTypes.object,
    currency            : PropTypes.string,
    index               : PropTypes.number,
    info                : PropTypes.object,
    is_disabled         : PropTypes.bool,
    is_high_low         : PropTypes.bool,
    is_loading          : PropTypes.bool,
    is_proposal_empty   : PropTypes.bool,
    onClickPurchase     : PropTypes.func,
    purchased_states_arr: PropTypes.array,
    setPurchaseState    : PropTypes.func,
    type                : PropTypes.string,
};

export default PurchaseButton;
