import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

class Accordion extends React.Component {
    state = {
        open_idx: null,
    };

    componentDidUpdate(prevProps) {
        if (this.props.list !== prevProps.list) {
            this.setState({ open_idx: null });
        }
    }

    onClick(index) {
        // close if clicking the accordion that's open, otherwise open the new one
        this.setState({ open_idx: index === this.state.open_idx ? null : index });
    }

    render() {
        const { list, className } = this.props;

        return (
            <div className={classNames('dc-accordion__wrapper', className)}>
                {list.map((item, idx) => (
                    <div
                        className={classNames(
                            'dc-accordion__item',
                            `dc-accordion__item--${this.state.open_idx === idx ? 'open' : 'close'}`,
                            {
                                [`dc-accordion__item--${idx === 0 ? 'first' : 'last'}`]:
                                    idx === 0 || idx === list.length - 1,
                            }
                        )}
                        key={idx}
                    >
                        <div
                            className='dc-accordion__item-header'
                            onClick={() => {
                                this.onClick(idx);
                            }}
                        >
                            {item.header}
                            <div className='dc-accordion__item-header-icon-wrapper'>
                                {this.state.open_idx === idx ? (
                                    <Icon icon='IcMinus' className='dc-accordion__item-header-icon' />
                                ) : (
                                    <Icon icon='IcAdd' className='dc-accordion__item-header-icon' />
                                )}
                            </div>
                        </div>
                        <div className='dc-accordion__item-content'>{item.content}</div>
                    </div>
                ))}
            </div>
        );
    }
}

Accordion.propTypes = {
    className: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.object),
};

export default Accordion;
