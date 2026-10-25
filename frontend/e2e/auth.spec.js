import { test, expect } from '@playwright/test'

test('shows login page when not authenticated', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel(/username/i)).toBeVisible()
  await expect(page.getByLabel(/password/i)).toBeVisible()
})

test('login with valid credentials shows dashboard', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(/username/i).fill('admin')
  await page.getByLabel(/password/i).fill('admin123')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page.getByRole('button', { name: /^home$/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /^tickets$/i })).toBeVisible()
})

test('sign out returns to login page', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(/username/i).fill('admin')
  await page.getByLabel(/password/i).fill('admin123')
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.getByRole('button', { name: /sign out/i }).click()
  await expect(page.getByLabel(/username/i)).toBeVisible()
})

test('shows error on invalid credentials', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel(/username/i).fill('admin')
  await page.getByLabel(/password/i).fill('wrongpassword')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page.getByText(/invalid username or password/i)).toBeVisible()
})
