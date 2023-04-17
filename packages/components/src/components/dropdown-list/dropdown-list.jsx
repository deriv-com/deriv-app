import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import ThemedScrollbars from '../themed-scrollbars/themed-scrollbars';

const ListItem = ({
    is_active,
    is_disabled,
    index,
    item,
    child_ref,
    onItemSelection,
    is_object_list,
    setActiveIndex,
}) => {
    return (
        <div
            ref={child_ref}
            // onMouseDown ensures the click handler runs before the onBlur event of Input
            onMouseDown={event => {
                event.stopPropagation();
                onItemSelection(item);
                setActiveIndex(index);
            }}
            className={classNames('dc-dropdown-list__item', {
                'dc-dropdown-list__item--active': is_active,
                'dc-dropdown-list__item--disabled': is_disabled,
            })}
            value={is_object_list ? item.value : null}
        >
            {is_object_list ? item.component || item.text : item}
        </div>
    );
};

const ListItems = React.forwardRef((props, ref) => {
    const { active_index, list_items, is_object_list, onItemSelection, setActiveIndex, not_found_text } = props;
    const is_grouped_list = list_items.some(list_item => !!list_item.group);

    if (is_grouped_list) {
        const groups = {};

        list_items.forEach(list_item => {
            const group = list_item.group || '?';
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(list_item);
        });

        const group_names = Object.keys(groups);
        let item_idx = -1;

        return (
            <>
                {group_names.map((group_name, group_idx) => {
                    const group = groups[group_name];
                    const has_separator = !!group_names[group_idx + 1];
                    return (
                        <React.Fragment key={`group${group_idx}`}>
                            <div className='dc-dropdown-list__group-header'>{group_name}</div>
                            {group.map(item => {
                                item_idx++;
                                return (
                                    <ListItem
                                        key={item_idx}
                                        item={item}
                                        index={item_idx}
                                        is_active={item_idx === active_index}
                                        onItemSelection={onItemSelection}
                                        setActiveIndex={setActiveIndex}
                                        is_object_list={is_object_list}
                                        is_disabled={item.disabled === 'DISABLED'}
                                        child_ref={item_idx === active_index ? ref : null}
                                    />
                                );
                            })}
                            {has_separator && <div className='dc-dropdown-list__separator' />}
                        </React.Fragment>
                    );
                })}
            </>
        );
    }

    return (
        <>
            {list_items.length ? (
                list_items.map((item, item_idx) => (
                    <ListItem
                        key={item_idx}
                        item={item}
                        index={item_idx}
                        is_active={item_idx === active_index}
                        onItemSelection={onItemSelection}
                        is_object_list={is_object_list}
                        setActiveIndex={setActiveIndex}
                        child_ref={item_idx === active_index ? ref : null}
                    />
                ))
            ) : (
                <div className='dc-dropdown-list__item dc-dropdown-list__item--not-found'>{not_found_text}</div>
            )}
        </>
    );
});
ListItems.displayName = 'ListItems';

const DropdownList = React.forwardRef((props, ref) => {
    const { dropdown_ref, list_item_ref, list_wrapper_ref } = ref;
    const {
        active_index,
        is_visible,
        list_items,
        list_height,
        onScrollStop,
        onItemSelection,
        setActiveIndex,
        style,
        not_found_text,
        portal_id,
    } = props;

    if (list_items.length && typeof list_items[0] !== 'string' && typeof list_items[0] !== 'object') {
        throw Error('Dropdown received wrong data structure');
    }

    const is_object = !Array.isArray(list_items) && typeof list_items === 'object';
    const is_string_array = list_items.length && typeof list_items[0] === 'string';

    const el_dropdown_list = (
        <CSSTransition
            appear={is_visible}
            in={is_visible}
            timeout={100}
            classNames={{
                enter: 'dc-dropdown-list--enter',
                enterDone: 'dc-dropdown-list--enter-done',
                exit: 'dc-dropdown-list--exit',
            }}
            unmountOnExit
        >
            <div style={style} className='dc-dropdown-list' ref={list_wrapper_ref}>
                <ThemedScrollbars height={list_height || '220px'} refSetter={dropdown_ref} onScroll={onScrollStop}>
                    {is_object ? (
                        Object.keys(list_items).map((items, idx) => (
                            <ListItems
                                key={idx}
                                not_found_text={not_found_text}
                                active_index={active_index}
                                list_items={list_items[items]}
                                ref={list_item_ref}
                                onItemSelection={onItemSelection}
                                setActiveIndex={setActiveIndex}
                            />
                        ))
                    ) : (
                        <ListItems
                            not_found_text={not_found_text}
                            active_index={active_index}
                            list_items={list_items}
                            ref={list_item_ref}
                            onItemSelection={onItemSelection}
                            is_object_list={!is_string_array}
                            setActiveIndex={setActiveIndex}
                        />
                    )}
                </ThemedScrollbars>
            </div>
        </CSSTransition>
    );

    if (portal_id) {
        return ReactDOM.createPortal(el_dropdown_list, document.getElementById(portal_id));
    }
    return el_dropdown_list;
});
DropdownList.displayName = 'DropdownList';

export default DropdownList;

const list_items_shape = PropTypes.arrayOf(
    PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    })
);

DropdownList.propTypes = {
    active_index: PropTypes.number,
    is_visible: PropTypes.bool,
    list_items: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        list_items_shape,
        PropTypes.objectOf(list_items_shape),
    ]),
    list_height: PropTypes.string,
    not_found_text: PropTypes.string,
    onItemSelection: PropTypes.func,
    style: PropTypes.object,
    portal_id: PropTypes.string,
    onScrollStop: PropTypes.func,
    setActiveIndex: PropTypes.func,
};
