import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';

const IconTradeCategory = ({ category, className }) => {
    let IconCategory;
    if (category) {
        switch (category) {
            case 'rise_fall':
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
            case 'rise_fall_equal':
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
            case 'high_low':
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
            case 'end':
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
            case 'stay':
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
            case 'match_diff':
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
            case 'even_odd':
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
            case 'over_under':
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
            case 'touch':
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
            case 'asian':
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
            case 'lb_call':
                IconCategory = (
                    <div className='category-wrapper'>
                        <Icon icon='IcTradetypeLbcall' className='category-type' color='brand' />
                    </div>
                );
                break;
            case 'lb_put':
                IconCategory = (
                    <div className='category-wrapper'>
                        <Icon icon='IcTradetypeLbput' className='category-type' color='brand' />
                    </div>
                );
                break;
            case 'lb_high_low':
                IconCategory = (
                    <div className='category-wrapper'>
                        <Icon icon='IcTradetypeLbhighlow' className='category-type' color='brand' />
                    </div>
                );
                break;
            case 'run_high_low':
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
            case 'reset':
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
            case 'tick_high_low':
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
            case 'callputspread':
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
            case 'multiplier':
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
            case 'vanilla':
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
    return <div className={classNames('categories-container', className)}>{IconCategory}</div>;
};

IconTradeCategory.propTypes = {
    category: PropTypes.string,
    className: PropTypes.string,
};

export default IconTradeCategory;
