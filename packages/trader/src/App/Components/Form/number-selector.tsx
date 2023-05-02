import classNames from 'classnames';
import React from 'react';

type TNumberSelector = {
    arr_arr_numbers: number[][];
    name: string;
    onChange: (new_values: {
        target: {
            value: string | number;
            name: string;
        };
    }) => void;
    selected_number?: number;
    should_show_in_percents?: boolean;
};

// arr_arr_numbers is an array of arrays where each nested array indicates one row
// for example [[1, 2, 3]] will be a single row of these three numbers
// but [[1, 2, 3], [4, 5, 6]] will be two rows:
// first row with the first three numbers and second row with the last three numbers
const NumberSelector = ({
    arr_arr_numbers,
    name,
    onChange,
    selected_number,
    should_show_in_percents,
}: TNumberSelector) => {
    const handleSelect = (item: React.MouseEvent<HTMLSpanElement>) => {
        if (Number(item.currentTarget.getAttribute('data-value')) !== selected_number) {
            onChange({ target: { name, value: Number(item.currentTarget.getAttribute('data-value')) } });
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

export default NumberSelector;
