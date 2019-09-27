import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

// TODO: use-from-shared - Use this icon from icons' shared package
const IconCheckmark = ({ className, classNamePath }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16'>
        <path
            className={classNames(classNamePath, 'color1-fill')}
            d='M6 10.0857864L3.70710678 7.79289322c-.39052429-.39052429-1.02368927-.39052429-1.41421356 0-.39052429.39052429-.39052429 1.02368927 0 1.41421356l3 3.00000002c.39052429.3905243 1.02368927.3905243 1.41421356 0l7.00000002-7.00000002c.3905243-.39052429.3905243-1.02368927 0-1.41421356-.3905243-.39052429-1.0236893-.39052429-1.4142136 0L6 10.0857864z'
            fill='#FFF'
            fillRule='evenodd'
        />
    </svg>
);

class Checkbox extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            checked: props.defaultChecked,
        };
    }

    onChange = (e) => {
        this.setState({ checked: e.target.checked });
        this.props.onChange(e);
    };

    render() {
        const {
            className,
            classNameLabel,
            id,
            label,
            onChange, // This needs to be here so it's not included in `otherProps`
            ...otherProps
        } = this.props;

        return (
            <label htmlFor={ id } className={ classNames('dc-checkbox', className) }>
                <input
                    className='dc-checkbox__input'
                    type='checkbox'
                    id={ id }
                    onChange={ this.onChange }
                    { ...otherProps }
                />
                <span
                    className={ classNames('dc-checkbox__box', {
                        'dc-checkbox__box--active': this.state.checked,
                    }) }
                >
                    { !!this.state.checked &&
                        <IconCheckmark />
                    }
                </span>
                <span className={classNames('dc-checkbox__label', classNameLabel)}>
                    { label }
                </span>
            </label>
        );
    }
}

Checkbox.propTypes = {
    className     : PropTypes.string,
    classNameLabel: PropTypes.string,
    id            : PropTypes.string,
    label         : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
};

export default Checkbox;
