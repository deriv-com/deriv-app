import React from 'react';
import { render, screen } from '@testing-library/react';
import {
    getFormattedConfirmations,
    getStatusDescription,
    getStatusName,
    TModifiedTransaction,
} from '../transaction-helpers';

describe('Crypto Transaction Status Functions', () => {
    describe('getStatusName', () => {
        it('should return correct status name for each status code', () => {
            const testStatus = (statusCode: TModifiedTransaction['statusCode'], expectedText: string) => {
                render(<>{getStatusName(statusCode)}</>);
                expect(screen.getAllByText(expectedText)[0]).toBeInTheDocument();
            };

            testStatus('CONFIRMED', 'Successful');
            testStatus('SENT', 'Successful');
            testStatus('ERROR', 'Unsuccessful');
            testStatus('REJECTED', 'Unsuccessful');
            testStatus('REVERTED', 'Unsuccessful');
            testStatus('PENDING', 'In process');
            testStatus('PERFORMING_BLOCKCHAIN_TXN', 'In process');
            testStatus('PROCESSING', 'In process');
            testStatus('REVERTING', 'In process');
            testStatus('VERIFIED', 'In process');
            testStatus('CANCELLED', 'Cancelled');
            testStatus('LOCKED', 'In review');
        });

        it('should return empty string for unknown status name', () => {
            render(
                <div data-testid='status-name'>{getStatusName('UNKNOWN' as TModifiedTransaction['statusCode'])}</div>
            );
            const statusElement = screen.getByTestId('status-name');
            expect(statusElement).toBeEmptyDOMElement();
        });
    });

    describe('getStatusDescription', () => {
        it('should return correct description for deposit statuses', () => {
            render(<>{getStatusDescription('deposit', 'CONFIRMED')}</>);
            expect(screen.getByText('Your deposit is successful.')).toBeInTheDocument();

            render(<>{getStatusDescription('deposit', 'PENDING')}</>);
            expect(
                screen.getByText("We've received your request and are waiting for more blockchain confirmations.")
            ).toBeInTheDocument();
        });

        it('should return correct description for withdrawal statuses', () => {
            const testDescription = (statusCode: TModifiedTransaction['statusCode'], expectedText: RegExp | string) => {
                render(<>{getStatusDescription('withdrawal', statusCode)}</>);
                expect(screen.getAllByText(expectedText)[0]).toBeInTheDocument();
            };

            testDescription('CANCELLED', "You've cancelled your withdrawal request.");
            testDescription(
                'LOCKED',
                /We're reviewing your withdrawal request. You may still cancel this transaction if you wish./
            );
            testDescription('PERFORMING_BLOCKCHAIN_TXN', "We're sending your request to the blockchain.");
            testDescription('PROCESSING', "We're awaiting confirmation from the blockchain.");
            testDescription(
                'REJECTED',
                "Your withdrawal is unsuccessful. We've sent you an email with more information."
            );
            testDescription(
                'REVERTED',
                "Your withdrawal is unsuccessful. We've sent you an email with more information."
            );
            testDescription('REVERTING', "We're processing your withdrawal.");
            testDescription('VERIFIED', "We're processing your withdrawal.");
            testDescription('SENT', 'Your withdrawal is successful.');
        });

        it('should return correct description for ERROR status', () => {
            render(<>{getStatusDescription('deposit', 'ERROR')}</>);
            expect(
                screen.getByText(
                    'Your deposit is unsuccessful due to an error on the blockchain. Please contact your crypto wallet service provider for more info.'
                )
            ).toBeInTheDocument();

            render(<>{getStatusDescription('withdrawal', 'ERROR')}</>);
            expect(
                screen.getByText(
                    'Your withdrawal is unsuccessful due to an error on the blockchain. Please contact us via live chat for more info.'
                )
            ).toBeInTheDocument();
        });

        it('should return empty string for unknown status description', () => {
            render(
                <div data-testid='status-description'>
                    {getStatusDescription('deposit', 'UNKNOWN' as TModifiedTransaction['statusCode'])}
                </div>
            );
            const statusElement = screen.getByTestId('status-description');
            expect(statusElement).toBeEmptyDOMElement();
        });
    });

    describe('getFormattedConfirmations', () => {
        it('should return "Confirmed" for CONFIRMED status', () => {
            expect(getFormattedConfirmations(3, 'CONFIRMED')).toBe('Confirmed');
        });

        it('should return "NA" for ERROR status', () => {
            expect(getFormattedConfirmations(3, 'ERROR')).toBe('NA');
        });

        it('should return confirmation count for other statuses', () => {
            expect(getFormattedConfirmations(3, 'PENDING')).toBe('3');
        });

        it('should return "Pending" if confirmations is undefined', () => {
            expect(getFormattedConfirmations(undefined, 'PENDING')).toBe('Pending');
        });
    });
});
