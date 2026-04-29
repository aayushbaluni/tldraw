import { TestEditor } from '../../../test/TestEditor'

let editor: TestEditor

beforeEach(() => {
	editor = new TestEditor()
})

afterEach(() => {
	editor?.dispose()
})

describe('FlexShapeTool', () => {
	it('creates flex shapes on click-and-drag', () => {
		editor.setCurrentTool('flex')
		editor.pointerDown(50, 50)
		editor.pointerMove(100, 100)
		editor.pointerUp(100, 100)

		expect(editor.getCurrentPageShapes()).toHaveLength(1)
		expect(editor.getCurrentPageShapes()[0]).toMatchObject({ type: 'flex' })
		expect(editor.getSelectedShapeIds()[0]).toBe(editor.getCurrentPageShapes()[0]?.id)
	})

	it('enters flex.idle when selecting the tool', () => {
		editor.setCurrentTool('flex')
		editor.expectToBeIn('flex.idle')
	})
})
