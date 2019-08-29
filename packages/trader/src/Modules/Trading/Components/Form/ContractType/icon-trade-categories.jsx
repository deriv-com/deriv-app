import classNames            from 'classnames';
import PropTypes             from 'prop-types';
import React                 from 'react';
import Icon                  from 'Assets/icon.jsx';
import { IconTradeTypesMap } from '../../../Helpers/trade-types';

const IconTradeCategory = ({ className, is_high_low, trade_types }) => {
    let [type1, type2] = Object.values(trade_types).map(type => type.toLowerCase());

    if (is_high_low) {
        type1 = `${type1}_barrier`
        type2 = `${type2}_barrier`
    }

    return (
        <div className={classNames('categories-container', className)}>
            {type1 &&
                <div className='category-wrapper'>
                    <Icon
                        className='category-type'
                        icon={IconTradeTypesMap[type1]}
                    />
                </div>
            }
            {type2 &&
                <div className='category-wrapper'>
                    <Icon
                        className='category-type'
                        icon={IconTradeTypesMap[type2]}
                    />
                </div>
            }
        </div>
    );
};

IconTradeCategory.propTypes = {
    className  : PropTypes.string,
    is_high_low: PropTypes.bool,
    trade_types: PropTypes.array,
};

export default IconTradeCategory;
