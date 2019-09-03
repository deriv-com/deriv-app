import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

class Radio extends React.PureComponent {
    clickHandler = () => {
        if (!this.props.selected) {
            this.props.onClick(this.props.value);
        }
    };

    render() {
        const { className, selected, children, id } = this.props;

        return (
            <div id={id} className={classNames('radio-group__item', className)} onClick={this.clickHandler}>
                <div className={classNames('radio-group__circle', {
                    'radio-group__circle--selected': selected,
                })}
                />
                <div className='radio-group__label'>{children}</div>
            </div>
        );
    }
}

Radio.propTypes = {
    children : PropTypes.node,
    className: PropTypes.string,
    id       : PropTypes.string,
    onClick  : PropTypes.func,
    selected : PropTypes.bool,
    value    : PropTypes.bool,
};

export { Radio };
