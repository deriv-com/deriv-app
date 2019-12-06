import classNames        from 'classnames';
import React             from 'react';
import { Route, Switch } from 'react-router-dom';

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
                                if (component) {
                                    const Component = component;
                                    return (
                                        <Component key={idx} />
                                    );
                                }
                                const Icon = React.cloneElement(icon, {
                                    className: classNames(
                                        'vertical-tab__action-bar--icon', {
                                            [icon.props.className]: !!icon.props.className,
                                        }),
                                });

                                return (
                                    <div
                                        id={`dt_${id}_close_icon`}
                                        className='vertical-tab__action-bar-wrapper'
                                        key={idx}
                                        onClick={onClick}
                                    >
                                        { Icon }
                                    </div>
                                );
                                
                            })
                            
                        }
                    </div>
                }
                <div className={classNames('vertical-tab__content-container', tab_container_classname)}>
                    { is_routed ?
                        <Switch>
                            {
                                items.map(({ value, component, path, icon }, idx) => {
                                    const Component = value || component;
                                    return (
                                        <Route
                                            key={idx}
                                            path={path}
                                            render={() => <Component component_icon={icon.props.icon} />}
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
