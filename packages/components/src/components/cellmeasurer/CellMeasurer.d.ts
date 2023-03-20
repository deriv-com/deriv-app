declare module '@enykeev/react-virtualized/dist/es/CellMeasurer' {
    export type CellMeasurer = {
        hasFixedWidth?: boolean;
        hasFixedHeight?: boolean;
        has?: (rowIndex: number, columnIndex: number) => boolean;
        set?: (rowIndex: number, columnIndex: number, width: number, height: number) => void;
        getHeight?: (rowIndex: number, columnIndex: number) => number;
        getWidth?: (rowIndex: number, columnIndex: number) => number;
        children: ({ measure }: TMeasure) => JSX.Element;
        cache?: CellMeasureCache;
        columnIndex?: number;
        key?: string | number;
        rowIndex?: number;
    };

    export const CellMeasurer = ({
        hasFixedWidth,
        hasFixedHeight,
        has,
        set,
        getHeight,
        getWidth,
        rowHeight,
        children,
    }: CellMeasurer): JSX.Element => JSX.Element;
    export default CellMeasurer;
}
