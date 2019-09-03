import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const LastDigitParticles = ({
    is_won,
}) => (
    <div
        className={classNames('digits__particles', {
            'digits__particles--explode': is_won,
        })}
    >
        <span className='digits__particles-particle' style={{ background: 'red' }} />
        <span className='digits__particles-particle' style={{ background: 'blue' }} />
        <span className='digits__particles-particle' style={{ background: 'red' }} />
        <span className='digits__particles-particle' style={{ background: 'green' }} />
        <span className='digits__particles-particle' style={{ background: 'yellow' }} />
        <span className='digits__particles-particle' style={{ background: 'yellow' }} />
        <span className='digits__particles-particle' style={{ background: 'red' }} />
        <span className='digits__particles-particle' style={{ background: 'orange' }} />
    </div>
);

LastDigitParticles.propTypes = {
    is_won  : PropTypes.bool,
    position: PropTypes.number,
};

export default LastDigitParticles;
