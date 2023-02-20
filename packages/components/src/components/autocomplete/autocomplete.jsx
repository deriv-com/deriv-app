import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { matchStringByChar, getPosition } from '@deriv/shared';
import Icon from '../icon';
import Input from '../input';
import DropdownList from '../dropdown-list';
import { useBlockScroll } from '../../hooks/use-blockscroll';

const KEY_CODE = {
    ENTER: 13,
    ESCAPE: 27,
    TAB: 9,
    KEYDOWN: 40,
    KEYUP: 38,
};

const getFilteredItems = (val, list, should_filter_by_char) => {
    const is_string_array = list.length && typeof list[0] === 'string';

    if (should_filter_by_char) {
        return list.filter(item =>
            is_string_array ? matchStringByChar(item, val) : matchStringByChar(item.text, val)
        );
    }

    return list.filter(item =>
        is_string_array ? item.toLowerCase().includes(val) : item.text.toLowerCase().includes(val)
    );
};
const Autocomplete = React.memo(props => {
    const {
        autoComplete,
        className,
        dropdown_offset,
        historyValue,
        error,
        has_updating_list = true,
        hide_list = false,
        input_id,
        is_alignment_top,
        is_list_visible = false,
        list_items,
        list_portal_id,
        onHideDropdownList,
        onItemSelection,
        onScrollStop,
        onShowDropdownList,
        should_filter_by_char,
        show_list = false,
        value,
        ...other_props
    } = props;

    const dropdown_ref = React.useRef();
    const list_wrapper_ref = React.useRef();
    const list_item_ref = React.useRef();
    const input_wrapper_ref = React.useRef();

    const [should_show_list, setShouldShowList] = React.useState(false);
    const [input_value, setInputValue] = React.useState('');
    const [active_index, setActiveIndex] = React.useState(null);
    const [filtered_items, setFilteredItems] = React.useState(list_items);
    const [style, setStyle] = React.useState({});
    useBlockScroll(list_portal_id && should_show_list ? input_wrapper_ref : false);

    let scroll_timeout = null;
    let scroll_top_position = null;

    React.useEffect(() => {
        if (has_updating_list) {
            const new_filtered_items = is_list_visible ? getFilteredItems(value.toLowerCase(), list_items) : list_items;

            setFilteredItems(new_filtered_items);
            if (historyValue) {
                const index = new_filtered_items.findIndex(object => {
                    return object.text === historyValue;
                });
                setInputValue(historyValue);
                setActiveIndex(index);
            } else {
                setInputValue('');
                setActiveIndex(null);
            }
        }
    }, [list_items, has_updating_list, historyValue]);

    React.useEffect(() => {
        if (is_list_visible) {
            const index = filtered_items.findIndex(item => item.text === historyValue);
            setActiveIndex(index);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtered_items]);

    React.useEffect(() => {
        if (show_list) showDropdownList();
        if (hide_list) hideDropdownList();
        if (should_show_list && list_item_ref.current) {
            const item = list_item_ref.current.offsetTop;
            dropdown_ref.current.scrollTo({ top: item, behavior: 'smooth' });
        }
    }, [show_list, hide_list, should_show_list, list_item_ref]);

    React.useEffect(() => {
        if (list_wrapper_ref.current && list_portal_id && should_show_list) {
            const position_style = getPosition({
                preferred_alignment: is_alignment_top ? 'top' : 'bottom',
                parent_el: input_wrapper_ref.current,
                child_el: list_wrapper_ref.current,
            });

            setStyle(position_style.style);
        }
    }, [should_show_list, is_alignment_top, list_portal_id, filtered_items.length]);

    const handleScrollStop = e => {
        // pass onScrollStop func callback when scrolling stops
        if (typeof props.onScrollStop !== 'function') return;

        const element = e.target;
        scroll_top_position = element.scrollTop;
        if (scroll_top_position === element.scrollTop) {
            clearTimeout(scroll_timeout);
        }
        scroll_timeout = setTimeout(() => {
            props.onScrollStop();
        }, 150);
    };

    const onKeyPressed = event => {
        switch (event.keyCode) {
            case KEY_CODE.ENTER:
                event.preventDefault();
                hideDropdownList();
                onSelectItem(filtered_items[active_index]);
                break;
            case KEY_CODE.TAB:
                if (should_show_list) {
                    hideDropdownList();
                    onSelectItem(filtered_items[active_index]);
                }
                break;
            case KEY_CODE.ESCAPE:
                event.preventDefault();
                hideDropdownList();
                break;
            case KEY_CODE.KEYDOWN:
                if (!should_show_list) showDropdownList();
                setActiveDown();
                break;
            case KEY_CODE.KEYUP:
                if (!should_show_list) showDropdownList();
                else setActiveUp();
                break;
            default:
                if (!should_show_list) showDropdownList();
                break;
        }
    };

    const setActiveUp = () => {
        if (typeof active_index === 'number') {
            const up = active_index - 1;
            const should_scroll_to_last = up < 0;

            if (should_scroll_to_last) {
                const list_height = dropdown_ref.current.clientHeight;
                setActiveIndex(filtered_items.length - 1);
                dropdown_ref.current.scrollTo({ top: list_height, behavior: 'smooth' });
            } else {
                const item_height = list_item_ref.current.getBoundingClientRect().height;
                const item_top = Math.floor(list_item_ref.current.getBoundingClientRect().top) - item_height;

                if (!isListItemWithinView(item_top)) {
                    const top_of_list = list_item_ref.current.offsetTop - item_height;
                    dropdown_ref.current.scrollTo({ top: top_of_list, behavior: 'smooth' });
                }
                setActiveIndex(up);
            }
        }
    };

    const isListItemWithinView = item_top => {
        const list_height = dropdown_ref.current.clientHeight;
        const wrapper_top = Math.floor(list_wrapper_ref.current.getBoundingClientRect().top);
        const wrapper_bottom = Math.floor(list_wrapper_ref.current.getBoundingClientRect().top) + list_height;

        if (item_top >= wrapper_bottom) return false;
        return item_top > wrapper_top;
    };

    const setActiveDown = () => {
        if (active_index === null || !list_item_ref.current) {
            setActiveIndex(0);
        } else if (typeof active_index === 'number') {
            const down = active_index + 1;
            const should_scroll_to_first = down >= filtered_items.length;

            if (should_scroll_to_first) {
                setActiveIndex(0);
                dropdown_ref.current.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const item_height = list_item_ref.current.getBoundingClientRect().height;
                const item_top =
                    Math.floor(list_item_ref.current.getBoundingClientRect().top) + item_height + item_height / 2;
                const list_height = dropdown_ref.current.clientHeight;

                if (!isListItemWithinView(item_top)) {
                    const items_above = list_height / item_height - 2;
                    const bottom_of_list = list_item_ref.current.offsetTop - items_above * item_height;
                    dropdown_ref.current.scrollTo({ top: bottom_of_list, behavior: 'smooth' });
                }
                setActiveIndex(down);
            }
        }
    };

    const onBlur = e => {
        e.preventDefault();
        hideDropdownList();

        if (!is_list_visible) setFilteredItems(list_items);

        if (input_value === '' && typeof props.onItemSelection === 'function') {
            props.onItemSelection({
                text: props.not_found_text,
                value: '',
            });
        }
        if (typeof props.onBlur === 'function') {
            props.onBlur(e);
        }
    };

    const onSelectItem = item => {
        if (!item) return;

        setInputValue(item.text ? item.text : item);

        if (typeof props.onItemSelection === 'function') {
            props.onItemSelection(item);
        }
    };

    const showDropdownList = () => {
        setShouldShowList(true);

        if (typeof props.onShowDropdownList === 'function') {
            props.onShowDropdownList();
        }
    };

    const hideDropdownList = () => {
        setShouldShowList(false);

        if (typeof props.onHideDropdownList === 'function') {
            props.onHideDropdownList();
        }
    };

    const filterList = e => {
        const val = e.target.value.toLowerCase();
        const new_filtered_items = getFilteredItems(val, props.list_items, should_filter_by_char);

        if (!new_filtered_items.length) {
            setInputValue('');
        }
        setFilteredItems(new_filtered_items);
    };

    return (
        <div className={classNames('dc-autocomplete', className)}>
            <div ref={input_wrapper_ref} className='dc-autocomplete__input-field'>
                <Input
                    {...other_props}
                    className='dc-autocomplete__field'
                    error={error}
                    autoComplete={autoComplete}
                    onKeyDown={onKeyPressed}
                    onInput={filterList}
                    input_id={input_id}
                    onClick={() => {
                        if (should_show_list) hideDropdownList();
                        else showDropdownList();
                    }}
                    // Field's onBlur still needs to run to perform form functions such as validation
                    onBlur={onBlur}
                    value={
                        // This allows us to let control of value externally (from <Form/>) or internally if used without form
                        typeof onItemSelection === 'function' ? value : input_value
                    }
                    trailing_icon={
                        other_props.trailing_icon ? (
                            other_props.trailing_icon
                        ) : (
                            <Icon
                                icon='IcChevronDown'
                                className={{
                                    'dc-autocomplete__trailing-icon': true,
                                    'dc-autocomplete__trailing-icon--opened': should_show_list,
                                    'dc-autocomplete__trailing-icon--disabled': other_props.disabled,
                                }}
                            />
                        )
                    }
                />
            </div>
            <DropdownList
                ref={{
                    dropdown_ref,
                    list_item_ref,
                    list_wrapper_ref,
                }}
                active_index={active_index}
                style={{
                    width: input_wrapper_ref.current ? `${input_wrapper_ref.current.offsetWidth}px` : '100%',
                    ...(style || {
                        marginTop: dropdown_offset ? `calc(-${dropdown_offset} + 8px)` : '8px', // 4px is the standard margin. In case of error, the list should overlap the error
                        // TODO confirm placement of dropdown list and positioning of error
                        // marginTop: form.errors[field.name] ? 'calc(4px - 18px)' : '4px', // 4px is the standard margin. In case of error, the list should overlap the error
                    }),
                }}
                is_visible={should_show_list || is_list_visible}
                list_items={filtered_items}
                list_height={props.list_height}
                // Autocomplete must use the `text` property and not the `value`, however DropdownList provides access to both
                onItemSelection={onSelectItem}
                setActiveIndex={setActiveIndex}
                onScrollStop={handleScrollStop}
                not_found_text={props.not_found_text}
                portal_id={list_portal_id}
            />
        </div>
    );
});

Autocomplete.displayName = 'Autocomplete';

Autocomplete.defaultProps = {
    not_found_text: 'No results found',
};

Autocomplete.propTypes = {
    className: PropTypes.string,
    is_list_visible: PropTypes.bool,
    list_items: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ),
    ]),
    list_height: PropTypes.string,
    not_found_text: PropTypes.string,
    onHideDropdownList: PropTypes.func,
    onItemSelection: PropTypes.func,
    onShowDropdownList: PropTypes.func,
    list_portal_id: PropTypes.string,
    is_alignment_top: PropTypes.bool,
    should_filter_by_char: PropTypes.bool,
    autoComplete: PropTypes.string,
    dropdown_offset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    error: PropTypes.string,
    has_updating_list: PropTypes.bool,
    input_id: PropTypes.string,
    onScrollStop: PropTypes.func,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    show_list: PropTypes.bool,
    hide_list: PropTypes.bool,
};

export default Autocomplete;
