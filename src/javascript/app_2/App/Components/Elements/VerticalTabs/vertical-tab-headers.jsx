import classNames from 'classnames';
import React      from 'react';

class VerticalTabHeaders extends React.PureComponent {
    render() {
        return (
            <div className='vertical-tab__tab'>
                {this.props.items.map(item => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            className={
                                classNames('vertical-tab__header', {
                                    'vertical-tab__header--active': this.props.selected.label === item.label,
                                })
                            }
                            key={item.label}
                            onClick={() => this.props.onChange(item)}
                        >
                            <IconComponent className={classNames('vertical-tab__header__icon', {
                                'vertical-tab__header__icon--active': this.props.selected.label === item.label,
                            })}
                            />
                            <a
                                key={item.label}
                                className='vertical-tab__header__link'
                            >
                                {item.label}
                            </a>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export { VerticalTabHeaders };
