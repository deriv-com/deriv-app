import PropTypes       from 'prop-types';
import React           from 'react';

const EmptyTradeHistoryMessage = ({
    has_selected_date,
    component_icon,
    localized_message,
    localized_period_message,
}) => {
    const ComponentIcon = component_icon;

    return (
        <React.Fragment>
            <div className='empty-trade-history'>
                <ComponentIcon className='empty-trade-history__icon' />
                <span className='empty-trade-history__text'>
                    {
                        !has_selected_date ?
                            localized_message
                            :
                            localized_period_message
                    }
                </span>
            </div>
        </React.Fragment>
    );
};

EmptyTradeHistoryMessage.propTypes = {
    component_icon          : PropTypes.func,
    has_selected_date       : PropTypes.bool,
    localized_message       : PropTypes.string,
    localized_period_message: PropTypes.string,
};

export default EmptyTradeHistoryMessage;
