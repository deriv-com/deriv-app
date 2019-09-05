import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { IconCheckmark } from 'Components/icon';

class Checkbox extends React.PureComponent {
    onClick = () => {
        this.props.onClick(!this.props.value);
    };

    render() {
        const {
            className,
            classNameLabel,
            id,
            label,
            value,
        } = this.props;
        return (
            <div
                id={id}
                className={classNames('dc-checkbox', className)}
                onClick={this.onClick}
            >
                <div className={classNames('dc-checkbox__box', {
                    'dc-checkbox__box--active': value,
                })}
                >
                    { !!value && <IconCheckmark /> }
                </div>
                <div className={classNames('dc-checkbox__label', classNameLabel)}>{label}</div>
            </div>
        );
    }
}

Checkbox.propTypes = {
    className     : PropTypes.string,
    classNameLabel: PropTypes.string,
    id            : PropTypes.string,
    label         : PropTypes.string,
    value         : PropTypes.bool,
};

export default Checkbox;
