import classNames from 'classnames';
import React from 'react';
import { matchStringByChar, getPosition } from '@deriv/shared';
import Icon from '../icon';
import Input from '../input';
import DropdownList, { TItem } from '../dropdown-list';
import { useBlockScroll } from '../../hooks/use-blockscroll';
import { getEnglishCharacters } from '../../../utils/helper';

type TAutocompleteProps = {
    autoComplete: string;
    className: string;
    disabled?: boolean;
    dropdown_offset: string;
    error: string;
    has_updating_list?: boolean;
    hide_list?: boolean;
    historyValue: string;
    input_id: string;
    is_alignment_top: boolean;
    is_list_visible?: boolean;
    list_height: string;
    list_items: TItem[];
    list_portal_id: string;
    not_found_text?: string;
    onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onHideDropdownList: () => void;
    onItemSelection: (item: TItem) => void;
    onScrollStop?: () => void;
    onShowDropdownList?: () => void;
    should_filter_by_char: boolean;
    show_list?: boolean;
    trailing_icon?: React.ReactElement;
    value: string;
    onSearch?: (value: string, items: TItem[]) => [];
    data_testid: string;
};

const KEY_CODE = {
    ENTER: 13,
    ESCAPE: 27,
    TAB: 9,
    KEYDOWN: 40,
    KEYUP: 38,
};

