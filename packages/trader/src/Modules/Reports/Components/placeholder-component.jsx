import PropTypes from 'prop-types';
import React     from 'react';
import Loading   from '../../../templates/_common/components/loading.jsx';

const PlaceholderComponent = (props) => {
    const EmptyMessageComponent = props.empty_message_component;
    return (
        <React.Fragment>
            { props.is_empty &&
            <EmptyMessageComponent
                component_icon={props.component_icon}
                has_selected_date={props.has_selected_date}
                localized_message={props.localized_message}
            />
            }
            {props.is_loading && <Loading />}
        </React.Fragment>
    );
};

PlaceholderComponent.propTypes = {
    component_icon         : PropTypes.string,
    empty_message_component: PropTypes.func,
    has_selected_date      : PropTypes.bool,
    localized_message      : PropTypes.string,
};

export default PlaceholderComponent;
