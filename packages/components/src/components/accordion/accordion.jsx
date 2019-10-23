import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

// TODO: use-from-shared - Use this icon from icons' shared package
const IconExpand = ({ className }) => (
    <svg className={className} width='16px' height='16px' viewBox='0 0 16 16'>
        <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
            <path d='M8,2 C8.27614237,2 8.5,2.22385763 8.5,2.5 L8.5,7.5 L13.5,7.5 C13.7761424,7.5 14,7.72385763 14,8 C14,8.27614237 13.7761424,8.5 13.5,8.5 L8.5,8.5 L8.5,13.5 C8.5,13.7761424 8.27614237,14 8,14 C7.72385763,14 7.5,13.7761424 7.5,13.5 L7.5,8.5 L2.5,8.5 C2.22385763,8.5 2,8.27614237 2,8 C2,7.72385763 2.22385763,7.5 2.5,7.5 L7.5,7.5 L7.5,2.5 C7.5,2.22385763 7.72385763,2 8,2 Z' fill='#333333' fillRule='nonzero' />
        </g>
    </svg>
);

// TODO: use-from-shared - Use this icon from icons' shared package
const IconCollapse = ({ className }) => (
    <svg className={className} width='16px' height='16px' viewBox='0 0 16 16'>
        <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
            <rect fill='#333333' fillRule='nonzero' x='2' y='7.5' width='12' height='1' rx='0.5' />
        </g>
    </svg>
);

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
        const {
            list,
            className,
        } = this.props;

        return (
            <div className={classNames('dc-accordion__wrapper', className)}>
                {list.map((item, idx) => (
                    <div
                        className={
                            classNames(
                                'dc-accordion__item',
                                `dc-accordion__item--${this.state.open_idx === idx ? 'open' : 'close'}`,
                                { [`dc-accordion__item--${idx === 0 ? 'first' : 'last'}`]: idx === 0 || idx === list.length - 1 },
                            )
                        }
                        key={idx}
                    >
                        <div className='dc-accordion__item-header' onClick={() => { this.onClick(idx); }}>
                            {item.header}
                            <div className='dc-accordion__item-header-icon-wrapper'>
                                {this.state.open_idx === idx ? <IconCollapse className='dc-accordion__item-header-icon' /> : <IconExpand className='dc-accordion__item-header-icon' />}
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
