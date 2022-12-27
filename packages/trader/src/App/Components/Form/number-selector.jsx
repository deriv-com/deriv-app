import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// arr_arr_numbers is an array of arrays where each nested array indicates one row
// for example [[1, 2, 3]] will be a single row of these three numbers
// but [[1, 2, 3], [4, 5, 6]] will be two rows:
// first row with the first three numbers and second row with the last three numbers
const NumberSelector = ({ arr_arr_numbers, name, onChange, selected_number, should_show_in_percents }) => {
    const handleSelect = item => {
        if (+item.target.getAttribute('data-value') !== selected_number) {
            onChange({ target: { name, value: +item.target.getAttribute('data-value') } });
        }
    };

    return (
        <div className='number-selector'>
            {arr_arr_numbers.map((arr_numbers, idx) => (
                <div className='number-selector__row' key={idx}>
                    {arr_numbers.map(i => (
                        <span
                            key={i}
                            className={classNames('number-selector__selection', {
                                'number-selector__selection--selected': selected_number === i,
                                'number-selector__selection--percentage': should_show_in_percents,
                            })}
                            data-value={i}
                            onClick={handleSelect}
                        >
                            {should_show_in_percents ? `${i * 100}%` : i}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
};

NumberSelector.propTypes = {
    arr_arr_numbers: PropTypes.arrayOf(PropTypes.array),
    name: PropTypes.string,
    onChange: PropTypes.func,
    selected_number: PropTypes.number,
    should_show_in_percents: PropTypes.bool,
};

export default NumberSelector;
