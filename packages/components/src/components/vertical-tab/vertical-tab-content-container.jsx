import classNames from 'classnames';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Icon from 'Components/icon';

export default class VerticalTabContentContainer extends React.PureComponent {
    render() {
        const {
            action_bar,
            action_bar_classname,
            id,
            is_routed,
            items,
            selected,
            tab_container_classname,
        } = this.props;
        const selected_item = items.find(item => item.label === selected.label);
        const TabContent = selected_item.value;

        return (
            <div className='dc-vertical-tab__content'>
                {action_bar && (
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
                    {is_routed ? (
                        <Switch>
                            {items.map(({ value, component, path, icon }, idx) => {
                                const Component = value || component;
                                return (
                                    <Route key={idx} path={path} render={() => <Component component_icon={icon} />} />
                                );
                            })}
                        </Switch>
                    ) : (
                        <TabContent key={selected_item.label} className='item-id' />
                    )}
                </div>
            </div>
        );
    }
}
