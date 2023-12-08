import { onChangeCancellationDuration, onToggleCancellation } from '../multiplier';

describe('onChangeCancellationDuration', () => {
    it('should call onChangeMultiple with the correct cancellation duration value', () => {
        const event = {
            target: {
                value: '60',
                name: '',
            },
        };
        const onChangeMultipleMock = jest.fn();
        onChangeCancellationDuration({ event, onChangeMultiple: onChangeMultipleMock });

        expect(onChangeMultipleMock).toHaveBeenCalledWith({
            has_cancellation: true,
            has_take_profit: false,
            has_stop_loss: false,
            cancellation_duration: '60',
        });
    });
});

describe('onToggleCancellation', () => {
    it('should toggle cancellation and reset cancellation price if unchecked', () => {
        const initialValues = {
            has_cancellation: true,
            has_stop_loss: false,
            has_take_profit: false,
            cancellation_price: 100,
        };
        const onChangeMultipleMock = jest.fn();
        onToggleCancellation({
            has_cancellation: initialValues.has_cancellation,
            onChangeMultiple: onChangeMultipleMock,
        });

        expect(onChangeMultipleMock).toHaveBeenCalledWith({
            has_cancellation: false,
            cancellation_price: undefined,
        });
    });

    it('should toggle cancellation and reset cancellation price if checked again', () => {
        const initialValues = {
            has_cancellation: false,
            cancellation_price: 50,
        };
        const onChangeMultipleMock = jest.fn();
        onToggleCancellation({
            has_cancellation: initialValues.has_cancellation,
            onChangeMultiple: onChangeMultipleMock,
        });

        expect(onChangeMultipleMock).toHaveBeenCalledWith({
            has_cancellation: true,
            has_stop_loss: false,
            has_take_profit: false,
        });
    });
});
