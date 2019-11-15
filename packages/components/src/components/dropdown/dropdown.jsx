import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import ThemedScrollbars  from 'Components/themed-scrollbars';
import Icon              from 'Components/icon-arrow.jsx';
import {
    getItemFromValue,
    getValueFromIndex,
    getPrevIndex,
    getNextIndex,
    listPropType,
}                        from './dropdown';
import Items             from './items.jsx';
import NativeSelect      from './native-select.jsx';
import DisplayText       from './display-text.jsx';

class Dropdown extends React.Component {
    list_ref = React.createRef();

    state = {
        curr_index     : 0,
        is_list_visible: false,
        list_height    : 0,
        list_width     : 0,
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
        return Array.isArray(this.props.list) ?
            (this.props.list.length < 2) :
            // object has less than two props or inner object has less than two props
            (Object.keys(this.props.list).length &&
                Object.keys(this.props.list).length < 2 && this.props.list[Object.keys(this.props.list)[0]].length < 2);
    }

    get container_class_name() {
        return classNames('dc-dropdown-container',
            this.props.className, {
                'dc-dropdown--has-placeholder': this.props.placeholder,
                'dc-dropdown--left'           : this.props.is_alignment_left,
                'dc-dropdown--show'           : this.state.is_list_visible,
                'dc-dropdown--disabled'       : this.is_single_option,
            },
        );
    }

    get dropdown_display_class_name() {
        return classNames('dc-dropdown__display',
            this.props.classNameDisplay, {
                'dc-dropdown__display--clicked'     : this.state.is_list_visible,
                'dc-dropdown__display--has-symbol'  : this.props.has_symbol,
                'dc-dropdown__display--no-border'   : this.props.no_border,
                'dc-dropdown__display--is-left-text': this.props.is_align_text_left,
            },
        );
    }

    get dropdown_list_class_names() {
        return classNames('dc-dropdown__list', {
            'dc-dropdown__list--left': this.props.is_alignment_left,
            'dc-dropdown__list--top' : this.props.is_alignment_top,
        });
    }

    get list_class_names() {
        return classNames('dc-list', {
            'dc-list--left': this.props.is_alignment_left,
        });
    }

    get transition_class_names() {
        return {
            enter: `dc-dropdown__list--enter${this.props.is_alignment_left
                ? ' dc-dropdown__list--left--enter'
                : ''}`,
            enterDone: `dc-dropdown__list--enter-done${this.props.is_alignment_left
                ? ' dc-dropdown__list--left--enter-done'
                : ''}`,
            exit: `dc-dropdown__list--exit${this.props.is_alignment_left
                ? ' dc-dropdown__list--left--exit'
                : ''}`,
        };
    }

