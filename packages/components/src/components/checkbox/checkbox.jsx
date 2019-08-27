import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

class Checkbox extends React.PureComponent {
    onClick = () => {
        this.props.onClick(!this.props.value);
    };

    render() {
        const { value, label, id } = this.props;
        return (
            <div
                id={id}
                className={classNames('dc-checkbox', this.props.className)}
                onClick={this.onClick}
            >
                <div className={classNames('dc-checkbox__box', {
                    'dc-checkbox__box--active': value,
                })}
                />
                <div className='dc-checkbox__label'>{label}</div>
            </div>
        );
    }
}

Checkbox.propTypes = {
    id   : PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.bool,
};

export default Checkbox;
