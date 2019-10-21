import classNames   from 'classnames';
import React        from 'react';
import PropTypes    from 'prop-types';
import Input        from '../input';
import DropdownList from '../dropdown-list';

// TODO: use-from-shared - Use this icon from icons' shared package
const IconArrow = ({ className, classNamePath }) => (
    <svg className={ classNames('inline-icon', className) } width='16' height='16'>
        <path
            className={ classNames(classNamePath, 'color1-fill') }
            fill='rgba(0, 0, 0, 0.8)'
            fillRule='nonzero'
            d='M13.164 5.13a.5.5 0 1 1 .672.74l-5.5 5a.5.5 0 0 1-.672 0l-5.5-5a.5.5 0 0 1 .672-.74L8 9.824l5.164-4.694z'
        />
    </svg>
);

const key_code_map = {
    enter: 13,
    escape: 27,
    tab: 9,
    keydown: 40,
    keyup: 38,
}
class Autocomplete extends React.PureComponent {
    list_ref      = React.createRef();
    list_item_ref = React.createRef();

    state = {
        should_show_list: false,
        filtered_items  : null,
        input_value     : '',
        active_index    : null,
    };

    setInputWrapperRef = (node) => this.input_wrapper_ref = node;

    onKeyPressed = (event) => {
        if (event.keyCode === key_code_map.enter) {
            event.preventDefault();
            this.hideDropdownList();
            this.onItemSelection(this.props.list_items[this.state.active_index]);
        }
        if (this.state.should_show_list && event.keyCode === key_code_map.tab) {
            this.hideDropdownList();
            this.onItemSelection(this.props.list_items[this.state.active_index]);
        }
        if (event.keyCode === key_code_map.escape) {
            this.setState({ should_show_list: false });
        }
        if (event.keyCode === key_code_map.keydown) {
            if (!this.state.should_show_list) {
                this.showDropdownList();
            }
            this.setActiveDown();
        }
        if (event.keyCode === key_code_map.keyup) {
            this.setActiveUp();
        }
    };

    setActiveUp = () => {
        const { active_index } = this.state;

        if (typeof active_index === 'number') {
            let next = active_index - 1;

            if (next <= 0) {
                this.setState({ active_index: this.props.list_items.length - 1 });
                this.list_ref.current.scrollToBottom();
            } else {
                const to = this.list_item_ref.current.offsetTop - 40;
                this.setState({ active_index: next });
                this.list_ref.current.scrollTop(to);
            }
        }
    }

    setActiveDown = () => {
        const { active_index } = this.state;

        if (active_index === null) {
            this.setState({ active_index: 0 });
        }

        if (typeof active_index === 'number') {
            const next = active_index + 1;

            if (this.list_ref.current) {
                if (next >= this.props.list_items.length) {
                    this.setState({ active_index: 0 });
                    this.list_ref.current.scrollTop();
                } else {
                    const to = this.list_item_ref.current.offsetTop + 40;
                    this.list_ref.current.scrollTop(to);
                    this.setState({ active_index: next });
                }
            }
        }
    }

    onBlur = (e) => {
        event.preventDefault();
        this.hideDropdownList();

        this.setState({
            filtered_items: this.props.list_items,
        });
        if (this.state.input_value === 'NaN' && typeof this.props.onItemSelection === 'function') {
            this.props.onItemSelection({
                text : 'No results found', // TODO: add localize
                value: '',
            });
        }
        if (typeof this.props.onBlur === 'function') {
            this.props.onBlur(e);
        }
    };

    onItemSelection = (item) => {
        this.setState({
            input_value: item.text ? item.text : item,
        }, () => {
            this.setState({
                filtered_items: this.props.list_items.filter(i => i.text === this.state.input_value),
            });
        });

        if (typeof this.props.onItemSelection === 'function') {
            this.props.onItemSelection(item);
        }
    };

    showDropdownList = () => {
        this.setState({ should_show_list: true });
    };

    hideDropdownList = () => {
        this.setState({ should_show_list: false });
    };

    get_filtered_items = val => {
        const is_string_array = this.props.list_items.length && typeof this.props.list_items[0] === 'string';
        const list = this.props.list_items.filter(item => (
            is_string_array ?
                item.toLowerCase().includes(val)
                : item.text.toLowerCase().includes(val)
        ));
        if (!list.length) {
            list.push({
                text : 'No results found', // TODO: add localize
                value: '',
            });
            this.setState({ input_value: 'NaN' });
        }
        return list;
    };

    filterList = (e) => {
        const val = e.target.value.toLowerCase();

        this.setState(
            {
                filtered_items: val ?
                    this.get_filtered_items(val)
                    : null,
            }
        );
    };

    render() {
        const {
            className,
            dropdown_offset,
            onItemSelection,
            value,
            list_items,
            autoComplete,
            ...otherProps
        } = this.props;

        return (
            <div className={ classNames('dc-autocomplete', className) }>
                <div ref={ this.setInputWrapperRef } className='dc-autocomplete__input-field'>
                    <Input
                        { ...otherProps }
                        className='dc-autocomplete__field'
                        autoComplete={autoComplete}
                        onKeyDown={this.onKeyPressed}
                        onFocus={(e) => this.showDropdownList(e) }
                        onInput={ this.filterList }
                        // Field's onBlur still needs to run to perform form functions such as validation
                        onBlur={ this.onBlur }
                        value={
                            // This allows us to let control of value externally (from <Form/>) or internally if used without form
                            typeof onItemSelection === 'function' ?
                                value
                                :
                                this.state.input_value
                        }
                        trailing_icon={
                            <IconArrow
                                className={ {
                                    'dc-autocomplete__trailing-icon'        : true,
                                    'dc-autocomplete__trailing-icon--opened': this.state.should_show_list,
                                } }
                            />
                        }
                    />
                </div>
                <DropdownList
                    ref={{ list_ref: this.list_ref, list_item_ref: this.list_item_ref }}
                    active_index={this.state.active_index}
                    style={ {
                        width    : this.input_wrapper_ref ? `${ this.input_wrapper_ref.offsetWidth }px` : '100%',
                        marginTop: dropdown_offset ? `calc(-${dropdown_offset} + 8px)` : '8px', // 4px is the standard margin. In case of error, the list should overlap the error
                        // TODO confirm placement of dropdown list and positioning of error
                        // marginTop: form.errors[field.name] ? 'calc(4px - 18px)' : '4px', // 4px is the standard margin. In case of error, the list should overlap the error
                    } }
                    is_visible={ this.state.should_show_list }
                    list_items={ this.state.filtered_items || list_items }
                    // Autocomplete must use the `text` property and not the `value`, however DropdownList provides access to both
                    onItemSelection={ this.onItemSelection }
                />
            </div>
        );
    }
}

export default Autocomplete;

Autocomplete.propTypes = {
    list_items: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(
            PropTypes.shape({
                text : PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })
        ),
    ]),
    onItemSelection: PropTypes.func,
};
