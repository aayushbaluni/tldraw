import { expect } from '@playwright/test'
import { Editor, TLFlexShape, TLShapeId, createShapeId } from 'tldraw'
import test from '../fixtures/fixtures'
import { setupOrReset } from '../shared-e2e'

declare const editor: Editor

test.describe('Flex shape', () => {
	test.beforeEach(setupOrReset)

	test('lays out children with real flexbox CSS and shows inherited flex item controls', async ({
		page,
	}) => {
		const ids = await page.evaluate(() => {
			const flexId = createShapeId('flex-e2e')
			const childA = createShapeId('child-a')
			const childB = createShapeId('child-b')
			editor.createShapes([
				{
					id: flexId,
					type: 'flex',
					x: 100,
					y: 100,
					props: {
						w: 300,
						h: 120,
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: 'none',
						padding: 'm',
					},
				},
				{
					id: childA,
					type: 'geo',
					parentId: flexId,
					x: 0,
					y: 0,
					props: { w: 50, h: 40 },
				},
				{
					id: childB,
					type: 'geo',
					parentId: flexId,
					x: 0,
					y: 0,
					props: { w: 50, h: 40 },
				},
			])
			return { flexId, childA, childB }
		})

		const flexMeasure = page.locator('.tl-flex__measure').first()
		await expect(flexMeasure).toHaveCSS('display', 'flex')
		await expect(flexMeasure).toHaveCSS('justify-content', 'space-between')

		await expect
			.poll(() =>
				page.evaluate(
					({ childA, childB }) => ({
						childA: editor.getShape(childA as TLShapeId),
						childB: editor.getShape(childB as TLShapeId),
					}),
					ids
				)
			)
			.toMatchObject({
				childA: { x: 16, y: 40 },
				childB: { x: 234, y: 40 },
			})

		await page.evaluate(({ childA }) => editor.select(childA as TLShapeId), ids)
		await expect(page.getByText('Flex item')).toBeVisible()
		await page.getByTestId('style.flex-grow.1').click()

		await expect
			.poll(() =>
				page.evaluate(
					({ flexId, childA }) =>
						(editor.getShape(flexId as TLShapeId) as TLFlexShape)?.props.itemProps[
							childA as TLShapeId
						],
					ids
				)
			)
			.toMatchObject({ flexGrow: 1 })
	})
})
