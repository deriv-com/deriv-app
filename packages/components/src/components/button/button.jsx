import React from 'react';
import './button.scss';

const Button = props => (
    <button className='button-primary'>{props.name}</button>
);

export default Button;
