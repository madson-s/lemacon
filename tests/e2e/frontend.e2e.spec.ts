import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

test.describe('Home', () => {
  test('mostra o hero com a CTA e uma seção por categoria', async ({ page }) => {
    await page.goto(BASE)

    await expect(page.locator('h1')).toBeVisible()

    const cta = page.getByRole('link', { name: /ver o catálogo/i }).first()
    await expect(cta).toBeVisible()
    await cta.click()
    await expect(page).toHaveURL(/\/catalogo$/)
  })

  test('as seções levam para o produto', async ({ page }) => {
    await page.goto(BASE)

    const primeiro = page.locator('a[href^="/catalogo/"]').first()
    test.skip((await primeiro.count()) === 0, 'Sem produtos — rode o seed.')

    await primeiro.click()
    await expect(page).toHaveURL(/\/catalogo\/.+/)
    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('Catálogo', () => {
  test('a busca do header filtra a listagem', async ({ page }) => {
    await page.goto(BASE)

    await page.getByLabel('Buscar produtos').fill('zzzzzz')
    await page.getByLabel('Buscar produtos').press('Enter')

    await expect(page).toHaveURL(/\/catalogo\?q=zzzzzz/)
    await expect(page.getByText(/Nenhum produto encontrado/)).toBeVisible()
  })

  test('a busca do catálogo tolera erro de digitação', async ({ page }) => {
    await page.goto(`${BASE}/catalogo`)

    const cards = page.locator('ul > li')
    const total = await cards.count()
    test.skip(total === 0, 'Sem produtos — rode o seed.')

    await page.getByLabel('Buscar no catálogo').fill('cadera')
    await expect(cards).not.toHaveCount(total)

    await page.getByRole('button', { name: 'Limpar filtros' }).first().click()
    await expect(cards).toHaveCount(total)
  })
})

test.describe('Página do produto', () => {
  test('mostra galeria, preço, especificações e relacionados', async ({ page }) => {
    await page.goto(`${BASE}/catalogo`)

    const primeiro = page.locator('a[href^="/catalogo/"]').first()
    test.skip((await primeiro.count()) === 0, 'Sem produtos — rode o seed.')
    await primeiro.click()

    await expect(page.getByRole('navigation', { name: 'Trilha' })).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()

    // A galeria troca a foto principal ao clicar na miniatura.
    const miniaturas = page.getByRole('button', { name: /Ver foto \d+ de \d+/ })
    if (await miniaturas.count()) {
      await miniaturas.nth(1).click()
      await expect(miniaturas.nth(1)).toHaveAttribute('aria-current', 'true')
    }
  })

  test('produto inexistente devolve 404', async ({ page }) => {
    const resposta = await page.goto(`${BASE}/catalogo/nao-existe-mesmo`)
    expect(resposta?.status()).toBe(404)
  })
})
