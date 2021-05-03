import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { usePrevious } from '../../hooks';
import Icon from '../icon';

const Accordion = ({ className, list }) => {
    const [open_idx, setOpenIdx] = React.useState(null);

    const prev_list = usePrevious(list);

    React.useEffect(() => {
        if (prev_list !== list) setOpenIdx(null);
    }, [list, prev_list]);

    // close if clicking the accordion that's open, otherwise open the new one
    const onClick = index => setOpenIdx(index === open_idx ? null : index);

    return (
        <div className={classNames('dc-accordion__wrapper', className)}>
            {list.map((item, idx) => (
                <div
                    className={classNames(
                        'dc-accordion__item',
                        `dc-accordion__item--${open_idx === idx ? 'open' : 'close'}`,
                        {
                            [`dc-accordion__item--${idx === 0 ? 'first' : 'last'}`]:
                                idx === 0 || idx === list.length - 1,
                        }
                    )}
                    key={idx}
                >
                    <div className='dc-accordion__item-header' onClick={() => onClick(idx)}>
                        {item.header}
                        <div className='dc-accordion__item-header-icon-wrapper'>
                            {open_idx === idx ? (
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
};

Accordion.propTypes = {
    className: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.object),
};

export default Accordion;