    componentDidMount() {
        this.updateSelected(this.props.value);
        document.addEventListener(
            'mousedown',
            this.handleClickOutside,
            {
                passive: true,
            },
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.updateSelected(this.props.value);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleSelect = (item) => {
        if (item.value !== this.props.value) {
            this.props.onChange(
                { target: { name: this.props.name, value: item.value } });
            this.updateSelected(item.value);
        }
        this.handleVisibility();
    };

    updateSelected(value) {
        this.setState({ curr_index: getItemFromValue(this.props.list, value).number });
    }

    setWrapperRef = (node) => this.wrapper_ref = node;

    handleClickOutside = (event) => {
        if (
            this.wrapper_ref && !this.wrapper_ref.contains(event.target) &&
            this.state.is_list_visible
        ) {
            if (typeof this.props.handleBlur === 'function') {
                this.props.handleBlur({ target: { name: this.props.name } });
            }
            this.setState({ is_list_visible: false });
        }
    };

    handleVisibility = () => {
        this.setState((state) => ({ is_list_visible: !state.is_list_visible }));
    };

    handleToggle = (value) => {
        if (this.state.is_list_visible && this.props.value !== value) {
            this.props.onChange(
                { target: { name: this.props.name, value } });
        }
        this.handleVisibility();
    };

    onKeyPressed = (event) => {
        if (this.is_single_option) return;
        if (event.keyCode === 9) { // Tab is pressed
            if (this.state.is_list_visible) {
                this.handleVisibility();
            }
            return;
        }
        event.preventDefault();
        const index = this.props.value ? getItemFromValue(this.props.list, this.props.value) : 0;
        const value = this.props.value ? getValueFromIndex(this.props.list, this.state.curr_index) : null;

        switch (event.keyCode) {
            case 13: // Enter is pressed
            case 32: // Space is pressed
                if (value) this.handleToggle(value);
                break;
            case 38: // Up Arrow is pressed
                if (this.state.is_list_visible) {
                    const prev_index = getPrevIndex(
                        this.state.curr_index,
                        index.length,
                    );
                    this.setState({ curr_index: prev_index });
                }
                break;
            case 40: // Down Arrow is pressed
                if (this.state.is_list_visible) {
                    const next_index = getNextIndex(
                        this.state.curr_index,
                        index.length,
                    );
                    this.setState({ curr_index: next_index });
                } else if (!this.props.is_alignment_left) {
                    this.handleVisibility();
                }
                break;
            case 37: // Left arrow is pressed
                if (!this.state.is_list_visible &&
                    this.props.is_alignment_left) {
                    this.handleVisibility();
                }
                break;
            case 39: // Right Arrow is pressed
                if (this.state.is_list_visible &&
                    this.props.is_alignment_left) {
                    this.handleVisibility();
                }
                break;
            default:
        }

        // For char presses, we do a search for the item:
        if (event.key.length === 1 && this.props.list.length) {
            const char       = event.key.toLowerCase();
            const firstChars = this.props.list.map(
                x => typeof x === 'string' && x.text[0].toLowerCase());
            let idx;
            // Tapping the same character again jumps to the next match:
            if (this.state.curr_index) {
                idx = firstChars.indexOf(char, this.state.curr_index + 1);
            }
            if (idx === undefined || idx === -1) {
                idx = firstChars.indexOf(char);
            }
            if (idx >= 0) {
                this.setState({ curr_index: idx });
            }
        }
    };

    // Upon render via css transition group, we use this as a callback to set the width/height of the dropdown list in the state
    setListDimension = () => this.setState({
        list_width : this.list_ref.current.offsetWidth,
        list_height: this.list_ref.current.offsetHeight,
    });

    render() {
        if (this.props.is_nativepicker) {
            return (
                <NativeSelect
                    name={this.props.name}
                    value={this.props.value}
                    list={this.props.list}
                    onChange={this.props.onChange}
                />
            );
        }
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
                <div
                    ref={this.setWrapperRef}
                    className={this.container_class_name}
                >
                    {this.props.label &&
                        <span className={classNames('dc-dropdown__label', { 'dc-dropdown__label--clicked': this.state.is_list_visible })}>
                            {this.props.label}
                        </span>
                    }
                    <div
                        className={this.dropdown_display_class_name}
                        tabIndex={this.is_single_option ? '-1' : '0'}
                        onClick={this.handleVisibility}
                        onKeyDown={this.onKeyPressed}
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
                    {
                        !this.is_single_option && <Icon
                            icon='IconArrow'
                            className={classNames('dc-dropdown__select-arrow', {
                                'dc-dropdown__select-arrow--left': this.props.is_alignment_left,
                            })}
                        />
                    }
                    {this.props.error &&
                        <p className='dc-field-error'>{this.props.error}</p>
                    }
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
                            >
                                <ThemedScrollbars
                                    autoHeight
                                    autoHide
                                    autoHeightMax={200}
                                    renderTrackHorizontal={props => <div
                                        {...props}
                                        style={{ display: 'none' }}
                                    />}
                                    renderThumbHorizontal={props => <div
                                        {...props}
                                        style={{ display: 'none' }}
                                    />}
                                >
                                    {Array.isArray(this.props.list) ?
                                        <Items
                                            className={this.props.classNameItems}
                                            index={this.state.curr_index}
                                            handleSelect={this.handleSelect}
                                            has_symbol={this.props.has_symbol}
                                            items={this.props.list}
                                            name={this.props.name}
                                            is_align_text_left={this.props.is_align_text_left}
                                            value={this.props.value}
                                        /> :
                                        Object.keys(this.props.list).map((key, idx) => (
                                            <React.Fragment key={key}>
                                                <div className={classNames('dc-list__label', this.props.classNameLabel)}>{key}</div>
                                                <Items
                                                    className={this.props.classNameItems}
                                                    handleSelect={this.handleSelect}
                                                    has_symbol={this.props.has_symbol}
                                                    items={this.props.list[key]}
                                                    name={this.props.name}
                                                    is_align_text_left={this.props.is_align_text_left}
                                                    value={this.props.value}
                                                />
                                                {idx !== Object.keys(this.props.list).length - 1 &&
                                                    <span className='dc-list__separator' />
                                                }
                                            </React.Fragment>
                                        ))
                                    }
                                </ThemedScrollbars>
                            </div>
                        </div>
                    </CSSTransition>
                </div>
            </React.Fragment>
        );
    }

}

Dropdown.propTypes = {
    className        : PropTypes.string,
    classNameDisplay : PropTypes.string,
    classNameItems   : PropTypes.string,
    classNameLabel   : PropTypes.string,
    has_symbol       : PropTypes.bool,
    is_alignment_left: PropTypes.bool,
    is_nativepicker  : PropTypes.bool,
    label            : PropTypes.string,
    list             : listPropType(),
    name             : PropTypes.string,
    no_border        : PropTypes.bool,
    onChange         : PropTypes.func,
    placeholder      : PropTypes.string,
    value            : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Dropdown;
