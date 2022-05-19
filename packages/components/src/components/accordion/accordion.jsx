import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { usePrevious } from '../../hooks';
import Icon from '../icon';

const Accordion = ({ className, icon_close, icon_open, list, is_expand_all }) => {
    console.log('Status: ', is_expand_all);
    const [open_idx, setOpenIdx] = React.useState(null);
    const [expand_all, setExpandAll] = React.useState(is_expand_all);

    const prev_list = usePrevious(list);

    React.useEffect(() => {
        if (prev_list !== list) setOpenIdx(null);
    }, [list, prev_list]);

    React.useEffect(() => {
        setExpandAll(is_expand_all);
    }, [is_expand_all]);

    // close if clicking the accordion that's open, otherwise open the new one
    const onClick = index => setOpenIdx(index === open_idx ? null : index);

    // const handler = () => {
    //     setOpenAll(true);
    // };

    // const handler2 = () => {
    //     setOpenAll(false);
    // };

    return (
        <div className={classNames('dc-accordion__wrapper', className)}>
            {/* is_expand_all_visible && <button onClick={handler}>Expand all</button>
            <button onClick={handler2}>Collapse all</button> */}
            {list.map((item, idx) => (
                <div
                    className={classNames(
                        'dc-accordion__item',
                        `dc-accordion__item--${expand_all || open_idx === idx ? 'open' : 'close'}`,
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
                            {expand_all || open_idx === idx ? (
                                <Icon icon={icon_open || 'IcMinus'} className='dc-accordion__item-header-icon' />
                            ) : (
                                <Icon icon={icon_close || 'IcAdd'} className='dc-accordion__item-header-icon' />
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
