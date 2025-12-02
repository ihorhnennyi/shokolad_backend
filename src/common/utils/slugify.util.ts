const translitMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ye',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'yi',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'yu',
  я: 'ya',
  ё: 'yo',
  ы: 'y',
  э: 'e',
};

export function slugify(text: string): string {
  if (!text) return '';

  const lower = text.toLowerCase().trim();

  let result = '';
  for (const char of lower) {
    if (translitMap[char]) {
      result += translitMap[char];
    } else if (/[a-z0-9]/.test(char)) {
      result += char;
    } else {
      result += '-';
    }
  }

  return result.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}
