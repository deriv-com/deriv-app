import classNames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import { TRADE_TYPES } from '@deriv/shared';

type TIconTradeCategory = {
    category: string;
    className?: string;
};

const IconTradeCategory = ({ category, className }: TIconTradeCategory) => {
    let IconCategory;
    if (category) {
        switch (category) {
            case TRADE_TYPES.RISE_FALL:
            case TRADE_TYPES.RISE_FALL_EQUAL:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeCall' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypePut' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.HIGH_LOW:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeCallBarrier' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypePutBarrier' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.END:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeExpirymiss' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeExpiryrange' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.STAY:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeRange' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeUpordown' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.MATCH_DIFF:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeDigitmatch' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeDigitdiff' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.EVEN_ODD:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeDigiteven' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeDigitodd' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.OVER_UNDER:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeDigitover' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeDigitunder' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.TOUCH:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeOnetouch' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeNotouch' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.ASIAN:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeAsianu' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeAsiand' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.LB_CALL:
                IconCategory = (
                    <div className='category-wrapper'>
                        <Icon icon='IcTradetypeLbcall' className='category-type' color='brand' />
                    </div>
                );
                break;
            case TRADE_TYPES.LB_PUT:
                IconCategory = (
                    <div className='category-wrapper'>
                        <Icon icon='IcTradetypeLbput' className='category-type' color='brand' />
                    </div>
                );
                break;
            case TRADE_TYPES.LB_HIGH_LOW:
                IconCategory = (
                    <div className='category-wrapper'>
                        <Icon icon='IcTradetypeLbhighlow' className='category-type' color='brand' />
                    </div>
                );
                break;
            case TRADE_TYPES.RUN_HIGH_LOW:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeRunhigh' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeRunlow' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.RESET:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeResetcall' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeResetput' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.TICK_HIGH_LOW:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeTickhigh' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeTicklow' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.CALL_PUT_SPREAD:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeCallspread' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypePutspread' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.MULTIPLIER:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeMultup' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeMultdown' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.ACCUMULATOR:
                IconCategory = (
                    <div className='category-wrapper'>
                        <Icon icon='IcTradetypeAccu' className='category-type' color='brand' />
                    </div>
                );
                break;
            case TRADE_TYPES.TURBOS.LONG:
            case TRADE_TYPES.TURBOS.SHORT:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeTurboslong' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeTurbosshort' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            case TRADE_TYPES.VANILLA.CALL:
            case TRADE_TYPES.VANILLA.PUT:
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeVanillaLongCall' className='category-type' color='brand' />
                        </div>
                        <div className='category-wrapper'>
                            <Icon icon='IcTradetypeVanillaLongPut' className='category-type' color='brand' />
                        </div>
                    </React.Fragment>
                );
                break;
            default:
                IconCategory = (
                    <div className='category-wrapper'>
                        <Icon icon='IcUnknown' className='category-type' color='brand' />
                    </div>
                );
                break;
        }
    }
    return (
        <div className={classNames('categories-container', className)} data-testid='dt-categories-container'>
            {IconCategory}
        </div>
    );
};

export default IconTradeCategory;
