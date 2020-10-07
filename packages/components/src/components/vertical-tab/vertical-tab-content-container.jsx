import classNames from 'classnames';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Icon from '../icon/icon.jsx';

const Content = ({ is_routed, items, selected }) => {
    const selected_item = items.find(item => item.label === selected.label);
    const TabContent = selected_item.value;

    const [side_notes, setSideNotes] = React.useState(null);

    React.useEffect(() => {
        setSideNotes(null);
    }, [selected_item]);

    return (
        <React.Fragment>
            {is_routed ? (
                <Switch>
                    {items.map(({ value, component, path, icon }, idx) => {
                        const Component = value || component;
                        return (
                            <Route
                                key={idx}
                                path={path}
                                render={() => <Component component_icon={icon} setSideNotes={setSideNotes} />}
                            />
                        );
                    })}
                </Switch>
            ) : (
                <TabContent key={selected_item.label} className='item-id' setSideNotes={setSideNotes} />
            )}
            {selected.has_side_note && (
                // for components that have side note, even if no note is passed currently,
                // we want to keep the column space for side note
                <div className='dc-vertical-tab__content-side-note'>
                    {side_notes?.map((note, i) => (
                        <div className='dc-vertical-tab__content-side-note-wrapper' key={i}>
                            {note}
                        </div>
                    ))}
                </div>
            )}
        </React.Fragment>
    );
};

export default class VerticalTabContentContainer extends React.PureComponent {
    render() {
        const {
            action_bar,
            action_bar_classname,
            id,
            is_floating,
            is_routed,
            items,
            selected,
            tab_container_classname,
        } = this.props;

        return (
            <div
                className={classNames('dc-vertical-tab__content', {
                    'dc-vertical-tab__content--floating': is_floating,
                })}
            >
                {!is_floating && action_bar && (
                    <div
                        className={classNames('dc-vertical-tab__action-bar', {
                            [action_bar_classname]: !!action_bar_classname,
                        })}
                    >
                        {action_bar.map(({ component, icon, onClick }, idx) => {
                            const Component = component;
                            return component ? (
                                <Component key={idx} />
                            ) : (
                                <div
                                    id={`dt_${id}_close_icon`}
                                    className='dc-vertical-tab__action-bar-wrapper'
                                    key={idx}
                                    onClick={onClick}
                                >
                                    <Icon className='dc-vertical-tab__action-bar--icon' icon={icon} />
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className={classNames('dc-vertical-tab__content-container', tab_container_classname)}>
                    {selected.has_side_note ? (
                        <div className='dc-vertical-tab__content-inner'>
                            <Content is_routed={is_routed} items={items} selected={selected} />
                        </div>
                    ) : (
                        <Content is_routed={is_routed} items={items} selected={selected} />
                    )}
                </div>
            </div>
        );
    }
}
