import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ErrorDialog from '../ErrorDialog';

describe('ErrorDialog', () => {
    it('should test if the Dialog is displayed/hidden based on the isOpen prop', () => {
        render(<ErrorDialog isOpen={false} />);
        expect(screen.queryByText('Cashier Error')).not.toBeInTheDocument();

        render(<ErrorDialog isOpen />);
        expect(screen.getByText('Cashier Error')).toBeInTheDocument();
    });

    it('should test if the Dialog is displayed/hidden based on the isOpen prop', async () => {
        render(<ErrorDialog isOpen />);

        await userEvent.click(screen.getByTestId('dt_error_dialog_ok_button'));
        expect(screen.queryByText('Cashier Error')).not.toBeInTheDocument();
    });

    it('should test if the children are rendered properly', () => {
        render(<ErrorDialog isOpen>Dummy Child</ErrorDialog>);
        expect(screen.getByText('Dummy Child')).toBeInTheDocument();
    });
});
