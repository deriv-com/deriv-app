import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { mobileOSDetect } from '@deriv/shared/utils/os';
import { listPropType, findNextFocusableNode, findPreviousFocusableNode } from './dropdown';
import Items from './items.jsx';
import NativeSelect from './native-select.jsx';
import DisplayText from './display-text.jsx';
import ThemedScrollbars from '../themed-scrollbars/themed-scrollbars.jsx';
import Icon from '../icon';

class Dropdown extends React.Component {
    dropdown_ref = React.createRef();
    list_ref = React.createRef();
    native_select_ref = React.createRef();
    nodes = new Map();

    state = {
        is_list_visible: !!this.props.is_nativepicker_visible,
        list_height: 0,
        list_width: 0,
    };

    /**
     * Calculate the offset for the dropdown list based on its width
     *
     * @return {{transform: string}}
     */
    get computed_offset_left() {
        return {
            transform: `translate3d(calc(-${this.state.list_width}px - 12px), 0, 0px)`,
        };
    }

    /**
     * Calculate the offset for the dropdown list based on its height
     *
     * @return {{transform: string}}
     */
    get computed_offset_top() {
        return {
            transform: `translate3d(0, calc(-${this.state.list_height}px - 16px), 0px)`,
        };
    }

    get is_single_option() {
        return Array.isArray(this.props.list)
            ? this.props.list.length < 2
            : // object has less than two props or inner object has less than two props
              Object.keys(this.props.list).length &&
                  Object.keys(this.props.list).length < 2 &&
                  this.props.list[Object.keys(this.props.list)[0]].length < 2;
    }

    get container_class_name() {
        return classNames('dc-dropdown-container', this.props.className, {
            'dc-dropdown--has-placeholder': this.props.placeholder,
            'dc-dropdown--left': this.props.is_alignment_left,
            'dc-dropdown--show': this.state.is_list_visible,
            'dc-dropdown--disabled': this.is_single_option || this.props.disabled,
        });
    }

    get dropdown_display_class_name() {
        return classNames('dc-dropdown__display', this.props.classNameDisplay, {
            'dc-dropdown__display--clicked': this.state.is_list_visible,
            'dc-dropdown__display--has-symbol': this.props.has_symbol,
            'dc-dropdown__display--no-border': this.props.no_border,
            'dc-dropdown__display--is-left-text': this.props.is_align_text_left,
        });
    }

    get dropdown_list_class_names() {
        return classNames('dc-dropdown__list', {
            'dc-dropdown__list--left': this.props.is_alignment_left,
            'dc-dropdown__list--top': this.props.is_alignment_top,
        });
    }

    get list_class_names() {
        return classNames('dc-list', {
            'dc-list--left': this.props.is_alignment_left,
            'dc-list--large': this.props.is_large,
        });
    }

    get transition_class_names() {
        return {
            enter: `dc-dropdown__list--enter${this.props.is_alignment_left ? ' dc-dropdown__list--left--enter' : ''}`,
            enterDone: `dc-dropdown__list--enter-done${
                this.props.is_alignment_left ? ' dc-dropdown__list--left--enter-done' : ''
            }`,
            exit: `dc-dropdown__list--exit${this.props.is_alignment_left ? ' dc-dropdown__list--left--exit' : ''}`,
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside, {
            passive: true,
        });
    }

