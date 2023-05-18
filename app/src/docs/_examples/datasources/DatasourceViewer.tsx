import React, { useCallback } from 'react';
import { DataPickerRow, VirtualList, Text, Panel, LinkButton } from '@epam/promo';
import { FlexRow, PickerItem } from '@epam/uui';
import { DataRowProps, DataSourceState, IDataSource, IEditable } from '@epam/uui-core';
import css from './DatasourceViewer.module.scss';

interface Props<TItem, TId> extends IEditable<DataSourceState> {
    exampleTitle?: string;
    selectAll?: boolean;
    getName?: (item: TItem) => string;
    datasource: IDataSource<TItem, TId, any>;
}

export function DatasourceViewer<TItem, TId>(props: Props<TItem, TId>) {
    const { value, onValueChange, datasource, exampleTitle, selectAll: showSelectAll } = props;
    const view = datasource.useView(value, onValueChange);

    const renderItem = (item: TItem, rowProps: DataRowProps<TItem, TId>) => {
        return (
            <PickerItem
                title={ props.getName?.(item) ?? (item as { name: string }).name }
                size="24"
                { ...rowProps }
            />
        );
    };

    const renderRow = (rowProps: DataRowProps<TItem, TId>) => {
        return (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                borderBottom="none"
                padding="12"
                renderItem={ renderItem }
            />
        );
    };
    const clearAll = useCallback(
        () => {
            onValueChange({ ...value, checked: [] });
        },
        [onValueChange, value],
    );
    
    const selectAll = useCallback(
        () => {
            view.selectAll.onValueChange(true);
        },
        [view.selectAll],
    );

    const renderedRows = view.getVisibleRows().map(renderRow);
    const hasSelection = view.getSelectedRowsCount() > 0;
    const listProps = view.getListProps();

    return (
        <Panel cx={ css.panel }>
            <Text fontSize="14">{exampleTitle}</Text>
            <FlexRow cx={ css.row }>
                <VirtualList
                    value={ value }
                    onValueChange={ onValueChange }
                    rows={ renderedRows }
                    { ...listProps }
                    cx={ css.list }
                />
            </FlexRow>
            <FlexRow cx={ css.row }>
                {showSelectAll && view.selectAll && (
                    <LinkButton
                        size="24"
                        caption={ hasSelection ? 'Clear all' : 'Select all' }
                        onClick={ hasSelection ? clearAll : selectAll }
                    />
                )}
            </FlexRow>
            { value.checked?.length > 0 && (
                <FlexRow cx={ css.row }>
                    <Text>
                        Selected:
                        {' '}
                        {value.checked?.map((id) => JSON.stringify(id)).join(', ')}
                    </Text>
                </FlexRow>
            ) }
        </Panel>
    );
}
