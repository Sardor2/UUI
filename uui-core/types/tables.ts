import React, { Attributes, ReactNode } from 'react';
import { IEditable, ICheckable, IDropdownToggler, IHasCX, IClickable, IHasRawProps, ICanBeInvalid, ICanFocus } from './props';
import { SortDirection } from './dataQuery';
import { DndActorRenderParams, DropParams } from './dnd';
import { DataRowProps, DataSourceListProps, DataSourceState, IDataSource } from './dataSources';
import { ILens } from '../data';
import * as CSS from 'csstype';
import { TooltipCoreProps } from './components';

export interface DataTableState<TFilter = any> extends DataSourceState<TFilter> {
    columnsConfig?: ColumnsConfig;
    filtersConfig?: FiltersConfig;
    presetId?: number | null;
}

export interface DataColumnProps<TItem = any, TId = any, TFilter = any>
    extends IHasCX, IClickable, IHasRawProps<HTMLDivElement>, Attributes {
    /**
     * Unique key to identify the column. Used to reference columns, e.g. in ColumnsConfig.
     * Also, used as React key for cells, header cells, and other components inside tables.
     */
    key: string;

    /** Column caption. Can be a plain text, or any React Component */
    caption?: React.ReactNode;

    /** If specified, will make column fixed - it would not scroll horizontally */
    fix?: 'left' | 'right';

    /**
     * The width of the column. Usually, columns has exact this width.
     * When all columns fit, and there's spare horizontal space, you can use 'grow' prop to use this space for certain columns.
     * DataTable's columns can't shrink below width - table will add horizontal scrolling instead of shrinking columns
     */
    width: number;

    /** Minimal width to which column can be resized manually */
    minWidth?: number;

    /** The flex grow for the column. Allows column to grow in width if there's spare horizontal space */
    grow?: number;

    /** Aligns cell content horizontally */
    textAlign?: 'left' | 'center' | 'right';

    /** Align cell content vertically */
    alignSelf?: CSS.AlignSelfProperty;

    /**
     * Enables sorting arrows on the column.
     * Sorting state is kept in DataSourceState.sorting
     */
    isSortable?: boolean;

    /** Disallows to hide column via ColumnsConfiguration */
    isAlwaysVisible?: boolean;

    /** Makes column hidden by default. User can turn it on later, via ColumnsConfiguration */
    isHiddenByDefault?: boolean;

    /** Info tooltip displayed in the table header */
    info?: React.ReactNode;

    /**
     *  Should return true, if current filter affects the column.
     * Usually, this prop is filled automatically by the useTableState hook.
     * If you use the useTableState hook, you don't need to specify it manually.
     */
    isFilterActive?: (filter: TFilter, column: DataColumnProps<TItem, TId, TFilter>) => boolean;

    /** Render the cell content. The item props is the value of the whole row (TItem). */
    render?(item: TItem, props: DataRowProps<TItem, TId>): any;

    /** Overrides rendering of the whole cell */
    renderCell?(cellProps: RenderCellProps<TItem, TId, any>): any;

    /**
     * Renders column header dropdown.
     * Usually, this prop is filled automatically by the useTableState hook.
     * If you use the useTableState hook, you don't need to specify it manually.
     */
    renderDropdown?(): React.ReactNode;

    /**
     * Renders column filter.
     * If you use useTableState hook, and you specify filter for the column, default filter will be rendered automatically.
     * You can use this prop to render a custom filter component.
     */
    renderFilter?(lens: ILens<TFilter>): React.ReactNode;
}

export interface DataTableHeaderCellProps<TItem = any, TId = any> extends IEditable<DataTableState>, IDropdownToggler, IHasCX, DataTableColumnsConfigOptions {
    key: string;
    column: DataColumnProps<TItem, TId>;
    isFirstColumn: boolean;
    isLastColumn: boolean;
    selectAll?: ICheckable;
    isFilterActive?: boolean;
    sortDirection?: SortDirection;
    onSort(dir: SortDirection): void;
    onDrop?(params: DropParams<DataColumnProps<TItem, TId>, DataColumnProps<TItem, TId>>): void;
    renderFilter?: () => React.ReactNode;
}

export interface DataTableHeaderRowProps<TItem = any, TId = any> extends IEditable<DataTableState>, IHasCX, DataTableColumnsConfigOptions {
    columns: DataColumnProps<TItem, TId>[];
    selectAll?: ICheckable;
    onConfigButtonClick?: (params: DataTableConfigModalParams) => any;
    renderCell?: (props: DataTableHeaderCellProps<TItem, TId>) => React.ReactNode;
    renderConfigButton?: () => React.ReactNode;
}

export interface DataTableColumnsConfigOptions {
    allowColumnsReordering?: boolean;
    allowColumnsResizing?: boolean;
}

