declare module '@enykeev/react-virtualized/dist/es/List' {
    import { ListProps } from '@enykeev/react-virtualized/dist/es/List';
    import type { Grid } from 'react-virtualized';

    type TRowRenderer = {
        style: CSSProperties;
        index: number;
        key: string;
        parent: React.RefObject<Grid>;
    };

    type TList = {
        autoHeight: boolean;
        className?: string;
        deferredMeasurementCache: any;
        height: number;
        overscanRowCount: number;
        ref: any;
        rowCount: number;
        rowHeight: number;
        rowRenderer: (props: TRowRenderer) => React.ReactNode;
        scrollingResetTimeInterval: number;
        scrollTop: number;
        width: number;
    };

    export const List = ({
        autoHeight,
        className,
        deferredMeasurementCache,
        height,
        overscanRowCount,
        ref,
        rowCount,
        rowHeight,
        rowRenderer,
        scrollingResetTimeInterval,
        scrollTop,
        width,
    }: TList): JSX.Element => JSX.Element;
    // or just:
    //export const List =  (props: TList): JSX.Element => JSX.Element;
    export default List;
}
