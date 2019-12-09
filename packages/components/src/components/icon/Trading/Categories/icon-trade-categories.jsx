import classNames    from 'classnames';
import PropTypes     from 'prop-types';
import React         from 'react';
import IconTradeType from 'Assets/Trading/Types/icon-trade-types.jsx';

const IconTradeCategory = ({ category, className }) => {
    let IconCategory;
    if (category) {
        switch (category) {
            case 'rise_fall':
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='call'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='put'
                            />
                        </div>
                    </React.Fragment>
                );
                break;
            case 'rise_fall_equal':
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='calle'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                
                                className='category-type'
                                type='pute'
                            />
                        </div>
                    </React.Fragment>
                );
                break;
            case 'high_low':
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='call_barrier'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='put_barrier'
                            />
                        </div>
                    </React.Fragment>
                );
                break;
            case 'end':
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='expirymiss'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='expiryrange'
                            />
                        </div>
                    </React.Fragment>
                );
                break;
            case 'stay':
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='range'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='upordown'
                            />
                        </div>
                    </React.Fragment>
                );
                break;
            case 'match_diff':
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digitmatch'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digitdiff'
                            />
                        </div>
                    </React.Fragment>
                );
                break;
            case 'even_odd':
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digiteven'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digitodd'
                            />
                        </div>
                    </React.Fragment>
                );
                break;
            case 'over_under':
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digitover'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digitunder'
                            />
                        </div>
                    </React.Fragment>
                );
                break;
            case 'touch':
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='onetouch'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='notouch'
                            />
                        </div>
                    </React.Fragment>
                );
                break;
            case 'asian':
                IconCategory = (
                    <React.Fragment>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='asianu'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='asiand'
                            />
                        </div>
                    </React.Fragment>
                );
                break;
            case 'lb_call':
                IconCategory = (
                    <div className='category-wrapper'>
                        <IconTradeType
                            className='category-type'
                            type='lbfloatcall'
                        />
                    </div>
                );
                break;
            case 'lb_put':
                IconCategory = (
                    <div className='category-wrapper'>
                        <IconTradeType
                            className='category-type'
                            type='lbfloatput'
                        />
                    </div>
                );
                break;
            case 'lb_high_low':
                IconCategory = (
                    <div className='category-wrapper'>
                        <IconTradeType
                            className='category-type'
                            type='lbhighlow'
                        />
                    </div>
                );
                break;
            default:
                IconCategory = (
                    <div className='category-wrapper'>
                        <IconTradeType
                            className='category-type'
                            type='unknown'
                        />
                    </div>
                );
                break;
        }
    }
    return (
        <div className={classNames('categories-container', className)}>
            {IconCategory}
        </div>
    );
};

IconTradeCategory.propTypes = {
    category : PropTypes.string,
    className: PropTypes.string,
};

export default IconTradeCategory;
