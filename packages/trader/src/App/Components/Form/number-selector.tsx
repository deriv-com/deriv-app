import classNames from 'classnames';
import React from 'react';

type NumberSelectorProps = {
    arr_arr_numbers: unknown;
    name: string;
    onChange: () => void;
    selected_number: number;
};

// arr_arr_numbers is an array of arrays where each nested array indicates one row
// for example [[1, 2, 3]] will be a single row of these three numbers
// but [[1, 2, 3], [4, 5, 6]] will be two rows:
// first row with the first three numbers and second row with the last three numbers
const NumberSelector = ({ arr_arr_numbers, name, onChange, selected_number }: NumberSelectorProps) => {
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
                            })}
                            data-value={i}
                            onClick={handleSelect}
                        >
                            {i}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default NumberSelector;
