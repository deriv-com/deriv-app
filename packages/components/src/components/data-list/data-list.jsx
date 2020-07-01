import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { VariableSizeList as List } from 'react-window';
import { NavLink } from 'react-router-dom';
import { isMobile } from '@deriv/shared';
import DataListCell from './data-list-cell.jsx';
import ThemedScrollbars from '../themed-scrollbars/themed-scrollbars.jsx';

const ThemedScrollbarsWrapper = React.forwardRef((props, ref) => (
    <ThemedScrollbars {...props} forwardedRef={ref}>
        {props.children}
    </ThemedScrollbars>
));
// Display name is required by Developer Tools to give a name to the components we use.
// If a component doesn't have a displayName is will be shown as <Unknown />. Hence, name is set.
ThemedScrollbarsWrapper.displayName = 'ThemedScrollbars';

class DataList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            height: 200,
            width: 200,
        };
    }

    componentDidMount() {
        this.setState({
            height: this.props.custom_height || this.el_list_body.clientHeight,
            width: this.props.custom_width || this.el_list_body.clientWidth,
        });
    }

    footerRowRenderer = () => {
        const { footer, rowRenderer } = this.props;
        return <React.Fragment>{rowRenderer({ row: footer, is_footer: true })}</React.Fragment>;
    };

    rowRenderer = ({ style, ...args }) => {
        const { data_source, rowRenderer, getRowAction } = this.props;
        const row = data_source[args.index];
        const to = getRowAction && getRowAction(row);
        const contract_id = row.contract_id || row.id;
        return typeof to === 'string' ? (
            <NavLink
                id={`dt_reports_contract_${contract_id}`}
                className={'data-list__item--wrapper'}
                to={{
                    pathname: to,
                    state: {
                        from_table_row: true,
                    },
                }}
                style={style}
            >
                <div className='data-list__item'>{rowRenderer({ row, ...args })}</div>
            </NavLink>
        ) : (
            <div className='data-list__item--wrapper' style={style}>
                <div className='data-list__item'>{rowRenderer({ row, ...args })}</div>
            </div>
        );
    };

    render() {
        const { className, children, data_source, getRowSize, onScroll, footer } = this.props;

        return (
            <div className={classNames(className, 'data-list', `${className}__data-list`)} onScroll={onScroll}>
                <div
                    className={classNames('data-list__body', `${className}__data-list-body`)}
                    ref={ref => (this.el_list_body = ref)}
                >
                    <List
                        className={className}
                        height={this.state.height}
                        itemCount={data_source.length}
                        itemSize={getRowSize}
                        width={this.state.width}
                        outerElementType={isMobile() ? null : ThemedScrollbarsWrapper}
                    >
                        {this.rowRenderer}
                    </List>
                    {children}
                </div>
                {footer && (
                    <div className={classNames('data-list__footer', `${className}__data-list-footer`)}>
                        {this.footerRowRenderer()}
                    </div>
                )}
            </div>
        );
    }
}
DataList.Cell = DataListCell;
DataList.propTypes = {
    className: PropTypes.string,
    data_source: PropTypes.array,
    getRowAction: PropTypes.func,
    getRowSize: PropTypes.func,
    rowRenderer: PropTypes.func,
};

export default DataList;
