import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React, { Fragment } from 'react';
import {
    Icon,
    IconArrow }            from 'Assets/Common';

const DurationToggle = ({
    name,
    onChange,
    value,
}) => {
    const toggle = () => {
        onChange({ target: { value: !value, name } });
    };
    const icon_className = classNames(
        'advanced-simple-toggle__icon',
        'select-arrow',
        { 'advanced-simple-toggle__icon--active': value },
    );
    return (
        <Fragment>
            <button className='advanced-simple-toggle' onClick={toggle}>
                <Icon icon={IconArrow} className={icon_className} classNamePath={'advanced-simple-toggle__icon-path'} />
            </button>
        </Fragment>);
};

DurationToggle.propTypes = {
    name    : PropTypes.string,
    onChange: PropTypes.func,
    value   : PropTypes.bool,
};

export default DurationToggle;