    componentDidUpdate() {
        if (this.props.is_nativepicker && !this.props.is_nativepicker_visible && this.state.is_list_visible) {
            this.setState({ is_list_visible: false });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleSelect = item => {
        if (item.value !== this.props.value) {
            this.props.onChange({
                target: { name: this.props.name, value: item.value },
            });
        }
        this.handleVisibility();
        this.dropdown_ref.current.focus();
    };

    setWrapperRef = node => (this.wrapper_ref = node);

    handleClickOutside = event => {
        const path = event.path ?? event.composedPath?.();
        if (
            this.wrapper_ref &&
            (!this.wrapper_ref.contains(event.target) && !this.wrapper_ref.contains(path[0])) && // When component is isolated (e.g, iframe, shadow DOM) event.target refers to whole container not the component. path[0] is the node that the event originated from, it does not need to walk the array
            this.state.is_list_visible
        ) {
            if (typeof this.props.handleBlur === 'function') {
                this.props.handleBlur({ target: { name: this.props.name } });
            }
            this.setState({ is_list_visible: false });
        }
    };

    handleVisibility = () => {
        if (this.props.is_nativepicker && !this.state.is_list_visible) {
            if (mobileOSDetect() === 'iOS') {
                /* .focus() doesn't trigger open <select /> in Android :(
                 * so we use a CSS hack - refer to L237 in dropdown.scss
                 * [TODO]: find alternative solution to trigger open <select /> with JS
                 */
                this.native_select_ref.current.focus();
            }
            this.setState({ is_list_visible: true });
        } else {
            this.setState(
                state => ({ is_list_visible: !state.is_list_visible }),
                () => {
                    if (!this.state.is_list_visible) this.dropdown_ref.current.focus();
                }
            );
        }
    };

    onKeyPressed = (event, item) => {
        if (this.is_single_option) return;

        // Tab -> before preventDefault() to be able to go to the next tabIndex
        if (event.keyCode === 9 && !this.state.is_list_visible) return;

        event.preventDefault();
        event.stopPropagation();

        switch (event.keyCode) {
            case 27: // esc
                if (this.state.is_list_visible) this.handleVisibility();
                break;
            case 9: // Tab
            case 13: // Enter
            case 32: // Space
                if (!item) return;
                this.handleSelect(item);
                break;
            case 38: // Up Arrow
            case 40: // Down Arrow
                if (this.state.is_list_visible) {
                    this.focusNextListItem(event.keyCode);
                } else if (!this.props.is_alignment_left) {
                    this.handleVisibility();
                }
                break;
            case 37: // Left arrow
            case 39: // Right Arrow
                if (this.props.is_alignment_left) {
                    this.handleVisibility();
                }
                break;
            default:
        }

        // For char presses, we do a search for the item:
        if (event.key.length === 1 && this.props.list.length) {
            const char = event.key.toLowerCase();
            const item_starting_with_char = this.props.list.find(li => li.value && li.value[0].toLowerCase() === char);
            if (!item_starting_with_char) return;

            const item_ref = this.nodes.get(item_starting_with_char.value);
            if (item_ref) item_ref.focus();
        }
    };

    focusNextListItem = direction => {
        const active_element = document.activeElement;

        if (active_element.id === 'dropdown-display') {
            Array.from(this.nodes.values())[0].focus();
        } else {
            const active_node = this.nodes.get(active_element.id);
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
    setListDimension = () =>
        this.setState({
            list_width: this.list_ref.current.offsetWidth,
            list_height: this.list_ref.current.offsetHeight,
        });

    render() {
        const getDropDownAlignment = () => {
            if (this.props.is_alignment_left) return this.computed_offset_left;
            else if (this.props.is_alignment_top) return this.computed_offset_top;
            return null;
        };
        return (
            <React.Fragment>
                <input
                    className='dc-dropdown__inner'
                    autoComplete='off'
                    name={this.props.name}
                    readOnly='readonly'
                    type='hidden'
                    value={this.props.value || 0}
                />
                <div ref={this.setWrapperRef} className={this.container_class_name}>
                    <div className='dc-dropdown__container'>
                        {this.props.label && (
                            <span
                                className={classNames('dc-dropdown__label', {
                                    'dc-dropdown__label--clicked': this.state.is_list_visible,
                                })}
                            >
                                {this.props.label}
                            </span>
                        )}
                        <div
                            className={this.dropdown_display_class_name}
                            tabIndex={this.is_single_option ? '-1' : '0'}
                            onClick={this.handleVisibility}
                            onKeyDown={this.onKeyPressed}
                            id='dropdown-display'
                            ref={this.dropdown_ref}
                        >
                            <DisplayText
                                has_symbol={this.props.has_symbol}
                                name={this.props.name}
                                is_title={this.state.is_list_visible}
                                placeholder={this.props.placeholder}
                                value={this.props.value || 0}
                                list={this.props.list}
                                is_align_text_left={this.props.is_align_text_left}
                            />
                        </div>
                        {!this.is_single_option && (
                            <Icon
                                icon={this.props.is_alignment_left ? 'IcChevronLeft' : 'IcChevronDown'}
                                className={classNames('dc-dropdown__select-arrow', {
                                    'dc-dropdown__select-arrow--left': this.props.is_alignment_left,
                                    'dc-dropdown__select-arrow--up': this.state.is_list_visible,
                                })}
                            />
                        )}
                        {this.props.error && <p className='dc-field-error'>{this.props.error}</p>}
                        {this.props.is_nativepicker ? (
                            <NativeSelect
                                ref={this.native_select_ref}
                                name={this.props.name}
                                value={this.props.value}
                                list={this.props.list}
                                onChange={this.props.onChange}
                            />
                        ) : (
                            <CSSTransition
                                in={this.state.is_list_visible}
                                timeout={100}
                                classNames={this.transition_class_names}
                                onEntered={this.setListDimension}
                                unmountOnExit
                            >
                                <div className={this.dropdown_list_class_names}>
                                    <div
                                        className={this.list_class_names}
                                        ref={this.list_ref}
                                        style={getDropDownAlignment()}
                                        aria-expanded={this.state.is_list_visible}
                                        role='list'
                                    >
                                        <ThemedScrollbars height={this.props.list_height || '200px'}>
                                            {Array.isArray(this.props.list) ? (
                                                <Items
                                                    onKeyPressed={this.onKeyPressed}
                                                    className={this.props.classNameItems}
                                                    handleSelect={this.handleSelect}
                                                    has_symbol={this.props.has_symbol}
                                                    items={this.props.list}
                                                    name={this.props.name}
                                                    is_align_text_left={this.props.is_align_text_left}
                                                    value={this.props.value}
                                                    nodes={this.nodes}
                                                />
                                            ) : (
                                                Object.keys(this.props.list).map((key, idx) => (
                                                    <React.Fragment key={key}>
                                                        <div
                                                            className={classNames(
                                                                'dc-list__label',
                                                                this.props.classNameLabel
                                                            )}
                                                        >
                                                            {key}
                                                        </div>
                                                        <Items
                                                            onKeyPressed={this.onKeyPressed}
                                                            className={this.props.classNameItems}
                                                            handleSelect={this.handleSelect}
                                                            has_symbol={this.props.has_symbol}
                                                            items={this.props.list[key]}
                                                            name={this.props.name}
                                                            is_align_text_left={this.props.is_align_text_left}
                                                            value={this.props.value}
                                                            nodes={this.nodes}
                                                        />
                                                        {idx !== Object.keys(this.props.list).length - 1 && (
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
                    {!this.props.error && this.props.hint && <p className='dc-dropdown__hint'>{this.props.hint}</p>}
                </div>
            </React.Fragment>
        );
    }
}

Dropdown.propTypes = {
    className: PropTypes.string,
    classNameDisplay: PropTypes.string,
    classNameItems: PropTypes.string,
    classNameLabel: PropTypes.string,
    disabled: PropTypes.bool,
    has_symbol: PropTypes.bool,
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
