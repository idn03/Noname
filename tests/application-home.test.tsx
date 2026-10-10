import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { describe, expect, it } from 'vitest';
import HomePage from '../web-game/app/page';

Object.assign(globalThis, { React });

describe('application home page', () => {
  it('renders the Noname heading', () => {
    const markup = renderToStaticMarkup(HomePage());

    expect(markup).toContain('<h1');
    expect(markup).toContain('>Noname</h1>');
  });
});
