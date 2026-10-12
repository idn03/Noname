import bundledContentData from './bundled-content.json' with { type: 'json' };
import type { CategoryContent } from './content-validation';

export const bundledContent: readonly CategoryContent[] = bundledContentData;
