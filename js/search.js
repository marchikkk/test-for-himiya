function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // удаление
        matrix[i][j - 1] + 1,      // вставка
        matrix[i - 1][j - 1] + cost // замена
      );
    }
  }

  return matrix[a.length][b.length];
}

function switchLayout(text) {
  const layoutMap = {
  'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з', '[': 'х', ']': 'ї',
  'a': 'ф', 's': 'і', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д', ';': 'ж', "'": 'є',
  'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь', ',': 'б', '.': 'ю', '`': 'т',
  // Обратно
  'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p', 'х': '[', 'ї': ']',
  'ф': 'a', 'і': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l', 'ж': ';', 'є': "'",
  'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm', 'б': ',', 'ю': '.', 'ы': 's', 'э': "'", 'ё': '`'
};

  return text.split('').map(char => {
    const lowerChar = char.toLowerCase();
    const replaced = layoutMap[lowerChar];
    // Сохраняем регистр, если нужно (но для поиска обычно всё в lowerCase)
    return replaced || char;
  }).join('');
}

function transliterate(text) {
  const ru = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 
    'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    // Украинские буквы
    'і': 'i', 'ї': 'yi', 'є': 'ye', 'ґ': 'g'
  };

  return text.split('').map(char => {
    const lowerChar = char.toLowerCase();
    // Заменяем символ, если он есть в словаре, иначе оставляем как есть
    return ru[lowerChar] || char;
  }).join('');
}


function searchProducts(query) {
  const originalQuery = query.toLowerCase().trim();
  
  // 1. Словарь синонимов
  const manualSynonyms = {
    'шампунь': 'shampoos', 'шампуні': 'shampoos',
    'мило': 'soaps', 'мыло': 'soaps',
    'акції': 'promo',
    // Бренды
    'лореаль': "l'oreal",
    'loreal': "l'oreal",
    'сяоми': 'xiaomi',
    'эпл': 'apple',
    'айфон': 'iphone',
    'самсунг': 'samsung'
  };

  const categoriesList = ['shampoos', 'soaps', 'promo'];

  // Вспомогательная фильтрация
  const filterBy = (q, isCategorySearch = false) => {
    return products.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pName = p.name.toLowerCase();
      const pBrand = p.brand.toLowerCase();

      // ЕСЛИ ищем категорию (через синоним), то ищем ТОЛЬКО строгое совпадение в category
      if (isCategorySearch) return pCat === q;

      // ОБЫЧНЫЙ поиск по вхождению
      const match = pName.includes(q) || pBrand.includes(q) || pCat.includes(q);
      
      // Левенштейн только для длинных слов, чтобы не путать "мило"
      const fuzzy = q.length > 4 && (levenshtein(q, pName) <= 2);
      
      return match || fuzzy;
    });
  };

  // ШАГ 1: Проверка синонимов (Строго)
  if (manualSynonyms[originalQuery]) {
    const target = manualSynonyms[originalQuery];
    const res = filterBy(target, categoriesList.includes(target));
    if (res.length > 0) return res;
  }

  // ШАГ 2: Прямой поиск
  let results = filterBy(originalQuery);
  if (results.length > 0) return results;

  // ШАГ 3: Раскладка / Транслит
  const switched = switchLayout(originalQuery);
  if (switched !== originalQuery) {
    results = filterBy(switched);
    if (results.length > 0) return results;
  }

  return results;
}