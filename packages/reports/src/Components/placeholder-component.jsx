import PropTypes from 'prop-types';
import React from 'react';
import Loading from '_common/components/loading.jsx';

const PlaceholderComponent = props => {
    const EmptyMessageComponent = props.empty_message_component;
    return (
        <React.Fragment>
            {props.is_empty && (
                <EmptyMessageComponent
                    component_icon={props.component_icon}
                    has_selected_date={props.has_selected_date}
                    localized_message={props.localized_message}
                    localized_period_message={props.localized_period_message}
                />
            )}
            {props.is_loading && <Loading data_testid='dt_loading_component' />}
        </React.Fragment>
    );
};

PlaceholderComponent.propTypes = {
    component_icon: PropTypes.string,
    empty_message_component: PropTypes.func,
    has_selected_date: PropTypes.bool,
    is_empty: PropTypes.bool,
    is_loading: PropTypes.bool,
    localized_message: PropTypes.string,
    localized_period_message: PropTypes.string,
};

export default PlaceholderComponent;
