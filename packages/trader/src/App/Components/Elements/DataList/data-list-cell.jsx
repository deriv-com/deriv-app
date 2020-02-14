import classNames from 'classnames';
import React from 'react';

class DataListCell extends React.PureComponent {
    render() {
        const { row, column, className, is_footer } = this.props;
        if (!column) return null;
        const { col_index, title } = column;
        const cell_value = row[col_index];

        return (
            <div className={classNames(className, column.col_index)}>
                {!is_footer && (
                    <span className={classNames(`${column.col_index}__row-title`, 'data-list__row-title')}>
                        {title}
                    </span>
                )}
                <div className='data-list__row-content'>
                    {column.renderCellContent
                        ? column.renderCellContent({ cell_value, row_obj: row, is_footer })
                        : cell_value}
                </div>
            </div>
        );
    }
}

export default DataListCell;
