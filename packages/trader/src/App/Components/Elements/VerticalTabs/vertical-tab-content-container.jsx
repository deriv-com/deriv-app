import classNames                  from 'classnames';
import React                       from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Icon                        from 'Assets/icon.jsx';
import routes                      from 'Constants/routes';

class VerticalTabContentContainer extends React.PureComponent {
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
        const TabContent    = selected_item.value;

        return (
            <div className='vertical-tab__content'>
                { action_bar &&
                    <div className={classNames('vertical-tab__action-bar', {
                        [action_bar_classname]: !!action_bar_classname,
                    })}
                    >
                        {
                            action_bar.map(({ component, icon, onClick }, idx) => {
                                const Component = component;
                                return (
                                    component ?
                                        <Component key={idx} />
                                        :
                                        <div
                                            id={`dt_${id}_close_icon`}
                                            className='vertical-tab__action-bar-wrapper'
                                            key={idx}
                                            onClick={onClick}
                                        >
                                            <Icon
                                                className='vertical-tab__action-bar--icon'
                                                icon={icon}
                                            />
                                        </div>
                                );
                            })
                        }
                    </div>
                }
                <div className={classNames('vertical-tab__content-container', tab_container_classname)}>
                    { is_routed ?
                        <Switch>
                            <Redirect exact from={routes.reports} to={routes.positions} />
                            {
                                items.map(({ value, component, path, icon }, idx) => {
                                    const Component = value || component;
                                    return (
                                        <Route
                                            key={idx}
                                            path={path}
                                            render={() => <Component component_icon={icon} />}
                                        />
                                    );
                                })
                            }
                        </Switch>
                        :
                        <TabContent
                            key={selected_item.label}
                            className='item-id'
                        />
                    }
                </div>
            </div>
        );
    }
}

export { VerticalTabContentContainer };
