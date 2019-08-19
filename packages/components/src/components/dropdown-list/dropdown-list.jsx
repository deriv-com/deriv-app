import React                   from 'react';
import { Scrollbars }          from 'tt-react-custom-scrollbars';
import                              './dropdown-list.scss';

const trackHorizontal = props => <div {...props} className='track-horizontal' style={{ display: 'none' }} />;
const thumbHorizontal = props => <div {...props} className='thumb-horizontal' style={{ display: 'none' }} />;

const DropdownList = ({ is_visible, list_items, onItemSelection, style }) => {
    console.log(list_items);

    if (!is_visible) return null;

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
                    list_items.map((item, idx) => {
                        return (
                            <div
                                key={idx}
                                // onMouseDown ensures the click handler runs before the onBlur event of Input
                                onMouseDown={() => onItemSelection(item)}
                                className='dc-dropdown-list__item'
                            >
                                { item }
                            </div>
                        );
                    })
                }
            </Scrollbars>
        </div>
    );
};

export default DropdownList;
