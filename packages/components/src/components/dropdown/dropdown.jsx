import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { mobileOSDetect } from '@deriv/shared';
import { listPropType, findNextFocusableNode, findPreviousFocusableNode } from './dropdown';
import Items from './items.jsx';
import NativeSelect from './native-select.jsx';
import DisplayText from './display-text.jsx';
import { useOnClickOutside } from '../../hooks';
import ThemedScrollbars from '../themed-scrollbars/themed-scrollbars.jsx';
import Icon from '../icon';

const Dropdown = ({
    className,
    classNameDisplay,
    classNameItems,
    classNameLabel,
    disabled,
    error,
    handleBlur,
    has_symbol,
    hint,
    label,
    list,
    name,
    no_border,
    is_alignment_top,
    is_alignment_left,
    is_align_text_left,
    is_large,
    is_nativepicker,
    is_nativepicker_visible,
    placeholder,
    onChange,
    value,
    initial_offset = 0,
}) => {
    const dropdown_ref = React.useRef();
    const list_ref = React.useRef();
    const native_select_ref = React.useRef();
    const wrapper_ref = React.useRef();
    const nodes = React.useRef(new Map());

    const [is_list_visible, setIsListVisible] = React.useState(!!is_nativepicker_visible);
    const [list_dimensions, setListDimensions] = React.useState([initial_offset, 0]);
    const initial_render = React.useRef(true);

    const onClickOutSide = () => {
        if (typeof handleBlur === 'function') handleBlur({ target: { name } });
        setIsListVisible(false);
    };

    useOnClickOutside(wrapper_ref, onClickOutSide, () => is_list_visible);

    /**
     * Calculate the offset for the dropdown list based on its width
     *
     * @return {{transform: string}}
     */
    const computed_offset_left = () => {
        return {
            transform: `translate3d(calc(-${list_dimensions[0]}px - 12px), 0, 0px)`,
        };
    };

    /**
     * Calculate the offset for the dropdown list based on its height
     *
     * @return {{transform: string}}
     */
    const computed_offset_top = () => {
        return {
            transform: `translate3d(0, calc(-${list_dimensions[1]}px - 16px), 0px)`,
        };
    };

    const isSingleOption = () => {
        return Array.isArray(list)
            ? list.length < 2
            : // object has less than two props or inner object has less than two props
              Object.keys(list).length && Object.keys(list).length < 2 && list[Object.keys(list)[0]].length < 2;
    };

    const containerClassName = () => {
        return classNames('dc-dropdown-container', className, {
            'dc-dropdown--has-placeholder': placeholder,
            'dc-dropdown--left': is_alignment_left,
            'dc-dropdown--show': is_list_visible,
            'dc-dropdown--disabled': isSingleOption() || disabled,
            'dc-dropdown--error': error,
        });
    };

    const dropdownDisplayClassName = () => {
        return classNames('dc-dropdown__display', classNameDisplay, {
            'dc-dropdown__display--clicked': is_list_visible,
            'dc-dropdown__display--has-symbol': has_symbol,
            'dc-dropdown__display--no-border': no_border,
            'dc-dropdown__display--is-left-text': is_align_text_left,
        });
    };

    const dropdownListClassName = () => {
        return classNames('dc-dropdown__list', {
            'dc-dropdown__list--left': is_alignment_left,
            'dc-dropdown__list--top': is_alignment_top,
        });
    };

    const listClassNames = () => {
        return classNames('dc-list', {
            'dc-list--left': is_alignment_left,
            'dc-list--large': is_large,
        });
    };

    const transitionClassName = () => {
        return {
            enter: `dc-dropdown__list--enter${is_alignment_left ? ' dc-dropdown__list--left--enter' : ''}`,
            enterDone: `dc-dropdown__list--enter-done${
                is_alignment_left ? ' dc-dropdown__list--left--enter-done' : ''
            }`,
            exit: `dc-dropdown__list--exit${is_alignment_left ? ' dc-dropdown__list--left--exit' : ''}`,
        };
    };

    React.useEffect(() => {
        if (is_nativepicker && !is_nativepicker_visible && is_list_visible) {
            setIsListVisible(false);
        }
    }, [is_nativepicker, is_nativepicker_visible]);

    React.useEffect(() => {
        if (!initial_render.current && !is_list_visible && value) dropdown_ref.current.focus();
    }, [is_list_visible]);

    const handleSelect = item => {
        if (item.value !== value) onChange({ target: { name, value: item.value } });

        handleVisibility();
    };

    const handleVisibility = () => {
        if (is_nativepicker && !is_list_visible) {
            if (mobileOSDetect() === 'iOS') {
                /* .focus() doesn't trigger open <select /> in Android :(
                 * so we use a CSS hack - refer to L237 in dropdown.scss
                 * [TODO]: find alternative solution to trigger open <select /> with JS
                 */
                native_select_ref.current.focus();
            }
            setIsListVisible(true);
        } else {
            setIsListVisible(!is_list_visible);
        }
    };

    const onKeyPressed = (event, item) => {
        if (isSingleOption()) return;

        // Tab -> before preventDefault() to be able to go to the next tabIndex
        if (event.keyCode === 9 && !is_list_visible) return;

        event.preventDefault();
        event.stopPropagation();

        switch (event.keyCode) {
            case 27: // esc
                if (is_list_visible) handleVisibility();
                break;
            case 9: // Tab
            case 13: // Enter
            case 32: // Space
                if (!item) return;
                handleSelect(item);
                break;
            case 38: // Up Arrow
            case 40: // Down Arrow
                if (is_list_visible) {
                    focusNextListItem(event.keyCode);
                } else if (!is_alignment_left) {
                    handleVisibility();
                }
                break;
            case 37: // Left arrow
            case 39: // Right Arrow
                if (is_alignment_left) handleVisibility();
                break;
            default:
        }

        // For char presses, we do a search for the item:
        if (event.key.length === 1 && list.length) {
            const char = event.key.toLowerCase();
            const item_starting_with_char = list.find(li => li.value && li.value[0].toLowerCase() === char);
            if (!item_starting_with_char) return;

            const item_ref = nodes.current.get(item_starting_with_char.value);
            if (item_ref) item_ref.focus();
        }
    };

    const focusNextListItem = direction => {
        const { activeElement } = document;

        if (activeElement.id === 'dropdown-display') {
            const el = Array.from(nodes.current.values())[0];
            if (el && el.focus instanceof Function) {
                el.focus();
            }
        } else {
            const active_node = nodes.current.get(activeElement.id);
            if (active_node) {
                if (direction === 40) {
                    const next_node = findNextFocusableNode(active_node.nextSibling);
                    if (next_node) next_node.focus();
                }
                if (direction === 38) {
                    const prev_node = findPreviousFocusableNode(active_node.previousSibling);
                    if (prev_node) prev_node.focus();
                }
            }
        }
    };

    // Upon render via css transition group, we use this as a callback to set the width/height of the dropdown list in the state
    const setListDimension = () =>
        setListDimensions([initial_offset || list_ref.current.offsetWidth, list_ref.current.offsetHeight]);

    const getDropDownAlignment = () => {
        if (is_alignment_left) return computed_offset_left();
        else if (is_alignment_top) return computed_offset_top();

        return null;
    };

    const DropdownItems = ({ items }) => (
        <Items
            onKeyPressed={onKeyPressed}
            className={classNameItems}
            handleSelect={handleSelect}
            has_symbol={has_symbol}
            items={items}
            name={name}
            is_align_text_left={is_align_text_left}
            value={value}
            nodes={nodes.current}
        />
    );

    React.useEffect(() => {
        if (initial_render.current) {
            initial_render.current = false;
        }
    }, []);

    return (
        <React.Fragment>
            <input
                className='dc-dropdown__inner'
                autoComplete='off'
                name={name}
                readOnly='readonly'
                type='hidden'
                value={value || 0}
            />
            <div ref={wrapper_ref} className={containerClassName()}>
                <div className='dc-dropdown__container'>
                    {label && (
                        <span
                            className={classNames('dc-dropdown__label', {
                                'dc-dropdown__label--clicked': is_list_visible,
                            })}
                        >
                            {label}
                        </span>
                    )}
                    <div
                        className={dropdownDisplayClassName()}
                        tabIndex={isSingleOption() ? '-1' : '0'}
                        onClick={handleVisibility}
                        onKeyDown={onKeyPressed}
                        id='dropdown-display'
                        ref={dropdown_ref}
                    >
                        <DisplayText
                            has_symbol={has_symbol}
                            name={name}
                            is_title={is_list_visible}
                            placeholder={placeholder}
                            value={value || 0}
                            list={list}
                            is_align_text_left={is_align_text_left}
                        />
                    </div>
                    {!isSingleOption() && (
                        <Icon
                            icon={is_alignment_left ? 'IcChevronLeft' : 'IcChevronDown'}
                            className={classNames('dc-dropdown__select-arrow', {
                                'dc-dropdown__select-arrow--left': is_alignment_left,
                                'dc-dropdown__select-arrow--up': is_list_visible,
                                'dc-dropdown__select-arrow--error': error || hint,
                            })}
                        />
                    )}
                    {error && <p className='dc-field--error'>{error}</p>}
                    {is_nativepicker ? (
                        <NativeSelect
                            ref={native_select_ref}
                            name={name}
                            value={value}
                            list={list}
                            onChange={onChange}
                        />
                    ) : (
                        <CSSTransition
                            in={is_list_visible}
                            timeout={100}
                            classNames={transitionClassName()}
                            onEntered={setListDimension}
                            unmountOnExit
                        >
                            <div className={dropdownListClassName()}>
                                <div
                                    className={listClassNames()}
                                    ref={list_ref}
                                    style={getDropDownAlignment()}
                                    aria-expanded={is_list_visible}
                                    role='list'
                                >
                                    <ThemedScrollbars height={list_dimensions[1] || '200px'}>
                                        {Array.isArray(list) ? (
                                            <DropdownItems items={list} />
                                        ) : (
                                            Object.keys(list).map((key, idx) => (
                                                <React.Fragment key={key}>
                                                    <div className={classNames('dc-list__label', classNameLabel)}>
                                                        {key}
                                                    </div>
                                                    <DropdownItems items={list[key]} />
                                                    {idx !== Object.keys(list).length - 1 && (
                                                        <span className='dc-list__separator' />
                                                    )}
                                                </React.Fragment>
                                            ))
                                        )}
                                    </ThemedScrollbars>
                                </div>
                            </div>
                        </CSSTransition>
                    )}
                </div>
                {!error && hint && <p className='dc-dropdown__hint'>{hint}</p>}
            </div>
        </React.Fragment>
    );
};

Dropdown.propTypes = {
    className: PropTypes.string,
    classNameDisplay: PropTypes.string,
    classNameItems: PropTypes.string,
    classNameLabel: PropTypes.string,
    disabled: PropTypes.bool,
    has_symbol: PropTypes.bool,
    initial_offset: PropTypes.number,
    is_alignment_left: PropTypes.bool,
    is_large: PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    is_nativepicker_visible: PropTypes.bool,
    label: PropTypes.string,
    list: listPropType(),
    list_height: PropTypes.string,
    name: PropTypes.string,
    no_border: PropTypes.bool,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Dropdown;
