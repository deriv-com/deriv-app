import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchInput from '../ContractTypeMenu/search-input';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div data-testid='mockedIcon' />),
    };
});

describe('<SearchInput />', () => {
    const mocked_props = {
        onBlur: jest.fn(),
        onChange: jest.fn(),
        onClickClearInput: jest.fn(),
        value: '',
    };

    it('should render the search input element', () => {
        render(<SearchInput {...mocked_props} />);
        const search_input = screen.getByPlaceholderText('Search');
        expect(search_input).toBeInTheDocument();
    });
    it('should not display trailing clear icon when input is empty', () => {
        render(<SearchInput {...mocked_props} />);
        expect(screen.getByTestId('mockedIcon')).toBeInTheDocument();
    });
    it('should display trailing clear icon when input is not empty', () => {
        mocked_props.value = 'test';
        render(<SearchInput {...mocked_props} />);
        expect(screen.getAllByTestId('mockedIcon')).toHaveLength(2);
    });
    it('should render correct text when value is changed', () => {
        mocked_props.value = 'test';
        render(<SearchInput {...mocked_props} />);
        const search_input = screen.getByPlaceholderText('Search') as HTMLInputElement;
        expect(search_input.value).toBe('test');
    });
});