const getFilteredItems = (val: string, list: TItem[], should_filter_by_char = false) => {
    if (should_filter_by_char) {
        return list.filter(item =>
            typeof item === 'string' ? matchStringByChar(item, val) : matchStringByChar(item.text || '', val)
        );
    }
    return list.filter(item =>
        typeof item === 'string'
            ? getEnglishCharacters(item).toLowerCase().includes(val) || item.toLowerCase().includes(val)
            : getEnglishCharacters(item.text || '')
                  .toLowerCase()
                  .includes(val) || item?.text?.toLowerCase().includes(val)
    );
};
const Autocomplete = React.memo((props: TAutocompleteProps) => {
    const {
        autoComplete,
        data_testid,
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
        not_found_text = 'No results found',
        ...other_props
    } = props;

    const dropdown_ref = React.useRef<HTMLDivElement & SVGSVGElement>(null);
    const list_wrapper_ref = React.useRef<HTMLDivElement>(null);
    const list_item_ref = React.useRef<HTMLDivElement>(null);
    const input_wrapper_ref = React.useRef<HTMLDivElement>(null);

    const [should_show_list, setShouldShowList] = React.useState(false);
    const [input_value, setInputValue] = React.useState('');
    const [active_index, setActiveIndex] = React.useState(-1);
    const [filtered_items, setFilteredItems] = React.useState(list_items);
    const [style, setStyle] = React.useState({});
    useBlockScroll(list_portal_id && should_show_list ? input_wrapper_ref : undefined);

    let scroll_timeout: ReturnType<typeof setTimeout> | undefined;
    let scroll_top_position = null;

    React.useEffect(() => {
        if (has_updating_list) {
            let new_filtered_items = [];

            if (is_list_visible) {
                if (typeof props.onSearch === 'function') {
                    new_filtered_items = props.onSearch(value.toLowerCase(), list_items);
                } else {
                    new_filtered_items = getFilteredItems(value.toLowerCase(), list_items);
                }
            } else {
                new_filtered_items = list_items;
            }

            setFilteredItems(new_filtered_items);
            if (historyValue) {
                const index = new_filtered_items.findIndex(
                    object => (typeof object === 'object' ? object.text : object) === historyValue
                );
                setInputValue(historyValue);
                setActiveIndex(index);
            } else {
                setInputValue('');
                setActiveIndex(-1);
            }
        }
    }, [list_items, has_updating_list, historyValue]);

    React.useEffect(() => {
        if (is_list_visible) {
            const index = filtered_items.findIndex(
                item => (typeof item === 'object' ? item.text : item) === historyValue
            );
            setActiveIndex(index);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtered_items]);

    React.useEffect(() => {
        if (show_list) showDropdownList();
        if (hide_list) hideDropdownList();
        if (should_show_list && list_item_ref.current) {
            const item = list_item_ref.current.offsetTop;
            dropdown_ref.current?.scrollTo({ top: item, behavior: 'smooth' });
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

    const handleScrollStop = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        // pass onScrollStop func callback when scrolling stops
        if (!props.onScrollStop) return;

        const element = e.currentTarget;
        scroll_top_position = element.scrollTop;
        if (scroll_top_position === element.scrollTop) {
            clearTimeout(scroll_timeout);
        }
        scroll_timeout = setTimeout(() => {
            props.onScrollStop?.();
        }, 150);
    };

    const onKeyPressed = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        if (active_index !== -1) {
            const up = active_index - 1;
            const should_scroll_to_last = up < 0;

            if (should_scroll_to_last) {
                const list_height = dropdown_ref.current?.clientHeight;
                setActiveIndex(filtered_items.length - 1);
                dropdown_ref.current?.scrollTo({ top: list_height, behavior: 'smooth' });
            } else {
                const item_height = Number(list_item_ref.current?.getBoundingClientRect().height);
                const item_top = Math.floor(Number(list_item_ref.current?.getBoundingClientRect()?.top)) - item_height;

                if (!isListItemWithinView(item_top)) {
                    const top_of_list = Number(list_item_ref.current?.offsetTop) - item_height;
                    dropdown_ref.current?.scrollTo({ top: top_of_list, behavior: 'smooth' });
                }
                setActiveIndex(up);
            }
        }
    };

    const isListItemWithinView = (item_top: number) => {
        const list_height = Number(dropdown_ref.current?.clientHeight);
        const wrapper_top = Math.floor(Number(list_wrapper_ref.current?.getBoundingClientRect().top));
        const wrapper_bottom = Math.floor(Number(list_wrapper_ref.current?.getBoundingClientRect().top)) + list_height;

        if (item_top >= wrapper_bottom) return false;
        return item_top > wrapper_top;
    };

    const setActiveDown = () => {
        if (active_index === -1 || !list_item_ref.current) {
            setActiveIndex(0);
        } else if (typeof active_index === 'number') {
            const down = active_index + 1;
            const should_scroll_to_first = down >= filtered_items.length;

            if (should_scroll_to_first) {
                setActiveIndex(0);
                dropdown_ref.current?.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const item_height = list_item_ref.current.getBoundingClientRect().height;
                const item_top =
                    Math.floor(list_item_ref.current.getBoundingClientRect().top) + item_height + item_height / 2;
                const list_height = Number(dropdown_ref.current?.clientHeight);

                if (!isListItemWithinView(item_top)) {
                    const items_above = list_height / item_height - 2;
                    const bottom_of_list = list_item_ref.current.offsetTop - items_above * item_height;
                    dropdown_ref.current?.scrollTo?.({ top: bottom_of_list, behavior: 'smooth' });
                }
                setActiveIndex(down);
            }
        }
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        hideDropdownList();

        if (!is_list_visible) setFilteredItems(list_items);

        if (input_value === '') {
            props.onItemSelection?.({
                text: props.not_found_text,
                value: '',
            });
        }
        if (typeof props.onBlur === 'function') {
            props.onBlur(e);
        }
    };

    const onSelectItem = (item: TItem) => {
        if (!item) return;

        setInputValue((typeof item === 'object' ? item.text : item) || '');

        props.onItemSelection?.(item);
    };

    const showDropdownList = () => {
        setShouldShowList(true);

        props.onShowDropdownList?.();
    };

    const hideDropdownList = () => {
        setShouldShowList(false);

        props.onHideDropdownList?.();
    };

    const filterList = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target as HTMLInputElement).value.toLowerCase();
        let new_filtered_items = [];

        if (typeof props.onSearch === 'function') {
            new_filtered_items = props.onSearch(val, props.list_items);
        } else {
            new_filtered_items = getFilteredItems(val, props.list_items, should_filter_by_char);
        }

        if (!new_filtered_items.length) {
            setInputValue('');
        }
        setFilteredItems(new_filtered_items);
    };

    return (
        <div data-testid={data_testid} className={classNames('dc-autocomplete', className)}>
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
                dropdown_refs={{
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

export default Autocomplete;
