import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const LastDigitParticles = ({
    is_won,
    position,
}) => (
    <div
        className={classNames('digits__particles', {
            'digits__particles--explode': is_won,
        })}
        style={{ marginLeft: position }}
    >
        <span className='digits__particles-particle' />
        <span className='digits__particles-particle' />
        <span className='digits__particles-particle' />
        <span className='digits__particles-particle' />
        <span className='digits__particles-particle' />
        <span className='digits__particles-particle' />
        <span className='digits__particles-particle' />
        <span className='digits__particles-particle' />
    </div>
);

LastDigitParticles.propTypes = {
    is_won  : PropTypes.bool,
    position: PropTypes.number,
};

export default LastDigitParticles;
