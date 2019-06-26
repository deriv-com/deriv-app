import React                       from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Icon                        from 'Assets/icon.jsx';
import routes                      from 'Constants/routes';

class VerticalTabContentContainer extends React.PureComponent {
    render() {
        const {
            action_bar,
            is_routed,
            items,
            selected,
        } = this.props;
        const selected_item = items.find(item => item.label === selected.label);
        const TabContent    = selected_item.value;

        return (
            <div className='vertical-tab__content'>
                { action_bar &&
                    <div className='vertical-tab__action-bar'>
                        {
                            action_bar.map(({ icon, onClick, title }) => (
                                <Icon className='vertical-tab__action-bar--icon' key={title} icon={icon} onClick={onClick} />
                            ))
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

export { VerticalTabContentContainer };
