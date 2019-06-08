import PropTypes from 'prop-types';
import React     from 'react';
import Localize  from 'App/Components/Elements/localize.jsx';
import { Radio } from './radio.jsx';

class RadioGroup extends React.PureComponent {
    render() {
        const { selected, items } = this.props;
        return (
            <div className='radio-group'>
                {items.map(item => (
                    <Radio
                        key={item.label}
                        value={item.value}
                        selected={selected === item.value}
                        onClick={this.props.onToggle}
                    >
                        {item.label && <Localize str={item.label} /> /* TODO: i18n_issue */}
                    </Radio>
                ))}
            </div>
        );
    }
}

RadioGroup.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.bool.isRequired,
        })
    ),
    onToggle: PropTypes.func,
    selected: PropTypes.bool,
};

export default RadioGroup;
