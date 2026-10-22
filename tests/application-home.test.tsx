import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { describe, expect, it } from 'vitest';
import HomePage from '../web-game/app/page';

Object.assign(globalThis, { React });

describe('application home page', () => {
  it('renders the lobby shell while the client determines its role', () => {
    const markup = renderToStaticMarkup(HomePage());

    expect(markup).toContain('class="lobby-shell');
    expect(markup).toContain('Đang xác định chế độ kết nối');
  });
});
