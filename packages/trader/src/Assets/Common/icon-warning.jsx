import PropTypes from 'prop-types';
import React     from 'react';

const IconWarning = ({ className }) => (
    <svg className={className} xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width='24' height='24' viewBox='0 0 24 24'>
        <defs>
            <path id='warning-icon' d='M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm1.414-4.583c.39-.388.586-.86.586-1.412 0-.55-.196-1.025-.586-1.416a1.912 1.912 0 0 0-1.41-.589c-.548 0-1.021.195-1.415.589A1.94 1.94 0 0 0 10 18.005c0 .552.198 1.024.59 1.412.393.389.866.583 1.414.583.55 0 1.02-.194 1.41-.583zM11.529 4.05C10.586 4.284 10 5.03 10 5.936c.048.546.087 1.1.135 1.646.134 2.08.269 4.12.404 6.201.047.705.673 1.217 1.48 1.217.809 0 1.442-.546 1.482-1.258 0-.249.028-1.075.048-1.259.087-1.334.182-2.668.269-4.003.047-.864.134-1.728.182-2.592 0-.311-.048-.588-.182-.864-.404-.775-1.347-1.169-2.29-.975z' />
        </defs>
        <use fill='#FFF' fillRule='evenodd' xlinkHref='#warning-icon' />
    </svg>
);

IconWarning.propTypes = {
    className: PropTypes.string,
};

export default IconWarning;
