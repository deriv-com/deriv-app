import PropTypes from 'prop-types';
import React     from 'react';

// TODO remove this file entirely when icon component is ready.
const IconQuestion = ({ className }) => (
    <svg className={className} width='16' height='16' viewBox='0 0 16 16'>
        <g fill='#FFF' fillRule='evenodd'>
            <path d='M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm0-1A7 7 0 1 0 8 1a7 7 0 0 0 0 14z' fillRule='nonzero' />
            <path d='M7.39 9.518c.007-.373.052-.668.134-.885.082-.216.25-.456.503-.72l.646-.636c.276-.298.415-.618.415-.96 0-.33-.09-.588-.272-.774-.18-.187-.444-.28-.789-.28-.335 0-.605.084-.809.254a.842.842 0 0 0-.306.682H6c.007-.508.196-.918.57-1.23.373-.313.859-.469 1.457-.469.622 0 1.106.16 1.453.478.347.318.52.755.52 1.31 0 .55-.266 1.091-.799 1.625l-.538.508c-.24.255-.36.62-.36 1.097h-.912zm-.039 1.492a.5.5 0 0 1 .136-.355c.09-.096.224-.144.402-.144.178 0 .312.048.404.144a.493.493 0 0 1 .139.355.477.477 0 0 1-.139.351c-.092.093-.226.139-.404.139-.178 0-.312-.046-.402-.139a.481.481 0 0 1-.136-.35z' />
        </g>
    </svg>
);

IconQuestion.propTypes = {
    className: PropTypes.string,
};

export default IconQuestion;
