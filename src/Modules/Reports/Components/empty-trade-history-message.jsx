import PropTypes from 'prop-types';
import React     from 'react';
import Icon      from 'Assets/icon.jsx';

const EmptyTradeHistoryMessage = ({
    has_selected_date,
    component_icon,
    localized_message,
    localized_period_message,
}) => (
    <React.Fragment>
        <div className='empty-trade-history'>
            <Icon icon={component_icon} className='empty-trade-history__icon' />
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

EmptyTradeHistoryMessage.propTypes = {
    component_icon          : PropTypes.string,
    has_selected_date       : PropTypes.bool,
    localized_message       : PropTypes.string,
    localized_period_message: PropTypes.string,
};

export default EmptyTradeHistoryMessage;
