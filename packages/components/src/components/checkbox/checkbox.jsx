import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import Icon       from '../icon';

class Checkbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: props.defaultChecked,
        };
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (state.checked !== nextProps.defaultChecked) {
            return { checked: nextProps.defaultChecked };
        }
        return null;
    }

    onChange = (e) => {
        e.persist();
        this.setState(state => ({ checked: !state.checked }), () => {
            this.props.onChange(e);
        });
    };

    setChecked = (checked) => {
        this.setState({ checked });
    }

    render() {
        const {
            className,
            classNameLabel,
            id,
            label,
            defaultChecked,
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
                    defaultChecked={this.state.checked}
                    { ...otherProps }
                />
                <span
                    className={ classNames('dc-checkbox__box', {
                        'dc-checkbox__box--active': this.state.checked,
                    }) }
                >
                    { !!this.state.checked &&
                        <Icon icon='IcCheckmark' color='active' />
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
