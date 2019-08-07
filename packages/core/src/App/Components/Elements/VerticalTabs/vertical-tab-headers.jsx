import classNames  from 'classnames';
import React       from 'react';
import { NavLink } from 'react-router-dom';
import Icon        from 'Assets/icon.jsx';

class VerticalTabHeaders extends React.PureComponent {
    render() {
        return (
            <div className='vertical-tab__tab'>
                {this.props.header_title &&
                    <div className='vertical-tab__header-title'>
                        <p>{ this.props.header_title }</p>
                    </div>
                }

                {this.props.items.map(item => {
                    // Capitalize only the first letter of the label and make the rest lowercase
                    const label = item.label.charAt(0).toUpperCase() + item.label.slice(1).toLowerCase();

                    return (
                        this.props.is_routed ?
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => this.props.onChange(item)}
                                className='vertical-tab__header'
                                activeClassName={
                                    classNames({
                                        'vertical-tab__header--active': this.props.selected.label === item.label,
                                    })
                                }
                            >
                                <Icon
                                    icon={item.icon}
                                    className={classNames('vertical-tab__header__icon', {
                                        'vertical-tab__header__icon--active': this.props.selected.label === item.label,
                                    })}
                                />
                                <span className='vertical-tab__header__link'>{label}</span>
                            </NavLink>
                            :
                            <div
                                className={
                                    classNames('vertical-tab__header', {
                                        'vertical-tab__header--active': this.props.selected.label === item.label,
                                    })
                                }
                                key={item.label}
                                onClick={() => this.props.onChange(item)}
                            >
                                <Icon
                                    icon={item.icon}
                                    className={classNames('vertical-tab__header__icon', {
                                        'vertical-tab__header__icon--active': this.props.selected.label === item.label,
                                    })}
                                />
                                <a
                                    key={item.label}
                                    className='vertical-tab__header__link'
                                >
                                    {label}
                                </a>
                            </div>
                    );
                })}
            </div>
        );
    }
}

export { VerticalTabHeaders };
