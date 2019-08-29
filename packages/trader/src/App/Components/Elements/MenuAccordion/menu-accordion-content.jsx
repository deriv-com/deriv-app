import classNames                  from 'classnames';
import React                       from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Icon                        from 'Assets/icon.jsx';
import routes                      from 'Constants/routes';

class MenuAccordionContent extends React.PureComponent {
    render() {
        const {
            action_bar,
            action_bar_classname,
            id,
            is_routed,
            items,
            selected,
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
                            action_bar.map(({ component, icon, onClick, title }) => {
                                const Component = component;
                                return (
                                    component ?
                                        <Component key={title} />
                                        :
                                        <div
                                            id={`dt_${id}_close_icon`}
                                            className='vertical-tab__action-bar-wrapper'
                                            key={title}
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
                { is_routed ?
                    <Switch>
                        <Redirect exact from={routes.reports} to={routes.positions} />
                        {
                            items.map(({ value, path, icon }) => {
                                const Component = value;
                                return (
                                    <Route
                                        key={path}
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
        );
    }
}

export { MenuAccordionContent };
