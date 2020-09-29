import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';
import Input from '../input';
import DropdownList from '../dropdown-list';

const KEY_CODE = {
    ENTER: 13,
    ESCAPE: 27,
    TAB: 9,
    KEYDOWN: 40,
    KEYUP: 38,
};

const getFilteredItems = (val, list) => {
    const is_string_array = list.length && typeof list[0] === 'string';

    return list.filter(item =>
        is_string_array ? item.toLowerCase().includes(val) : item.text.toLowerCase().includes(val)
    );
};
class Autocomplete extends React.PureComponent {
    dropdown_ref = React.createRef();
    list_wrapper_ref = React.createRef();
    list_item_ref = React.createRef();
    scroll_timeout = null;
    scrollTopPos = null;

    state = {
        should_show_list: false,
        filtered_items: [...this.props.list_items],
        input_value: '',
        active_index: null,
    };

    componentDidUpdate(prev_props) {
        if (prev_props.list_items !== this.props.list_items) {
            this.setState({
                input_value: '',
                active_index: null,
                filtered_items: this.props.list_items,
            });
        }
    }

    handleScrollStop = e => {
        // pass onScrollStop func callback when scrolling stops
        if (typeof this.props.onScrollStop !== 'function') return;
        const element = e.target;
        this.scrollTopPos = element.scrollTop;
        if (this.scrollTopPos === element.scrollTop) {
            clearTimeout(this.scroll_timeout);
        }
        this.scroll_timeout = setTimeout(() => {
            this.props.onScrollStop();
        }, 150);
    };

    setInputWrapperRef = node => (this.input_wrapper_ref = node);

    onKeyPressed = event => {
        const { active_index, filtered_items, should_show_list } = this.state;

        switch (event.keyCode) {
            case KEY_CODE.ENTER:
                event.preventDefault();
                this.hideDropdownList();
                this.onItemSelection(filtered_items[active_index]);
                break;
            case KEY_CODE.TAB:
                if (should_show_list) {
                    this.hideDropdownList();
                    this.onItemSelection(filtered_items[active_index]);
                }
                break;
            case KEY_CODE.ESCAPE:
                event.preventDefault();
                this.hideDropdownList();
                break;
            case KEY_CODE.KEYDOWN:
                if (!should_show_list) this.showDropdownList();
                this.setActiveDown();
                break;
            case KEY_CODE.KEYUP:
                if (!should_show_list) this.showDropdownList();
                else this.setActiveUp();
                break;
            default:
                if (!should_show_list) this.showDropdownList();
                break;
        }
    };

    setActiveIndex = index => this.setState({ active_index: index });

    setActiveUp = () => {
        const { active_index, filtered_items } = this.state;

        if (typeof active_index === 'number') {
            const up = active_index - 1;
            const should_scroll_to_last = up < 0;

            if (should_scroll_to_last) {
                const list_height = this.dropdown_ref.current.clientHeight;
                this.setState({ active_index: filtered_items.length - 1 });
                this.dropdown_ref.current.scrollTo({ top: list_height, behavior: 'smooth' });
            } else {
                const item_height = this.list_item_ref.current.getBoundingClientRect().height;
                const item_top = Math.floor(this.list_item_ref.current.getBoundingClientRect().top) - item_height;

                if (!this.isListItemWithinView(item_top)) {
                    const top_of_list = this.list_item_ref.current.offsetTop - item_height;
                    this.dropdown_ref.current.scrollTo({ top: top_of_list, behavior: 'smooth' });
                }
                this.setState({ active_index: up });
            }
        }
    };

    isListItemWithinView(item_top) {
        const list_height = this.dropdown_ref.current.clientHeight;
        const wrapper_top = Math.floor(this.list_wrapper_ref.current.getBoundingClientRect().top);
        const wrapper_bottom = Math.floor(this.list_wrapper_ref.current.getBoundingClientRect().top) + list_height;

        if (item_top >= wrapper_bottom) return false;
        return item_top > wrapper_top;
    }

    setActiveDown = () => {
        const { active_index, filtered_items } = this.state;

        if (active_index === null || !this.list_item_ref.current) {
            this.setState({ active_index: 0 });
        } else if (typeof active_index === 'number') {
            const down = active_index + 1;
            const should_scroll_to_first = down >= filtered_items.length;

            if (should_scroll_to_first) {
                this.setState({ active_index: 0 });
                this.dropdown_ref.current.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const item_height = this.list_item_ref.current.getBoundingClientRect().height;
                const item_top =
                    Math.floor(this.list_item_ref.current.getBoundingClientRect().top) + item_height + item_height / 2;
                const list_height = this.dropdown_ref.current.clientHeight;

                if (!this.isListItemWithinView(item_top)) {
                    const items_above = list_height / item_height - 2;
                    const bottom_of_list = this.list_item_ref.current.offsetTop - items_above * item_height;
                    this.dropdown_ref.current.scrollTo({ top: bottom_of_list, behavior: 'smooth' });
                }
                this.setState({ active_index: down });
            }
        }
    };

