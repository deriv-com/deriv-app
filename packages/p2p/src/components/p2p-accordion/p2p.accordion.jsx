import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';

const usePrevious = value => {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

// This component is an enhancement over Accordion component, created to handle functionalities such as -
// 1. Expand all, collapse all
// 2. Opening one tab must not close the previous opened tab
const P2PAccordion = ({ className, icon_close, icon_open, list, is_expand_all, onChange }) => {
    const [open_idx, setOpenIdx] = React.useState({});
    const prev_list = usePrevious(list);

    React.useEffect(() => {
        if (prev_list !== list) {
            const state_ref = [...Array(list.length).keys()].reduce((acc, val) => ({ ...acc, [val]: false }), {});
            setOpenIdx(state_ref);
        }
    }, [list, prev_list]);

    React.useEffect(() => {
        let state_ref;
        if (is_expand_all) {
            state_ref = [...Array(list.length).keys()].reduce((acc, val) => ({ ...acc, [val]: true }), {});
            onChange(true);
        } else {
            state_ref = [...Array(list.length).keys()].reduce((acc, val) => ({ ...acc, [val]: false }), {});
            onChange(false);
        }
        setOpenIdx(state_ref);
    }, [is_expand_all]);

    // close if clicking the accordion that's open, otherwise open the new one
    const onClick = index => {
        setOpenIdx(prev_state => ({ ...prev_state, [index]: !prev_state[index] }));
        const is_all_expanded = Object.values(open_idx).every(status => status);
        onChange(is_all_expanded);
    };

    return (
        <div className={classNames('dc-accordion__wrapper', className)}>
            {list.map((item, idx) => (
                <div
                    className={classNames(
                        'dc-accordion__item',
                        `dc-accordion__item--${open_idx[idx] ? 'open' : 'close'}`,
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
                            {open_idx[idx] ? (
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

P2PAccordion.propTypes = {
    className: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.object),
    is_expand_all: PropTypes.bool, // Expands all Child elements
};

export default P2PAccordion;
