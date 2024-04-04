import { calculateHeight, calculateWidth } from '../draggable-utils';

describe('Draggable Utils', () => {
    const boundaryRect = {
        left: 0,
        width: 1000,
        top: 0,
        height: 1000,
        x: 0,
        y: 0,
        bottom: 0,
        right: 0,
        toJSON: () => {
            // eslint-disable-line
        },
    };

    const self = {
        left: 50,
        height: 0,
        width: 0,
        x: 0,
        y: 0,
        bottom: 0,
        right: 0,
        top: 0,
        toJSON: () => {
            // eslint-disable-line
        },
    };

    it('should calculate width correctly for resizing to the left', () => {
        const mockParams = {
            prevWidth: 200,
            leftOffset: 20,
            boundaryRect,
            initialSelfRight: 300,
            resize_direction: 'left',
            newWidth: 250,
            minWidth: 100,
            clientX: 80,
            self,
        };
        const result = calculateWidth(mockParams);
        expect(result).toBe(250);
    });

    it('should keep previous width if shrunk below min width from the left', () => {
        const mockParams = {
            prevWidth: 200,
            leftOffset: 20,
            boundaryRect,
            initialSelfRight: 300,
            resize_direction: 'left',
            newWidth: 99,
            minWidth: 100,
            clientX: 80,
            self,
        };
        const result = calculateWidth(mockParams);
        expect(result).toBe(200);
    });

    it('should not go below the edge if dragged outside of the left edge', () => {
        const mockParams = {
            prevWidth: 200,
            leftOffset: 20,
            boundaryRect,
            initialSelfRight: 300,
            resize_direction: 'left',
            newWidth: 99,
            minWidth: 100,
            clientX: -80,
            self,
        };
        const result = calculateWidth(mockParams);
        expect(result).toBe(265);
    });

    it('should calculate width correctly for resize to the right', () => {
        const mockParams = {
            prevWidth: 200,
            leftOffset: 20,
            boundaryRect,
            initialSelfRight: 300,
            resize_direction: 'right',
            newWidth: 350,
            minWidth: 100,
            clientX: 50,
            self,
        };
        const result = calculateWidth(mockParams);
        expect(result).toBe(350);
    });

    it('should keep previous width if shrunk below min width from right', () => {
        const mockParams = {
            prevWidth: 200,
            leftOffset: 20,
            boundaryRect,
            initialSelfRight: 300,
            resize_direction: 'right',
            newWidth: 99,
            minWidth: 100,
            clientX: 80,
            self,
        };
        const result = calculateWidth(mockParams);
        expect(result).toBe(200);
    });

    it('should not go over the edge if dragged outside of the right edge', () => {
        const mockParams = {
            prevWidth: 200,
            leftOffset: 20,
            boundaryRect,
            initialSelfRight: 300,
            resize_direction: 'right',
            newWidth: 99,
            minWidth: 100,
            clientX: 8000,
            self,
        };
        const result = calculateWidth(mockParams);
        expect(result).toBe(943);
    });

    it('should return previous width if no direction is sent', () => {
        const mockParams = {
            prevWidth: 200,
            leftOffset: 20,
            boundaryRect,
            initialSelfRight: 300,
            resize_direction: '',
            newWidth: 99,
            minWidth: 100,
            clientX: 8000,
            self,
        };
        const result = calculateWidth(mockParams);
        expect(result).toBe(200);
    });

    it('should calculate height correctly for resize to the top', () => {
        const mockParams = {
            prevHeight: 200,
            topOffset: 20,
            boundaryRect,
            initialSelfBottom: 200,
            resize_direction: 'top',
            newHeight: 250,
            minHeight: 100,
            clientY: 300,
            self,
        };
        const result = calculateHeight(mockParams);
        expect(result).toBe(250);
    });

    it('should keep previous height if shrunk below min height from the top', () => {
        const mockParams = {
            prevHeight: 200,
            topOffset: 20,
            boundaryRect,
            initialSelfBottom: 200,
            resize_direction: 'top',
            newHeight: 99,
            minHeight: 100,
            clientY: 300,
            self,
        };
        const result = calculateHeight(mockParams);
        expect(result).toBe(200);
    });

    it('should not go below the edge if dragged outside of the top edge', () => {
        const mockParams = {
            prevHeight: 200,
            topOffset: 20,
            boundaryRect,
            initialSelfBottom: 200,
            resize_direction: 'top',
            newHeight: 99,
            minHeight: 100,
            clientY: -300,
            self,
        };
        const result = calculateHeight(mockParams);
        expect(result).toBe(165);
    });

    it('should calculate height correctly for resizing from the bottom', () => {
        const mockParams = {
            prevHeight: 200,
            topOffset: 20,
            boundaryRect,
            initialSelfBottom: 200,
            resize_direction: 'bottom',
            newHeight: 350,
            minHeight: 100,
            clientY: 200,
            self,
        };
        const result = calculateHeight(mockParams);
        expect(result).toBe(350);
    });

    it('should keep previous height if shrunk below min height from the bottom', () => {
        const mockParams = {
            prevHeight: 200,
            topOffset: 20,
            boundaryRect,
            initialSelfBottom: 200,
            resize_direction: 'bottom',
            newHeight: 99,
            minHeight: 100,
            clientY: 99,
            self,
        };
        const result = calculateHeight(mockParams);
        expect(result).toBe(200);
    });

    it('should not go over the edge if dragged outside of the bottom edge', () => {
        const mockParams = {
            prevHeight: 200,
            topOffset: 20,
            boundaryRect,
            initialSelfBottom: 200,
            resize_direction: 'bottom',
            newHeight: 99,
            minHeight: 100,
            clientY: 8000,
            self,
        };
        const result = calculateHeight(mockParams);
        expect(result).toBe(993);
    });

    it('should return previous height if no direction is sent', () => {
        const mockParams = {
            prevHeight: 200,
            topOffset: 20,
            boundaryRect,
            initialSelfBottom: 200,
            resize_direction: '',
            newHeight: 99,
            minHeight: 100,
            clientY: 8000,
            self,
        };
        const result = calculateHeight(mockParams);
        expect(result).toBe(200);
    });
});
