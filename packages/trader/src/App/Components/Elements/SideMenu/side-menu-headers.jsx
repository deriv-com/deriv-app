import classNames         from 'classnames';
import React              from 'react';
import { withRouter }     from 'react-router-dom';
import Icon               from 'Assets/icon.jsx';
import {
    VerticalTabHeaders,
    VerticalTabHeader }   from '../VerticalTabs';

const MainHeaderLayout = ({ children }) => <div className='side-menu__main-header-layout'>{children}</div>;

const SubHeaderLayout = ({ children }) => <div className='side-menu__sub-header-layout'>{children}</div>;

const MainHeaders = ({ items, handleSubroute, active_title }) => (
    <>
        {items
            .filter(item => !item.is_hidden)
            .map(item => (
                <div key={item.title} className='side-menu'>
                    <VerticalTabHeader
                        item={item}
                        className={classNames('side-menu__header', {
                            'side-menu__header--active'  : item.title === active_title,
                            'side-menu__header--disabled': item.is_disabled,
                        })}
                        onChange={handleSubroute}
                    >
                        <Icon
                            icon='IconChevronRight'
                            className='side-menu__icon'
                        />
                    </VerticalTabHeader>
                </div>
            ))}
    </>
);

const SubHeaders = ({ items, onChange, selected, is_routed }) => (
    <VerticalTabHeaders
        items={items}
        onChange={onChange}
        selected={selected}
        is_routed={is_routed}
    />
);

class SideMenuHeaders extends React.PureComponent {
    handleSubroute = selected => {
        const { active_title, history } = this.props;

        if (selected.title !== active_title) {
            history.push(selected.subroutes[0].path);
        }
    }

    render() {
        const { active_title, onChange, selected, items, header_title, is_routed } = this.props;
        const subroutes = items.filter(item => item.title === active_title)[0].subroutes;

        return (
            <>
                <MainHeaderLayout>
                    {header_title &&
                        <div className='side-menu__heading'>
                            <h1 className='side-menu__title'>{header_title}</h1>
                        </div>
                    }
                    <MainHeaders items={items} handleSubroute={this.handleSubroute} active_title={active_title} />
                </MainHeaderLayout>
                <SubHeaderLayout>
                    <SubHeaders items={subroutes} onChange={onChange} selected={selected} is_routed={is_routed} />
                </SubHeaderLayout>
            </>
        );
    }
}

const SideMenuHeadersWithRouter = withRouter(SideMenuHeaders);

export { SideMenuHeadersWithRouter as SideMenuHeaders };
