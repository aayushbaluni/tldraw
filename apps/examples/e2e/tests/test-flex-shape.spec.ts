import { Page, expect } from '@playwright/test'
import { Editor, TLShapeId } from 'tldraw'
import test from '../fixtures/fixtures'
import { setupOrReset } from '../shared-e2e'

declare const editor: Editor

async function getShapeX(page: Page, id: TLShapeId) {
	const anyPage = page as any
	return anyPage.evaluate((shapeId: string) => editor.getShape(shapeId as TLShapeId)!.x, id)
}

async function getShapeY(page: Page, id: TLShapeId) {
	const anyPage = page as any
	return anyPage.evaluate((shapeId: string) => editor.getShape(shapeId as TLShapeId)!.y, id)
}

async function getFlexGrow(page: Page) {
	const anyPage = page as any
	return anyPage.evaluate(() => {
		const flex = editor.getShape('shape:flex-e2e' as TLShapeId) as any
		return flex?.props.itemProps['shape:child-a']?.flexGrow
	})
}

test.describe('Flex shape', () => {
	test.beforeEach(setupOrReset)

	test('lays out children with real flexbox CSS and shows inherited flex item controls', async ({
		page,
	}) => {
		const ids = {
			flexId: 'shape:flex-e2e' as TLShapeId,
			childA: 'shape:child-a' as TLShapeId,
			childB: 'shape:child-b' as TLShapeId,
		}
		await page.evaluate(() => {
			editor.createShapes([
				{
					id: 'shape:flex-e2e' as TLShapeId,
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
					id: 'shape:child-a' as TLShapeId,
					type: 'geo',
					parentId: 'shape:flex-e2e' as TLShapeId,
					x: 0,
					y: 0,
					props: { w: 50, h: 40 },
				},
				{
					id: 'shape:child-b' as TLShapeId,
					type: 'geo',
					parentId: 'shape:flex-e2e' as TLShapeId,
					x: 0,
					y: 0,
					props: { w: 50, h: 40 },
				},
			])
		})

		const flexMeasure = page.locator('.tl-flex__measure').first()
		await expect(flexMeasure).toHaveCSS('display', 'flex')
		await expect(flexMeasure).toHaveCSS('justify-content', 'space-between')

		await expect.poll(() => getShapeX(page, ids.childA)).toBe(16)
		await expect.poll(() => getShapeY(page, ids.childA)).toBe(40)
		await expect.poll(() => getShapeX(page, ids.childB)).toBe(234)
		await expect.poll(() => getShapeY(page, ids.childB)).toBe(40)

		await page.mouse.click(141, 160)
		await expect(page.getByText('Flex item')).toBeVisible()
		await page.getByTestId('style.flex-grow.1').click()

		await expect.poll(() => getFlexGrow(page)).toBe(1)
	})
})
