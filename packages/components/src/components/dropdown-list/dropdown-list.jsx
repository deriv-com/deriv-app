import classNames   from 'classnames';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes         from 'prop-types';
import ThemedScrollbars  from 'Components/themed-scrollbars';

const trackHorizontal = props => <div {...props} style={{ display: 'none' }} />;
const thumbHorizontal = props => <div {...props} style={{ display: 'none' }} />;

const ListItems = React.forwardRef((props, ref) => {
    const { active_index, list_items, is_object_list, onItemSelection, not_found_text } = props;

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
                <div className={'dc-dropdown-list__item'}>{not_found_text}</div>
            }
        </>
    );
});
ListItems.displayName = 'ListItems';

const DropdownList = React.forwardRef((props, ref) => {
    const { dropdown_ref, list_item_ref, list_wrapper_ref } = ref;
    const { active_index, is_visible, list_items, onItemSelection, style, not_found_text } = props;
    if (list_items.length && typeof list_items[0] !== 'string' && typeof list_items[0] !== 'object') {
        throw Error('Dropdown received wrong data structure');
    }

    const is_object       = !Array.isArray(list_items) && typeof list_items === 'object';
    const is_string_array = list_items.length && typeof list_items[0] === 'string';

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
            <div style={style} className='dc-dropdown-list' ref={list_wrapper_ref}>
                <ThemedScrollbars
                    list_ref={dropdown_ref}
                    autoHeight
                    autoHide
                    autoHeightMax={220} // As specified by design spec
                    renderTrackHorizontal={trackHorizontal}
                    renderThumbHorizontal={thumbHorizontal}
                >
                    {is_object ?
                        Object.keys(list_items).map((items, idx) =>
                            <ListItems
                                key={idx}
                                not_found_text={not_found_text}
                                active_index={active_index}
                                list_items={list_items[items]}
                                ref={list_item_ref}
                                onItemSelection={onItemSelection}
                            />
                        ) :
                        <ListItems
                            not_found_text={not_found_text}
                            active_index={active_index}
                            list_items={list_items}
                            ref={list_item_ref}
                            onItemSelection={onItemSelection}
                            is_object_list={!is_string_array}
                        />
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
    active_index: PropTypes.number,
    is_visible  : PropTypes.bool,
    list_items  : PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        list_items_shape,
        PropTypes.objectOf(list_items_shape),
    ]),
    not_found_text : PropTypes.string,
    onItemSelection: PropTypes.func,
    style          : PropTypes.object,
};
