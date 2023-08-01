import * as React from 'react';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { PickerInputBaseProps } from '@epam/uui-components';
import { DataPickerRow, PickerInput, PickerItem } from '@epam/loveship';
import { PickerInputProps } from '@epam/uui';
import { Button, LinkButton } from '@epam/loveship';
import { SearchInput, Switch } from '@epam/loveship';
import {
    iEditable, sizeDoc, isDisabledDoc, modeDoc, iconDoc, iconOptionsDoc,
} from '../../docs';
import {
    DefaultContext, ResizableContext, TableContext, FormContext,
} from '../../docs';
import { pickerBaseOptionsDoc } from './common';
import { FlexCell, FlexRow } from '@epam/loveship';
import { Text } from '@epam/loveship';
import css from './DataPickerRowDoc.module.scss';

const PickerInputDoc = new DocBuilder<PickerInputBaseProps<any, any> & PickerInputProps>({ name: 'PickerInput', component: PickerInput })
    .implements([
        sizeDoc, isDisabledDoc, isReadonlyDoc, iEditable, pickerBaseOptionsDoc, modeDoc, iconDoc, iconOptionsDoc,
    ])
    .prop('cascadeSelection', {
        examples: [
            true, 'explicit', 'implicit',
        ],
    })
    .prop('value', {
        examples: [
            { name: '1', value: 1 }, { name: '[1, 2]', value: [1, 2] }, { name: '{ id: 1, name: "Test"}', value: { id: 1, name: 'Test' } }, { name: '[{ id: 1, name: "Test"}]', value: [{ id: 1, name: 'Test' }] },
        ],
    })
    .prop('valueType', { examples: ['id', 'entity'], isRequired: true })
    .prop('selectionMode', { examples: ['single', 'multi'], isRequired: true })
    .prop('maxItems', {
        examples: [
            0, 1, 5, 10, 50, 100, 1000,
        ],
    })
    .prop('minCharsToSearch', {
        examples: [
            0, 1, 3, 5,
        ],
    })
    .prop('editMode', { examples: ['dropdown', 'modal'], isRequired: false, defaultValue: 'dropdown' })
    .prop('isInvalid', { examples: [true] })
    .prop('isSingleLine', { examples: [true] })
    .prop('isFoldedByDefault', { examples: [{ value: () => false, name: '(item) => false' }] })
    .prop('placeholder', { examples: ['Select Country', 'Select Person'], type: 'string', defaultValue: 'Please select' })
    .prop('minBodyWidth', {
        examples: [
            100, 150, 200, 250, 300, 360, 400,
        ],
        defaultValue: 360,
    })
    .prop('dropdownHeight', {
        examples: [
            100, 200, 300,
        ],
        defaultValue: 300,
    })
    .prop('renderToggler', {
        examples: [
            {
                name: 'Button',
                value: (props) => <Button { ...props } caption={ props.selection.map((s) => s.value.name).join(', ') } />,
            }, {
                name: 'LinkButton',
                value: (props) => <LinkButton { ...props } caption={ props.selection.map((s) => s.value.name).join(', ') } />,
            }, {
                name: 'Search',
                value: (props) => <SearchInput value="" onValueChange={ null } { ...props } />,
            },
        ],
    })
    .prop('getRowOptions', { examples: [{ name: 'Disabled rows', value: () => ({ isDisabled: true }) }] })
    .prop('searchPosition', {
        examples: [
            'input', 'body', 'none',
        ],
        defaultValue: 'input',
    })
    .prop('disableClear', { examples: [true], defaultValue: false })
    .prop('renderNotFound', {
        examples: () => [
            {
                name: 'Custom not found block',
                value: () => (
                    <FlexCell grow={ 1 } textAlign="center">
                        <Text>Custom Text or Component</Text>
                    </FlexCell>
                ),
            },
        ],
    })
    .prop('renderFooter', {
        examples: () => [
            {
                name: 'Custom Footer',
                value: (props) => (
                    <FlexRow padding="12">
                        <Switch value={ props.showSelected.value } onValueChange={ props.showSelected.onValueChange } label="Show selected" />
                    </FlexRow>
                ),
            },
        ],
    })
    .prop('autoFocus', { examples: [true, { value: false, isDefault: true }] })
    .prop('renderRow', {
        examples: (ctx) => [
            {
                name: 'UserPickerRow',
                value: (props) => (
                    <DataPickerRow
                        { ...props }
                        key={ props.rowKey }
                        alignActions="center"
                        padding={ (ctx.getSelectedProps() as any).editMode === 'modal' ? '24' : '12' }
                        renderItem={ (item, rowProps) => <PickerItem { ...rowProps } avatarUrl={ item.avatarUrl } title={ item.name } subtitle={ item.jobTitle } /> }
                    />
                ),
            }, {
                name: 'Skills',
                value: (rowProps) => {
                    const isParent = !rowProps.value.parentId;
                    return (
                        <DataPickerRow
                            { ...rowProps }
                            depth={ isParent ? 0 : 1 }
                            cx={ isParent && css.parent }
                            isFoldable={ false }
                            isChecked={ isParent ? false : rowProps.isChecked }
                            isChildrenChecked={ false }
                            isSelectable={ isParent ? false : rowProps.isSelectable }
                            isFocused={ isParent ? false : rowProps.isFocused }
                            borderBottom="none"
                            size="36"
                            renderItem={ (i) => <Text size="36">{i.name}</Text> }
                        />
                    );
                },
            },
        ],
    })
    .withContexts(DefaultContext, ResizableContext, TableContext, FormContext);

export default PickerInputDoc;
