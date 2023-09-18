import classNames from 'classnames';
import React from 'react';

type TReportsMeta = {
    filter_component: React.ReactNode;
    optional_component?: React.ReactNode;
    className?: string;
    is_statement?: boolean;
};

const ReportsMeta = ({ filter_component, className, optional_component, is_statement }: TReportsMeta) => {
    return (
        <div className={classNames('reports__meta', className)}>
            {optional_component}
            {filter_component && (
                <div
                    className={classNames('reports__meta-filter', {
                        'reports__meta-filter--statement': is_statement,
                    })}
                >
                    {filter_component}
                </div>
            )}
        </div>
    );
};

export { ReportsMeta };
