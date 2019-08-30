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
        const { selected, children, id, className } = this.props;

        return (
            <div id={id} className={classNames('dc-radio-group__item', className)} onClick={this.clickHandler}>
                <div className={classNames('dc-radio-group__circle', {
                    'dc-radio-group__circle--selected': selected,
                })}
                />
                <div className='dc-radio-group__label'>{children}</div>
            </div>
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
