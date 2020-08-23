import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class RadioGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected_option: this.props.selected,
        };
    }

    onChange = e => {
        this.setState({
            selected_option: e.target.value,
        });
        this.props.onToggle(e);
    };

    render() {
        const { items, className, name, required } = this.props;

        return (
            <div className={classNames('dc-radio-group', className)}>
                {items.map((item, idx) => (
                    <label
                        key={idx}
                        className={classNames('dc-radio-group__item', className, {
                            'dc-radio-group__item--selected': this.state.selected_option === item.value,
                        })}
                    >
                        <input
                            id={item.id}
                            name={name}
                            className='dc-radio-group__input'
                            type='radio'
                            value={item.value}
                            checked={this.state.selected_option === item.value}
                            onChange={this.onChange}
                            disabled={item.disabled}
                            required={required}
                        />
                        <span
                            className={classNames('dc-radio-group__circle', {
                                'dc-radio-group__circle--selected': this.state.selected_option === item.value,
                            })}
                        />
                        <span className='dc-radio-group__label'>{item.label}</span>
                    </label>
                ))}
            </div>
        );
    }
}

RadioGroup.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.node.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        })
    ),
    onToggle: PropTypes.func,
    selected: PropTypes.any,
    required: PropTypes.bool,
};

export default RadioGroup;
