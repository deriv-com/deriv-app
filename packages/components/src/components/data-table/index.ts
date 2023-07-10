import DataTable from './data-table';
import TableCell from './table-cell';
import TableRowInfo from './table-row-info';
import TableRow from './table-row';
import './data-table.scss';

(DataTable as any).TableRow = TableRow;
(DataTable as any).TableRowInfo = TableRowInfo;
(DataTable as any).TableCell = TableCell;

export default DataTable;
