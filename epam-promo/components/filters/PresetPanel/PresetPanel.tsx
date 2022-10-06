import React, { useCallback, useState } from "react";
import sortBy from "lodash.sortby";
import { DataTableState, IPresetsApi, ITablePreset, getOrderBetween } from "@epam/uui-core";
import { AdaptiveItemProps, AdaptivePanel } from '@epam/uui-components';
import css from './PresetPanel.scss';
import { Button, Dropdown, DropdownContainer, DropdownMenuButton, FlexCell, FlexRow, TabButton } from "../../index";
import { Preset } from "./Preset";
import { PresetInput } from "./PresetInput";
import { ReactComponent as PlusIcon } from "@epam/assets/icons/common/action-add-12.svg";
import { ReactComponent as DeleteIcon } from "@epam/assets/icons/common/action-deleteforever-18.svg";

export interface IPresetsBlockProps extends IPresetsApi {
    tableState: DataTableState;
}

type PresetAdaptiveItem = AdaptiveItemProps<{preset?: ITablePreset }>;

export const PresetPanel = (props: IPresetsBlockProps) => {
    const [isAddingPreset, setIsAddingPreset] = useState(false);

    const setAddingPreset = useCallback(() => {
        setIsAddingPreset(true);
    }, []);

    const cancelAddingPreset = useCallback(() => {
        setIsAddingPreset(false);
    }, []);

    const {presets, ...presetApi} = props;

    const renderDefaultPreset = () => {
        return (
            <TabButton
                caption='Default Preset'
                onClick={ props.resetToDefault }
                size="60"
                isLinkActive={ !props.activePresetId }
            />
        );
    };

    const renderPreset = (preset: ITablePreset) => {
        return (
            <Preset key={ preset.id } preset={ preset } addPreset={ setAddingPreset } { ...presetApi }/>
        );
    };

    const renderAddPresetButton = useCallback(() => {
        return !isAddingPreset ?
            <TabButton
                caption={ 'Add Preset' }
                onClick={ setAddingPreset }
                size="36"
                icon={ PlusIcon }
                iconPosition="left"
            />
            : <PresetInput
                onCancel={ cancelAddingPreset }
                key={ 'createPresetInput' }
                onSuccess={ props.createNewPreset }
            />;
    }, [isAddingPreset]);

    const onPresetDropdownSelect = (preset: PresetAdaptiveItem, hiddenItems: PresetAdaptiveItem[]) => {
        const displayedPresets = presets.filter(i => !hiddenItems.find((hiddenItem) => (hiddenItem.preset.id === i.id && !hiddenItem.collapsedContainer)));
        const sortedDisplayedPresets = sortBy(displayedPresets, (i) => i.order).reverse();
        props.choosePreset(preset.preset);
        props.updatePreset({
            ...preset.preset,
            order: getOrderBetween(sortedDisplayedPresets[1].order, sortedDisplayedPresets[0].order),
        });
    };

    const renderMoreButtonDropdown = (item: PresetAdaptiveItem, hiddenItems: PresetAdaptiveItem[]) => {
        return (
            <Dropdown
                renderTarget={ (props) =>
                    <FlexRow>
                        <div className={ css.divider } />
                        <Button fill='light' color='gray50' caption={ `${hiddenItems?.length || ''} more` } { ...props } />
                    </FlexRow>
            }
                renderBody={ () => <DropdownContainer width={ 230 }>
                    {
                        hiddenItems.map(item =>
                            <DropdownMenuButton
                                onClick={ () => onPresetDropdownSelect(item, hiddenItems) }
                                caption={ item.preset.name }
                                icon={ DeleteIcon }
                                iconPosition='right'
                                onIconClick={ () => props.deletePreset(item.preset) }
                            />)
                    }
                </DropdownContainer> }
            />
        );
    };

    const getPanelItems = (): PresetAdaptiveItem[] => {
        return [
            {id: 'default', render: () => renderDefaultPreset(), priority: 100500 },
            ...sortBy(props.presets, (i) => i.order).map((preset, index) => ({id: preset.id.toString(), render: () => renderPreset(preset), priority: 1000 - index, preset: preset })),
            { id: 'collapsedContainer', render: renderMoreButtonDropdown,
                priority: 100500, collapsedContainer: true,
            },
            {id: 'addPreset', render: () => renderAddPresetButton(), priority: 100500 },
        ];
    };

    return (
        <FlexCell grow={ 1 }>
            <FlexRow spacing='12'>
                <AdaptivePanel items={ getPanelItems() } />
            </FlexRow>
        </FlexCell>

    );
};
