import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

class Radio extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: props.defaultChecked,
        };
    }

    /*
    * We use componentDidUpdate here to tell the Radio component to update itself
    * when it's no longer selected
    * This is because we're handling the state of what's selected in RadioGroup with the defaultChecked prop
     */
    componentDidUpdate(prevProps) {
        if (this.props.defaultChecked === prevProps.defaultChecked) {
            return;
        }

        this.setState({ checked: this.props.defaultChecked });
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
            children,
            onChange, // This needs to be here so it's not included in `otherProps`
            ...otherProps
        } = this.props;

        return (
            <label htmlFor={id} className={classNames('dc-radio-group__item', className)}>
                <input
                    className='dc-radio-group__input'
                    type='radio'
                    id={ id }
                    onChange={ this.onChange }
                    { ...otherProps }
                />
                <span
                    className={ classNames('dc-radio-group__circle', {
                        'dc-radio-group__circle--selected': this.state.checked,
                    }) }
                />
                <span className={classNames('dc-radio-group__label', classNameLabel)}>
                    { children }
                </span>
            </label>
        );
    }
}

Radio.propTypes = {
    children: PropTypes.node,
    id      : PropTypes.string,
    onClick : PropTypes.func,
    selected: PropTypes.bool,
    value   : PropTypes.bool,
};

export default Radio;
