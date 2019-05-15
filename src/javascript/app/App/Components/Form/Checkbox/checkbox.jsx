import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

class Checkbox extends React.PureComponent {
    onClick = () => {
        this.props.onClick(!this.props.value);
    };

    render() {
        const { value, label } = this.props;
        return (
            <div
                className='checkbox'
                onClick={this.onClick}
            >
                <div className={classNames('checkbox__box', {
                    'checkbox__box--active': value,
                })}
                />
                <div className='checkbox__label'>{label}</div>
            </div>
        );
    }
}

Checkbox.propTypes = {
    label: PropTypes.string,
    value: PropTypes.bool,
};

export default Checkbox;
