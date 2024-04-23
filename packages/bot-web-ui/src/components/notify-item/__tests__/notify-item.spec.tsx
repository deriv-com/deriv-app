import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getIcon, messageWithButton, messageWithImage, arrayAsMessage } from '../notify-item';

const messageWithButtonMockProps = {
    unique_id: '123',
    type: 'error',
    message: 'sample text',
    btn_text: 'ok',
    onClick: jest.fn(),
};

describe('messageWithButtonMockProps', () => {
    it('should render messageWithButton', () => {
        const { container } = render(messageWithButton({ ...messageWithButtonMockProps }));
        expect(container).toBeInTheDocument();
        expect(screen.getByText('sample text')).toBeInTheDocument();
    });

    it('should call function of the button on click of the button', () => {
        render(messageWithButton({ ...messageWithButtonMockProps }));
        userEvent.click(screen.getByRole('button'));
        expect(messageWithButtonMockProps.onClick).toHaveBeenCalled();
    });

    it('should get appropriate icon when getIcon is called', () => {
        expect(getIcon('warn')).toEqual('IcAlertWarning');
        expect(getIcon('info')).toEqual('IcAlertInfo');
        expect(getIcon('error')).toEqual('IcAlertDanger');
        expect(getIcon('')).toEqual('IcAlertWarning');
    });

    it('should render messageWithImage', () => {
        const { container } = render(messageWithImage('sample text', ''));
        expect(container).toBeInTheDocument();
        expect(screen.getByText('sample text')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});

describe('arrayAsMessage', () => {
    const parsed_array = {
        header: 'Header',
        content: [
            { id: '992818365944.2119', value: 'Item 1' },
            { id: '1388028143659.5684', value: 'Item 2' },
            {
                id: '880752614728.2074',
                value: [
                    {
                        id: '3-1',
                        value: 'Nested item 3-1',
                    },
                    {
                        id: '3-2',
                        value: 'Nested item 3-2',
                    },
                ],
            },
        ],
    };

    const measure = jest.fn();

    it('renders header of the ExpansionPanel', () => {
        render(arrayAsMessage(parsed_array)(measure));

        expect(screen.getByText(parsed_array.header)).toBeInTheDocument();

        expect(measure).toHaveBeenCalled();
    });

    it('should handle click on SVG element and show expected content of ExpansionPanel', () => {
        const { container } = render(arrayAsMessage(parsed_array)(measure));
        // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
        const svgElement = container.getElementsByClassName('dc-expansion-panel__header-chevron-icon')[0];
        userEvent.click(svgElement);

        parsed_array.content.forEach(item => {
            if (typeof item.value === 'string') {
                expect(screen.getByText(item.value)).toBeInTheDocument();
            } else {
                expect(screen.getByText(`(${item.value.length})`)).toBeInTheDocument();
            }
        });
    });
});
