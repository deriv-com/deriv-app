import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import Radio      from './radio.jsx';

class RadioGroup extends React.PureComponent {
    render() {
        const { selected, items, className } = this.props;
        return (
            <div className={ classNames('dc-radio-group', className) }>
                {items.map((item, idx) => (
                    <Radio
                        key={idx}
                        id={item.id}
                        value={item.value}
                        defaultChecked={item.value === selected}
                        onChange={this.props.onToggle}
                        className={item.className}
                        name={this.props.name}
                        disabled={item.disabled}
                    >
                        {item.label}
                    </Radio>
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
    selected: PropTypes.bool,
};

export default RadioGroup;