export interface DataTableRowProps<TItem = any, TId = any> extends DataRowProps<TItem, TId> {
    columns?: DataColumnProps<TItem, TId>[];
    renderCell?: (props: DataTableCellProps<TItem, TId, any>) => ReactNode;
    showCellDivider?: boolean;
    renderDropMarkers?: (props: DndActorRenderParams) => ReactNode;
}

export interface RenderEditorProps<TItem, TId, TCellValue> extends IEditable<TCellValue>, ICanFocus<any> {
    rowProps: DataRowProps<TItem, TId>;
    mode: 'cell'; // This can signal the editor component to adapt it's visuals to cell editor
}

export interface DataTableCellOverlayProps extends IHasCX, ICanBeInvalid {
    inFocus: boolean;
    columnIndex: number;
    rowIndex: number;
    canCopyTo?: (coords: ColumnSelectionRange) => boolean;
    allowCopy?: boolean;
    renderTooltip?: (props: ICanBeInvalid & TooltipCoreProps) => React.ReactElement;
}

export interface DataTableCellProps<TItem = any, TId = any, TCellValue = any> extends IHasCX, Partial<IEditable<TCellValue>> {
    key: string;
    rowProps: DataTableRowProps<TItem, TId>;
    column: DataColumnProps<TItem, TId>;
    index?: number;
    isFirstColumn: boolean;
    isLastColumn: boolean;
    canCopyTo?: (coords: ColumnSelectionRange) => boolean;
    allowCopy?: boolean;
    role?: React.HTMLAttributes<HTMLElement>['role'];
    tabIndex?: React.HTMLAttributes<HTMLElement>['tabIndex'];
    addons?: React.ReactNode;
    renderPlaceholder?(cellProps: DataTableCellProps<TItem, TId, TCellValue>): React.ReactNode;
    renderOverlay?(props: DataTableCellOverlayProps): React.ReactNode;
    renderEditor?(props: RenderEditorProps<TItem, TId, TCellValue>): React.ReactNode;
    renderTooltip?: (props: ICanBeInvalid & TooltipCoreProps) => React.ReactElement;
}

export interface ColumnSelectionRange {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
    isCopying?: boolean;
}

export interface RenderCellProps<TItem = any, TId = any, TCellValue = any> extends DataTableCellProps<TItem, TId, TCellValue> {
    rowLens: ILens<TItem>;
}

export type ColumnsConfig = {
    [key: string]: IColumnConfig,
};

export type IColumnConfig = {
    isVisible?: boolean;
    order?: string;
    width?: number;
};

export type FiltersConfig = {
    [key: string]: IFilterConfig;
};

export type IFilterConfig = {
    isVisible: boolean;
    order: string;
};

export type DataTableProps<TItem, TId> = DataSourceListProps & IEditable<DataSourceState> & {
    getRows(from: number, count: number): DataRowProps<TItem, TId>[];
    columns?: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
};

export type DataTableConfigModalParams = IEditable<DataSourceState> & {
    columns: DataColumnProps<any, any>[],
};

type FilterConfigBase<TFilter extends Record<string, any>> = {
    title: string;
    field: keyof TFilter;
    columnKey?: string;
    isAlwaysVisible?: boolean;
};

type PickerFilterConfig<TFilter extends Record<string, any>> = FilterConfigBase<TFilter> & {
    type: "singlePicker" | "multiPicker";
    dataSource: IDataSource<any, any, any>;
};

type DatePickerFilterConfig<TFilter extends Record<string, any>> = FilterConfigBase<TFilter> & {
    type: "datePicker" | "rangeDatePicker";
};

export type FilterConfig<TFilter extends Record<string, any>> = PickerFilterConfig<TFilter>
    | DatePickerFilterConfig<TFilter>;

export interface ITablePreset<TFilter = Record<string, any>> {
    name: string;
    id: number | null;
    filter: TFilter;
    isReadonly?: boolean;
    columnsConfig: ColumnsConfig;
}

export interface IPresetsApi {
    activePresetId: number | null;
    isDefaultPresetActive: boolean;
    choosePreset(preset: ITablePreset): void;
    createNewPreset(name: string): void;
    resetToDefault(): void;
    hasPresetChanged(preset: ITablePreset): boolean;
    duplicatePreset(preset: ITablePreset): void;
    deletePreset(preset: ITablePreset): void;
    updatePreset(preset: ITablePreset): void;
}

export interface ITableState<TFilter = Record<string, any>> extends IPresetsApi {
    tableState: DataTableState;
    setTableState(newState: DataTableState): void;
    setFilter(filter: TFilter): void;
    setColumnsConfig(columnsConfig: ColumnsConfig): void;
    setFiltersConfig(filtersConfig: FiltersConfig): void;
    presets: ITablePreset<TFilter>[];
}