import { SharedStyle, TLFlexShape, TLFlexShapeItemProps, useEditor, useValue } from '@tldraw/editor'
import { useMemo } from 'react'
import { FLEX_ITEM_DEFAULTS } from '../../../shapes/flex/flexLayout'
import { STYLES, StyleValuesForUi } from '../../../styles'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { StylePanelSection } from './DefaultStylePanelContent'
import { StylePanelButtonPicker } from './StylePanelButtonPicker'
import { StylePanelSubheading } from './StylePanelSubheading'

type FlexItemStyleKey = keyof TLFlexShapeItemProps

const flexItemStyleProps = {
	alignSelf: {
		id: 'tldraw:flexItemAlignSelf',
		defaultValue: FLEX_ITEM_DEFAULTS.alignSelf,
		values: STYLES.flexAlignSelf.map((item) => item.value),
		validate: (value: unknown) => value,
	},
	flexGrow: {
		id: 'tldraw:flexItemGrow',
		defaultValue: String(FLEX_ITEM_DEFAULTS.flexGrow),
		values: STYLES.flexGrow.map((item) => item.value),
		validate: (value: unknown) => value,
	},
	flexShrink: {
		id: 'tldraw:flexItemShrink',
		defaultValue: String(FLEX_ITEM_DEFAULTS.flexShrink),
		values: STYLES.flexShrink.map((item) => item.value),
		validate: (value: unknown) => value,
	},
	flexBasis: {
		id: 'tldraw:flexItemBasis',
		defaultValue: FLEX_ITEM_DEFAULTS.flexBasis,
		values: STYLES.flexBasis.map((item) => item.value),
		validate: (value: unknown) => value,
	},
	order: {
		id: 'tldraw:flexItemOrder',
		defaultValue: String(FLEX_ITEM_DEFAULTS.order),
		values: STYLES.flexOrder.map((item) => item.value),
		validate: (value: unknown) => value,
	},
} as const

/** @public @react */
export function InheritedStylePanelContent() {
	const editor = useEditor()
	const msg = useTranslation()
	const selectedShapes = useValue('selected flex item shapes', () => editor.getSelectedShapes(), [
		editor,
	])
	const shape = selectedShapes[0]
	const parent = getCommonFlexParent(editor, selectedShapes)

	const itemProps = useMemo(() => {
		if (!parent || !shape) return FLEX_ITEM_DEFAULTS
		return { ...FLEX_ITEM_DEFAULTS, ...parent.props.itemProps[shape.id] }
	}, [parent, shape])

	if (!parent || !shape) return null

	const setItemProp = (key: FlexItemStyleKey, value: string) => {
		const nextItemProps = { ...parent.props.itemProps }
		for (const child of selectedShapes) {
			const existing = { ...FLEX_ITEM_DEFAULTS, ...parent.props.itemProps[child.id] }
			nextItemProps[child.id] = {
				...existing,
				[key]: flexItemStyleProps[key].validate(value),
			}
		}
		editor.updateShape<TLFlexShape>({
			id: parent.id,
			type: parent.type,
			props: {
				itemProps: nextItemProps,
			},
		})
	}

	return (
		<StylePanelSection>
			<StylePanelSubheading>{msg('style-panel.flex-item')}</StylePanelSubheading>
			<FlexItemPicker
				keyName="alignSelf"
				title={msg('style-panel.flex-align-self')}
				uiType="flex-align-self"
				items={STYLES.flexAlignSelf}
				value={itemProps.alignSelf}
				onValueChange={setItemProp}
			/>
			<FlexItemPicker
				keyName="flexGrow"
				title={msg('style-panel.flex-grow')}
				uiType="flex-grow"
				items={STYLES.flexGrow}
				value={String(itemProps.flexGrow)}
				onValueChange={setItemProp}
			/>
			<FlexItemPicker
				keyName="flexShrink"
				title={msg('style-panel.flex-shrink')}
				uiType="flex-shrink"
				items={STYLES.flexShrink}
				value={String(itemProps.flexShrink)}
				onValueChange={setItemProp}
			/>
			<FlexItemPicker
				keyName="flexBasis"
				title={msg('style-panel.flex-basis')}
				uiType="flex-basis"
				items={STYLES.flexBasis}
				value={itemProps.flexBasis}
				onValueChange={setItemProp}
			/>
			<FlexItemPicker
				keyName="order"
				title={msg('style-panel.flex-order')}
				uiType="flex-order"
				items={STYLES.flexOrder}
				value={String(itemProps.order)}
				onValueChange={setItemProp}
			/>
		</StylePanelSection>
	)
}

function FlexItemPicker({
	keyName,
	title,
	uiType,
	items,
	value,
	onValueChange,
}: {
	keyName: FlexItemStyleKey
	title: string
	uiType: string
	items: StyleValuesForUi<string>
	value: string
	onValueChange(key: FlexItemStyleKey, value: string): void
}) {
	return (
		<StylePanelButtonPicker
			title={title}
			uiType={uiType}
			style={flexItemStyleProps[keyName]}
			items={items}
			value={{ type: 'shared', value } satisfies SharedStyle<string>}
			onValueChange={(_style, value) => onValueChange(keyName, value)}
			onHistoryMark={() => {}}
		/>
	)
}
