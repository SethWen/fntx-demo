import type { Lang } from '../i18n/translations';

const RULES: Array<{ pattern: RegExp; zh: string; en: string }> = [
  {
    pattern: /collection|ttc|face index/i,
    zh: '这是一个字体合集文件，请先在「字体合集」里选一个字体。',
    en: 'This is a font collection. Pick a single font in Collections first.',
  },
  {
    pattern: /cff|otf.*(not|unsupported)|unsupported.*cff/i,
    zh: '这种字体暂不支持这个操作，可以先在「格式转换」里转成 TTF。',
    en: 'This font does not support that action yet. Convert it to TTF first.',
  },
  {
    pattern: /unknown format|unsupported format|invalid magic|not a font|unrecognized/i,
    zh: '这个文件无法识别，可能不是字体文件，或者格式暂不支持。',
    en: 'This file is not a recognized font, or its format is not supported.',
  },
  {
    pattern: /corrupt|truncated|unexpected eof|invalid table|malformed/i,
    zh: '字体文件可能已损坏，请换一个文件试试。',
    en: 'The font file looks damaged. Please try another file.',
  },
  {
    pattern: /memory|allocation|too large/i,
    zh: '文件太大，浏览器内存不足。可以换个小一点的文件再试。',
    en: 'The file is too large for browser memory. Try a smaller file.',
  },
];

export function friendlyError(error: unknown, lang: Lang): string {
  const message = error instanceof Error ? error.message : String(error);
  const match = RULES.find((rule) => rule.pattern.test(message));
  if (match) return match[lang];
  return lang === 'zh'
    ? '处理失败，请换一个文件或刷新页面再试。'
    : 'Something went wrong. Try another file or refresh the page.';
}
