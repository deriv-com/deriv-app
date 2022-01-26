import React from 'react';
import Loading from '../../../templates/_common/components/loading';

type PlaceholderComponentProps = {
    component_icon: string;
    empty_message_component: () => void;
    has_selected_date: boolean;
    localized_message: string;
};

const PlaceholderComponent = (props: PlaceholderComponentProps) => {
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
            {props.is_loading && <Loading />}
        </React.Fragment>
    );
};

export default PlaceholderComponent;
