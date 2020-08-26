import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

class Checkbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: props.defaultChecked || props.value,
        };
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (state.checked !== nextProps.defaultChecked || state.checked !== nextProps.value) {
            return { checked: nextProps.defaultChecked || nextProps.value };
        }
        return null;
    }

    onChange = e => {
        e.persist();
        this.setState(
            state => ({ checked: !state.checked }),
            () => {
                this.props.onChange(e);
            }
        );
    };

    setChecked = checked => {
        this.setState({ checked });
    };

    handleKeyDown = e => {
        // Enter or space
        if (e.key === 'Enter' || e.keyCode === 32) {
            this.setState(
                state => ({ checked: !state.checked }),
                () => {
                    this.props.onChange();
                }
            );
        }
    };

    render() {
        const {
            className,
            classNameLabel,
            id,
            label,
            defaultChecked,
            onChange, // This needs to be here so it's not included in `otherProps`
            withTabIndex,
            ...otherProps
        } = this.props;

        return (
            <label
                htmlFor={id}
                onClick={e => e.stopPropagation()}
                className={classNames('dc-checkbox', className, {
                    'dc-checkbox--disabled': this.props.disabled,
                })}
            >
                <input
                    className='dc-checkbox__input'
                    type='checkbox'
                    id={id}
                    onChange={this.onChange}
                    defaultChecked={this.state.checked}
                    {...otherProps}
                />
                <span
                    className={classNames('dc-checkbox__box', {
                        'dc-checkbox__box--active': this.state.checked,
                        'dc-checkbox__box--disabled': this.props.disabled,
                    })}
                    {...(withTabIndex?.length > 0 ? { tabIndex: withTabIndex } : {})}
                    onKeyDown={this.handleKeyDown}
                >
                    {!!this.state.checked && <Icon icon='IcCheckmark' color='active' />}
                </span>
                <span className={classNames('dc-checkbox__label', classNameLabel)}>{label}</span>
            </label>
        );
    }
}

Checkbox.propTypes = {
    className: PropTypes.string,
    classNameLabel: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    withTabIndex: PropTypes.string,
};

export default Checkbox;
