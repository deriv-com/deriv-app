import React from 'react';
import Loading from '_common/components/loading';

type TPlaceholderComponent = {
    component_icon?: string;
    empty_message_component?: React.ElementType;
    has_selected_date?: boolean;
    is_empty?: boolean;
    is_loading?: boolean;
    localized_message?: React.ReactNode;
    localized_period_message?: React.ReactNode;
};

const PlaceholderComponent = ({
    component_icon,
    empty_message_component,
    has_selected_date,
    is_empty,
    is_loading,
    localized_message,
    localized_period_message,
}: TPlaceholderComponent) => {
    const EmptyMessageComponent = empty_message_component;
    return (
        <React.Fragment>
            {is_empty && EmptyMessageComponent && (
                <EmptyMessageComponent
                    component_icon={component_icon}
                    has_selected_date={has_selected_date}
                    localized_message={localized_message}
                    localized_period_message={localized_period_message}
                />
            )}
            {is_loading && <Loading data_testid='dt_loading_component' />}
        </React.Fragment>
    );
};

export default PlaceholderComponent;
