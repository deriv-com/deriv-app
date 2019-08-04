import React from 'react';

const Button = props => (
    <button>{props.name}</button>
);

export default React.memo(Button);
