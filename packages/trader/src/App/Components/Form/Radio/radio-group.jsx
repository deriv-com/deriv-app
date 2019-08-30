import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import { Radio }  from './radio.jsx';

class RadioGroup extends React.PureComponent {
    render() {
        const {
            className,
            items,
            onToggle,
            selected,
        } = this.props;

        return (
            <div className={classNames('radio-group', className)}>
                {items.map((item, idx) => (
                    <Radio
                        key={idx}
                        id={item.id}
                        value={item.value}
                        selected={selected === item.value}
                        onClick={onToggle}
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
