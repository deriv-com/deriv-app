import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

class RadioGroup extends React.Component {
    state = {
        selectedOption: this.props.defaultOption,
    };

    // componentDidUpdate(prevProps) {
    //     if (this.props.defaultChecked === prevProps.defaultChecked) {
    //         return;
    //     }

    //     this.setState({ checked: this.props.defaultChecked });
    // }

    onChange(e) {
        this.setState({
            selectedOption: e.target.value,
        });
        this.props.onToggle && this.props.onToggle(e);
    }

    render() {
        const { items, className, name } = this.props;

        return (
            <div className={classNames('dc-radio-group', className)}>
                {items.map((item, idx) => (
                    <label key={idx} className={classNames('dc-radio-group__item', className)}>
                        <input
                            id={item.id}
                            name={name}
                            className='dc-radio-group__input'
                            type='radio'
                            value={item.value}
                            checked={this.state.selectedOption === item.value}
                            onChange={e => {
                                this.onChange(e);
                            }}
                            disabled={item.disabled}
                        />
                        <span
                            className={classNames('dc-radio-group__circle', {
                                'dc-radio-group__circle--selected': this.state.selectedOption === item.value,
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
            value: PropTypes.bool.isRequired,
        })
    ),
    onToggle: PropTypes.func,
    defaultOption: PropTypes.any,
};

export default RadioGroup;
