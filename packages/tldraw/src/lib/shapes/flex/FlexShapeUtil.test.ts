import {
	FlexShapeAlignItemsStyle,
	FlexShapeDirectionStyle,
	FlexShapeJustifyContentStyle,
	TLFlexShape,
	createShapeId,
} from '@tldraw/editor'
import { TestEditor } from '../../../test/TestEditor'
import { getFlexShapeChildUpdates } from './flexLayout'

let editor: TestEditor

const ids = {
	flex: createShapeId('flex'),
	childA: createShapeId('childA'),
	childB: createShapeId('childB'),
}

beforeEach(() => {
	editor = new TestEditor()
})

afterEach(() => {
	editor?.dispose()
})

describe('FlexShapeUtil', () => {
	it('creates a native frame-like flex shape with default props', () => {
		editor.createShape({ id: ids.flex, type: 'flex' })

		expect(editor.getShape(ids.flex)).toMatchObject({
			type: 'flex',
			props: {
				w: 320,
				h: 180,
				direction: 'row',
				wrap: 'nowrap',
				justifyContent: 'flex-start',
				alignItems: 'flex-start',
				alignContent: 'flex-start',
				gap: 'm',
				padding: 'm',
				itemProps: {},
			},
		})
		expect(editor.isShapeFrameLike(ids.flex)).toBe(true)
	})

	it('exposes flex container props through shared style APIs', () => {
		editor.createShape({ id: ids.flex, type: 'flex' })
		editor.select(ids.flex)

		editor.setStyleForSelectedShapes(FlexShapeDirectionStyle, 'column')
		editor.setStyleForSelectedShapes(FlexShapeJustifyContentStyle, 'space-between')
		editor.setStyleForSelectedShapes(FlexShapeAlignItemsStyle, 'stretch')

		expect(editor.getShape(ids.flex)).toMatchObject({
			props: {
				direction: 'column',
				justifyContent: 'space-between',
				alignItems: 'stretch',
			},
		})
	})

	it('turns browser-measured flex item bounds into child updates', () => {
		editor.createShapes([
			{ id: ids.flex, type: 'flex', x: 100, y: 100, props: { w: 300, h: 200 } },
			{
				id: ids.childA,
				type: 'geo',
				parentId: ids.flex,
				x: 0,
				y: 0,
				props: { w: 40, h: 40 },
			},
			{
				id: ids.childB,
				type: 'geo',
				parentId: ids.flex,
				x: 0,
				y: 0,
				props: { w: 40, h: 40 },
			},
		])

		const flex = editor.getShape<TLFlexShape>(ids.flex)!
		expect(flex?.type).toBe('flex')
		const updates = getFlexShapeChildUpdates(editor, flex, [
			{ id: ids.childA, x: 16, y: 16, w: 60, h: 50 },
			{ id: ids.childB, x: 92, y: 16, w: 40, h: 50 },
		])

		expect(updates).toMatchObject([
			{ id: ids.childA, type: 'geo', x: 16, y: 16, props: { w: 60, h: 50 } },
			{ id: ids.childB, type: 'geo', x: 92, y: 16, props: { h: 50 } },
		])
	})
})
