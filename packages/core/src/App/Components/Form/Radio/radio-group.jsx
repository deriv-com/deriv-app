import PropTypes from 'prop-types';
import React     from 'react';
import { Radio } from './radio.jsx';

class RadioGroup extends React.PureComponent {
    render() {
        const { selected, items } = this.props;
        return (
            <div className='radio-group'>
                {items.map((item, idx) => (
                    <Radio
                        key={idx}
                        value={item.value}
                        selected={selected === item.value}
                        onClick={this.props.onToggle}
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
