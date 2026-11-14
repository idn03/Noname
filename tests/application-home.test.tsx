import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import HomePage from '../web-game/app/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

Object.assign(globalThis, { React });

describe('application home page', () => {
  it('renders the lobby shell while the client determines its role', () => {
    const markup = renderToStaticMarkup(HomePage());

    expect(markup).toMatch(/<main\b/);
    expect(markup).toContain('Đang xác định chế độ kết nối');
  });
});
