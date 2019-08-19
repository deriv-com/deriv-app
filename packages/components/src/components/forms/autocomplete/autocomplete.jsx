import React        from 'react';
import { Field }    from 'formik'
import Input        from '../input';
import DropdownList from '../../dropdown-list';
import                   './autocomplete.scss';

class Autocomplete extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            should_show_list: false,
        };
    }

    toggleDropdownList = () => {
        this.setState(
            (prev_state) => ({ should_show_list: !prev_state.should_show_list })
        );
    };

    onItemSelection = (item) => {
        console.log('Selected ', item);
    };

    handleInputRef = (ref) => {
        console.log('Ref ', ref);
        this.input_ref = ref;
    };

    render() {
        // const TrailingIcon = props.trailing_icon;

        return (
            <Field { ...this.props }>
                {
                    ({ field }) => (
                        <div className='dc-autocomplete'>
                            <Input
                                { ...field }
                                { ...this.props }
                                className='dc-autocomplete__field'
                                onFocus={this.toggleDropdownList}
                                onBlur={this.toggleDropdownList}
                                trailing_icon={
                                    React.cloneElement(
                                        this.props.trailing_icon,
                                        { className: 'dc-autocomplete__trailing-icon' },
                                    )
                                }
                            />
                            <DropdownList
                                // style={{ width: this.input_ref.current }}
                                is_visible={this.state.should_show_list}
                                list_items={ this.props.list_items }
                                onItemSelection={this.onItemSelection}
                            />
                        </div>
                    )
                }
            </Field>
        );
    }
}

export default Autocomplete;
