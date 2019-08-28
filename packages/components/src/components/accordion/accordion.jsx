import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import './accordion.scss';

// TODO: use-from-shared - Use this icon from icons' shared package
const IconExpand = () => (
    <svg width='16px' height='16px' viewBox='0 0 16 16'>
        <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
            <path d='M8,2 C8.55228475,2 9,2.44771525 9,3 L9,7 L13,7 C13.5522847,7 14,7.44771525 14,8 C14,8.55228475 13.5522847,9 13,9 L9,9 L9,13 C9,13.5522847 8.55228475,14 8,14 C7.44771525,14 7,13.5522847 7,13 L7,9 L3,9 C2.44771525,9 2,8.55228475 2,8 C2,7.44771525 2.44771525,7 3,7 L7,7 L7,3 C7,2.44771525 7.44771525,2 8,2 Z' fill='#333333' />
        </g>
    </svg>
);

// TODO: use-from-shared - Use this icon from icons' shared package
const IconCollapse = () => (
    <svg width='16px' height='16px' viewBox='0 0 16 16'>
        <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
            <rect fill='#333333' x='2' y='7' width='12' height='2' rx='1' />
        </g>
    </svg>
);

class Accordion extends React.Component {
    state = {
        open_idx: null,
    };

    onClick(index) {
        // close if clicking the accordion that's open, otherwise open the new one
        this.setState({ open_idx: index === this.state.open_idx ? null : index });
    }

    render() {
        const {
            list,
            className,
        } = this.props;

        return (
            <div className={classNames('dc-accordion__wrapper', className)}>
                {list.map((item, idx) => (
                    <div
                        className={classNames('dc-accordion__item', `dc-accordion__item--${this.state.open_idx === idx ? 'open' : 'close'}`, { [`dc-accordion__item--${item.className}`]: item.className })}
                        key={idx}
                    >
                        <div className='dc-accordion__item-header' onClick={() => { this.onClick(idx); }}>
                            {item.header}
                            <div className='dc-accordion__item-header-icon'>
                                {this.state.open_idx === idx ? <IconCollapse /> : <IconExpand />}
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
    list     : PropTypes.arrayOf(PropTypes.object),
};

export default Accordion;