    onBlur = e => {
        e.preventDefault();
        this.hideDropdownList();

        this.setState({ filtered_items: this.props.list_items });

        if (this.state.input_value === '' && typeof this.props.onItemSelection === 'function') {
            this.props.onItemSelection({
                text: this.props.not_found_text,
                value: '',
            });
        }
        if (typeof this.props.onBlur === 'function') {
            this.props.onBlur(e);
        }
    };

    onItemSelection = item => {
        if (!item) return;

        this.setState({ input_value: item.text ? item.text : item });

        if (typeof this.props.onItemSelection === 'function') {
            this.props.onItemSelection(item);
        }
    };

    showDropdownList = () =>
        this.setState({ should_show_list: true }, () => {
            if (this.state.active_index && this.list_item_ref.current) {
                const item = this.list_item_ref.current.offsetTop;
                this.dropdown_ref.current.scrollTo({ top: item, behavior: 'smooth' });
            }
        });

    hideDropdownList = () => {
        this.setState({ should_show_list: false });

        if (typeof this.props.onHideDropdownList === 'function') {
            this.props.onHideDropdownList();
        }
    };

    filterList = e => {
        const val = e.target.value.toLowerCase();
        const filtered_items = getFilteredItems(val, this.props.list_items);

        if (!filtered_items.length) {
            this.setState({ input_value: '' });
        }
        this.setState({ filtered_items });
    };

    render() {
        const {
            className,
            dropdown_offset,
            onItemSelection,
            value,
            list_items,
            autoComplete,
            onHideDropdownList,
            onScrollStop,
            ...otherProps
        } = this.props;

        return (
            <div className={classNames('dc-autocomplete', className)}>
                <div ref={this.setInputWrapperRef} className='dc-autocomplete__input-field'>
                    <Input
                        {...otherProps}
                        className='dc-autocomplete__field'
                        autoComplete={autoComplete}
                        onKeyDown={this.onKeyPressed}
                        onInput={this.filterList}
                        onClick={() => {
                            if (this.state.should_show_list) this.hideDropdownList();
                            else this.showDropdownList();
                        }}
                        // Field's onBlur still needs to run to perform form functions such as validation
                        onBlur={this.onBlur}
                        value={
                            // This allows us to let control of value externally (from <Form/>) or internally if used without form
                            typeof onItemSelection === 'function' ? value : this.state.input_value
                        }
                        trailing_icon={
                            <Icon
                                icon='IcChevronDown'
                                className={{
                                    'dc-autocomplete__trailing-icon': true,
                                    'dc-autocomplete__trailing-icon--opened': this.state.should_show_list,
                                    'dc-autocomplete__trailing-icon--disabled': otherProps.disabled,
                                }}
                            />
                        }
                    />
                </div>
                <DropdownList
                    ref={{
                        dropdown_ref: this.dropdown_ref,
                        list_item_ref: this.list_item_ref,
                        list_wrapper_ref: this.list_wrapper_ref,
                    }}
                    active_index={this.state.active_index}
                    style={{
                        width: this.input_wrapper_ref ? `${this.input_wrapper_ref.offsetWidth}px` : '100%',
                        marginTop: dropdown_offset ? `calc(-${dropdown_offset} + 8px)` : '8px', // 4px is the standard margin. In case of error, the list should overlap the error
                        // TODO confirm placement of dropdown list and positioning of error
                        // marginTop: form.errors[field.name] ? 'calc(4px - 18px)' : '4px', // 4px is the standard margin. In case of error, the list should overlap the error
                    }}
                    is_visible={this.state.should_show_list}
                    list_items={this.state.filtered_items}
                    list_height={this.props.list_height}
                    // Autocomplete must use the `text` property and not the `value`, however DropdownList provides access to both
                    onItemSelection={this.onItemSelection}
                    setActiveIndex={this.setActiveIndex}
                    onScrollStop={this.handleScrollStop}
                    not_found_text={this.props.not_found_text}
                />
            </div>
        );
    }
}
Autocomplete.defaultProps = {
    not_found_text: 'No results found',
};

export default Autocomplete;

Autocomplete.propTypes = {
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
};
