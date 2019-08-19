import React          from 'react';
import PropTypes      from 'prop-types';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import                     './dropdown-list.scss';

const trackHorizontal = props => <div {...props} className='track-horizontal' style={{ display: 'none' }} />;
const thumbHorizontal = props => <div {...props} className='thumb-horizontal' style={{ display: 'none' }} />;

const DropdownList = ({ is_visible, list_items, onItemSelection, style }) => {
    console.log('Dropdown list items:', list_items);

    if (!is_visible) {
        return null;
    }

    if (list_items.length && typeof list_items[0] !== 'string' && typeof list_items[0] !== 'object') {
        throw Error('Dropdown received wrong data structure');
    }

    const is_string_array = list_items.length && typeof list_items[0] === 'string';

    return (
        <div style={style} className='dc-dropdown-list'>
            <Scrollbars
                autoHeight
                autoHide
                autoHeightMax={220} // As specified by design spec
                renderTrackHorizontal={trackHorizontal}
                renderThumbHorizontal={thumbHorizontal}
            >
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
    );
};

export default DropdownList;

DropdownList.propTypes = {
    list_items: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(
            PropTypes.shape({
                text : PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ),
    ]),
};
