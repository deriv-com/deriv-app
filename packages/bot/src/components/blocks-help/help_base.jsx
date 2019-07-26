import React from 'react';

const HelpBase = (props) => {
    return (
        <div className='flyout__help-content'>
            { props.children }
        </div>
    );
};

export default HelpBase;
