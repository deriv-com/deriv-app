import classNames        from 'classnames';
import { isArrayLike }   from 'mobx';
import { observer }      from 'mobx-react';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import { Scrollbars }    from 'tt-react-custom-scrollbars';
import {
    Icon,
    IconArrow }          from 'Assets/Common';
import Items             from './items.jsx';
import NativeSelect      from './native-select.jsx';
import {
    getDisplayText,
    getItemFromValue,
    getValueFromIndex,
    getPrevIndex,
    getNextIndex }       from './helpers';

class Dropdown extends React.Component {
    list_ref = React.createRef();
    state = {
        curr_index     : getItemFromValue(this.props.list, this.props.value).number,
        is_list_visible: false,
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleSelect = (item) => {
        if (item.value !== this.props.value) {
            this.props.onChange({ target: { name: this.props.name, value: item.value } });
        }
        this.handleVisibility();
    }

    setWrapperRef = (node) => this.wrapper_ref = node;

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_list_visible) {
            this.setState({ is_list_visible: false });
        }
    }

    handleVisibility = () => {
        this.setState((state) =>({  is_list_visible: !state.is_list_visible }));
    }

    onKeyPressed = (event) => {
        if (this.is_single_option) return;
        if (event.keyCode === 9) { // Tab is pressed
            if (this.state.is_list_visible) {
                this.handleVisibility();
            }
            return;
        }
        event.preventDefault();
        const index = getItemFromValue(this.props.list, this.props.value);
        const value = getValueFromIndex(this.props.list, this.state.curr_index);
        const handleToggle = () => {
            if (this.state.is_list_visible && this.props.value !== value) {
                this.props.onChange({ target: { name: this.props.name, value } });
            }
            this.handleVisibility();
        };
        switch (event.keyCode) {
            case 13: // Enter is pressed
            case 32: // Space is pressed
                handleToggle();
                break;
            case 38: // Up Arrow is pressed
                if (this.state.is_list_visible) {
                    const prev_index = getPrevIndex(this.state.curr_index, index.length);
                    this.setState({ curr_index: prev_index });
                }
                break;
            case 40: // Down Arrow is pressed
                if (this.state.is_list_visible) {
                    const next_index = getNextIndex(this.state.curr_index, index.length);
                    this.setState({ curr_index: next_index });
                } else if (!this.props.is_alignment_left) {
                    this.handleVisibility();
                }
                break;
            case 37: // Left arrow is pressed
                if (!this.state.is_list_visible && this.props.is_alignment_left) {
                    this.handleVisibility();
                }
                break;
            case 39: // Right Arrow is pressed
                if (this.state.is_list_visible && this.props.is_alignment_left) {
                    this.handleVisibility();
                }
                break;
            default:
        }

        // For char presses, we do a search for the item:
        if (event.key.length === 1) {
            const char = event.key.toLowerCase();
            const firstChars = this.props.list.map(x => x.text[0].toLowerCase());
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
    }

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

        // we are calculating the offset for the dropdown list based on it's width here
        const left_alignment_style = {
            transform: `translate3d(calc(-${this.state.list_width}px - 12px), 0, 0px)`,
        };

        // upon render via css transition group, we use this as a callback to set the width of the dropdown list in the state
        const setListWidth = () => this.setState({ list_width: this.list_ref.current.offsetWidth });

        const is_single_option = isArrayLike(this.props.list) ?
            !!(this.props.list.length < 2)
            :
            !!(Object.keys(this.props.list).length < 2);

        return (
            <div
                ref={this.setWrapperRef}
                className={classNames('dropdown-container', this.props.className, {
                    'dropdown--left'    : this.props.is_alignment_left,
                    'dropdown--show'    : this.state.is_list_visible,
                    'dropdown--disabled': is_single_option,
                })}
            >
                <div
                    className={classNames('dropdown__display', this.props.classNameDisplay, {
                        'dropdown__display--clicked'   : this.state.is_list_visible,
                        'dropdown__display--has-symbol': this.props.has_symbol,
                    })}
                    tabIndex={is_single_option ? '-1' : '0'}
                    onClick={this.handleVisibility}
                    onKeyDown={this.onKeyPressed}
                >
                    {this.props.has_symbol &&
                    <span name={this.props.name} value={this.props.value} className={`symbols dropdown__display-symbol symbols--${(this.props.value || '').toLowerCase()}`} />
                    }
                    {!this.props.has_symbol &&
                    <span name={this.props.name} value={this.props.value} className='dropdown__display-text'>
                        {getDisplayText(this.props.list, this.props.value)}
                    </span>
                    }
                </div>
                {
                    !is_single_option && <Icon
                        icon={IconArrow}
                        className={classNames('dropdown__select-arrow', {
                            'dropdown__select-arrow--left': this.props.is_alignment_left,
                        })}
                    />
                }
                <CSSTransition
                    in={this.state.is_list_visible}
                    timeout={100}
                    classNames={{
                        enter    : `dropdown__list--enter ${this.props.is_alignment_left ? 'dropdown__list--left--enter' : ''}`,
                        enterDone: `dropdown__list--enter-done ${this.props.is_alignment_left ? 'dropdown__list--left--enter-done' : ''}`,
                        exit     : `dropdown__list--exit ${this.props.is_alignment_left ? 'dropdown__list--left--exit' : ''}`,
                    }}
                    onEntered={setListWidth}
                    unmountOnExit
                >
                    <div className={classNames('dropdown__list', {
                        'dropdown__list--left': this.props.is_alignment_left,
                    })}
                    >
                        <div
                            className={classNames('list', {
                                'list--left': this.props.is_alignment_left,
                            })}
                            ref={this.list_ref}
                            style={this.props.is_alignment_left ? left_alignment_style : undefined}
                        >
                            <Scrollbars
                                autoHeight
                                autoHide
                                autoHeightMax={200}
                                renderTrackHorizontal={props => <div {...props} className='track-horizontal' style={{ display: 'none' }} />}
                                renderThumbHorizontal={props => <div {...props} className='thumb-horizontal' style={{ display: 'none' }} />}
                            >
                                {isArrayLike(this.props.list) ?
                                    <Items
                                        handleSelect={this.handleSelect}
                                        has_symbol={this.props.has_symbol}
                                        items={this.props.list}
                                        name={this.props.name}
                                        value={this.props.value}
                                    /> :
                                    Object.keys(this.props.list).map(key => (
                                        <React.Fragment key={key}>
                                            <div className='list__label'>{key}</div>
                                            <Items
                                                handleSelect={this.handleSelect}
                                                has_symbol={this.props.has_symbol}
                                                items={this.props.list[key]}
                                                name={this.props.name}
                                                value={this.props.value}
                                            />
                                        </React.Fragment>
                                    ))
                                }
                            </Scrollbars>
                        </div>
                    </div>
                </CSSTransition>
            </div>
        );
    }
}

Dropdown.propTypes = {
    className        : PropTypes.string,
    classNameDisplay : PropTypes.string,
    has_symbol       : PropTypes.bool,
    is_alignment_left: PropTypes.bool,
    is_nativepicker  : PropTypes.bool,
    list             : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    name    : PropTypes.string,
    onChange: PropTypes.func,
    value   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default observer(Dropdown);
