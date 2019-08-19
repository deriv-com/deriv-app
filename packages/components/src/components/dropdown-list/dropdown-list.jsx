import React                   from 'react';
import { Scrollbars }          from 'tt-react-custom-scrollbars';
import                              './dropdown-list.scss';

const DropdownList = ({ is_visible, list_items, onItemSelection }) => {
    console.log(list_items);

    if (!is_visible) return null;

    return (
        <div className='dc-dropdown-list'>
            <Scrollbars
                autoHeight
                autoHide
                autoHeightMax={220}
                renderTrackHorizontal={props => <div {...props} className='track-horizontal' style={{ display: 'none' }} />}
                renderThumbHorizontal={props => <div {...props} className='thumb-horizontal' style={{ display: 'none' }} />}
            >
                {
                    list_items.map((item, idx) => {
                        return (
                            <div
                                key={idx}
                                onClick={() => onItemSelection(item)}
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
