import React from 'react';
import { render, screen } from '@testing-library/react';
import LegacyInlineMessage from '../legacy-inline-message';

describe('LegacyInlineMessage', () => {
    let mock_props: React.ComponentProps<typeof LegacyInlineMessage>;
    beforeEach(() => {
        mock_props = {
            message: 'Message',
            type: 'warning',
        };
    });

    it('should render icon and message', () => {
        render(<LegacyInlineMessage {...mock_props} />);

        expect(screen.getByTestId('dt_inline_message_icon')).toBeInTheDocument();
        expect(screen.getByText('Message')).toBeInTheDocument();
    });

    it('component should have proper classname with provided type', () => {
        render(<LegacyInlineMessage {...mock_props} />);

        const el_legacy_inline_message = screen.getByTestId('dt_legacy_inline_message_container');

        expect(el_legacy_inline_message).toHaveClass('legacy-inline-message__warning');
    });
});
