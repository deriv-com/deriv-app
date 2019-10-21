import classNames   from 'classnames';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes         from 'prop-types';
import ThemedScrollbars  from 'Components/themed-scrollbars';

const trackHorizontal = props => <div {...props} style={{ display: 'none' }} />;
const thumbHorizontal = props => <div {...props} style={{ display: 'none' }} />;

const ListItems = React.forwardRef((props, ref) => {
    const { active_index, list_items, is_object_list, onItemSelection, search } = props;

    return (
        <>
            {list_items.length ? 
                list_items.map((item, idx) => (
                    <div
                        ref={idx === active_index ? ref : null}
                        key={idx}
                        // onMouseDown ensures the click handler runs before the onBlur event of Input
                        onMouseDown={() => onItemSelection(item)}
                        className={classNames('dc-dropdown-list__item', {
                            'dc-dropdown-list__item--active': idx === active_index,
                        })}
                        value={is_object_list ? item.value : null}
                    >
                        { is_object_list ? item.text : item }
                    </div>
                )) :
                <div className={'dc-dropdown-list__item'}>No results found</div>
            }
        </>
    );
});
ListItems.displayName = 'ListItems';

const DropdownList = React.forwardRef((props, ref) => {
    const { list_ref, list_item_ref } = ref;
    const { active_index, is_visible, list_items, onItemSelection, style, search } = props;

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
                <ThemedScrollbars
                    list_ref={list_ref}
                    autoHeight
                    autoHide
                    autoHeightMax={220} // As specified by design spec
                    renderTrackHorizontal={trackHorizontal}
                    renderThumbHorizontal={thumbHorizontal}
                >
                    {is_object &&
                        Object.keys(list_items).map(items => <ListItems search={search} active_index={active_index} list_items={list_items[items]} ref={list_item_ref} onItemSelection={onItemSelection} />)
                    }
                    {is_string_array ? 
                        <ListItems search={search} active_index={active_index} list_items={list_items} ref={list_item_ref} onItemSelection={onItemSelection} /> :
                        <ListItems search={search} active_index={active_index} list_items={list_items} ref={list_item_ref} onItemSelection={onItemSelection} is_object_list />
                    }
                </ThemedScrollbars>
            </div>
        </CSSTransition>
    );
});
DropdownList.displayName = 'DropdownList';

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
