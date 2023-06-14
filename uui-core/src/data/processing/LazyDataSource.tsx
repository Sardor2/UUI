import { LazyListView, LazyListViewProps, NOT_FOUND_RECORD } from './views';
import { ListApiCache } from './ListApiCache';
import { BaseDataSource } from './BaseDataSource';
import { useEffect, useMemo, useRef } from 'react';
import { DataSourceState } from '../../types';

export interface LazyDataSourceProps<TItem, TId, TFilter> extends LazyListViewProps<TItem, TId, TFilter> {}

export class LazyDataSource<TItem = any, TId = any, TFilter = any> extends BaseDataSource<TItem, TId, TFilter> {
    props: LazyDataSourceProps<TItem, TId, TFilter>;
    cache: ListApiCache<TItem, TId, TFilter> = null;
    constructor(props: LazyDataSourceProps<TItem, TId, TFilter>) {
        super(props);
        this.props = props;
        this.initCache();
    }
     
    public setProps(props: LazyDataSourceProps<TItem, TId, TFilter>) {}

    public getById = (id: TId): TItem | void => {
        const item = this.cache.byId(id);
        if (item === NOT_FOUND_RECORD) {
            return;
        }
        return item;
    };

    private initCache() {
        this.cache = new ListApiCache({
            api: this.props.api,
            getId: this.getId,
            onUpdate: this.updateViews,
        });
    }

    setItem(item: TItem) {
        this.cache.setItem(item);
    }

    public clearCache() {
        this.initCache();
        this.views.forEach((view) => view.reload());
    }

    public getView = <TState extends DataSourceState<any, TId>>(
        value: TState,
        onValueChange: (value: TState) => void,
        props?: Partial<LazyListViewProps<TItem, TId, TFilter>>,
    ): LazyListView<TItem, TId, TFilter> => {
        const view = this.views.get(onValueChange) as LazyListView<TItem, TId, TFilter>;
        const viewProps: LazyListViewProps<TItem, TId, TFilter> = {
            ...this.props,
            getId: this.getId,
            ...props,
        };

        if (view) {
            view.update(value, viewProps);
            return view;
        } else {
            const newView = new LazyListView({ value, onValueChange }, viewProps, this.cache);
            this.views.set(onValueChange, newView);
            return newView;
        }
    };

    useView<TState extends DataSourceState<any, TId>>(
        value: TState,
        onValueChange: (val: TState) => void,
        props?: Partial<LazyListViewProps<TItem, TId, TFilter>>,
        deps: any[] = [],
    ): LazyListView<TItem, TId, TFilter> {
        const onValueChangeRef = useRef(null);
        onValueChangeRef.current = onValueChange;
        const viewProps: LazyListViewProps<TItem, TId, TFilter> = {
            ...this.props,
            getId: this.getId,
            ...props,
        };
         
        const view = useMemo(
            () => new LazyListView({ value, onValueChange: onValueChangeRef.current }, viewProps, this.cache),
            deps,
        );
         
        useEffect(() => {
            this.subs.set(view, view._forceUpdate);
            return () => {
                this.subs.delete(view);
            };
        }, [view]);

        view.update(value, viewProps);
        return view;
    }
}
