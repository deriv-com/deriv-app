import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes         from 'prop-types';
import { Scrollbars }    from 'tt-react-custom-scrollbars';

const trackHorizontal = props => <div {...props} className='track-horizontal' style={{ display: 'none' }} />;
const thumbHorizontal = props => <div {...props} className='thumb-horizontal' style={{ display: 'none' }} />;

const DropdownList = ({ is_visible, list_items, onItemSelection, style }) => {
    if (list_items.length && typeof list_items[0] !== 'string' && typeof list_items[0] !== 'object') {
        throw Error('Dropdown received wrong data structure');
    }

    const is_object = !Array.isArray(list_items) && typeof list_items === 'object';

    const is_string_array = !is_object && list_items.length && typeof list_items[0] === 'string';

    return (
        <CSSTransition
            in={is_visible}
            timeout={100}
            classNames={{
                enter    : 'dc-dropdown-list--enter',
                enterDone: 'dc-dropdown-list--enter-done',
                exit     : 'dc-dropdown-list--exit',
            }}
            unmountOnExit
        >
            <div style={style} className='dc-dropdown-list'>
                <Scrollbars
                    autoHeight
                    autoHide
                    autoHeightMax={220} // As specified by design spec
                    renderTrackHorizontal={trackHorizontal}
                    renderThumbHorizontal={thumbHorizontal}
                >
                    {is_object &&
                        Object.keys(list_items).map((items) => (
                            list_items[items].map((item, idx) => (
                                <div
                                    key={idx}
                                    // onMouseDown ensures the click handler runs before the onBlur event of Input
                                    onMouseDown={() => onItemSelection(item)}
                                    className='dc-dropdown-list__item'
                                    value={item.value}
                                >
                                    { item.text }
                                </div>
                            ))
                        ))
                    }
                    {
                        is_string_array ?
                            list_items.map((item, idx) => (
                                <div
                                    key={idx}
                                    // onMouseDown ensures the click handler runs before the onBlur event of Input
                                    onMouseDown={() => onItemSelection(item)}
                                    className='dc-dropdown-list__item'
                                >
                                    { item }
                                </div>
                            ))
                            :
                            list_items.map((item, idx) => (
                                <div
                                    key={idx}
                                    // onMouseDown ensures the click handler runs before the onBlur event of Input
                                    onMouseDown={() => onItemSelection(item)}
                                    className='dc-dropdown-list__item'
                                >
                                    { item.text }
                                </div>
                            ))
                    }
                </Scrollbars>
            </div>
        </CSSTransition>
    );
};

export default DropdownList;

const list_items_shape = PropTypes.arrayOf(
    PropTypes.shape({
        text : PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    })
);

DropdownList.propTypes = {
    list_items: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        list_items_shape,
        PropTypes.objectOf(list_items_shape),
    ]),
};
