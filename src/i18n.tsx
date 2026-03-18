import { createContext, useContext, useState, type ReactNode } from 'react'

export type LangCode = 'en' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'ar' | 'zh'

export const LANGUAGES: { code: LangCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ar', label: 'العربية', flag: '🇦🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
]

export type TranslationKey =
  | 'heroSubtitle'
  | 'searchPlaceholder'
  | 'trendingProfiles'
  | 'featuredAssets'
  | 'profiles'
  | 'allAssets'
  | 'follow'
  | 'following'
  | 'atAGlance'
  | 'relationships'
  | 'gossipControversy'
  | 'gossipDisclaimer'
  | 'assets'
  | 'moreProfiles'
  | 'didWeMistake'
  | 'submitSuggestion'
  | 'category'
  | 'netWorth'
  | 'birthday'
  | 'birthplace'
  | 'height'
  | 'profession'
  | 'totalValue'
  | 'moreDetails'
  | 'less'
  | 'likes'
  | 'noResults'
  | 'featuredAthletes'
  | 'featuredActors'
  | 'featuredMusicians'
  | 'featuredPoliticians'
  | 'featuredEntrepreneurs'
  | 'featuredModels'
  | 'exploreTitle'
  | 'exploreSubtitle'

const translations: Record<LangCode, Record<TranslationKey, string>> = {
  en: {
    heroSubtitle: 'Explore verified yachts, jets, watches, and estates owned by the world\'s most notable individuals.',
    searchPlaceholder: 'Search a public figure, category or asset...',
    trendingProfiles: 'Trending Profiles',
    featuredAssets: 'Featured Assets',
    profiles: 'Profiles',
    allAssets: 'All Assets',
    follow: 'Follow',
    following: 'Following',
    atAGlance: 'at a Glance',
    relationships: 'Relationships',
    gossipControversy: 'Gossip & Controversy',
    gossipDisclaimer: 'Based on public news — not verified by Wealth Explorer',
    assets: 'Assets',
    moreProfiles: 'More Profiles',
    didWeMistake: 'Did we make a mistake?',
    submitSuggestion: 'Submit Suggestion',
    category: 'Category',
    netWorth: 'Net Worth',
    birthday: 'Birthday',
    birthplace: 'Birthplace',
    height: 'Height',
    profession: 'Profession',
    totalValue: 'Total Value',
    moreDetails: 'More details',
    less: 'Less',
    likes: 'likes',
    noResults: 'No results found',
    featuredAthletes: 'Featured Athletes',
    featuredActors: 'Featured Actors',
    featuredMusicians: 'Featured Musicians',
    featuredPoliticians: 'Featured Politicians',
    featuredEntrepreneurs: 'Featured Entrepreneurs',
    featuredModels: 'Featured Models',
    exploreTitle: 'Wealth Explorer',
    exploreSubtitle: 'The',
  },
  de: {
    heroSubtitle: 'Entdecken Sie verifizierte Yachten, Jets, Uhren und Anwesen der bekanntesten Persönlichkeiten der Welt.',
    searchPlaceholder: 'Persönlichkeit, Kategorie oder Asset suchen...',
    trendingProfiles: 'Trendige Profile',
    featuredAssets: 'Ausgewählte Assets',
    profiles: 'Profile',
    allAssets: 'Alle Assets',
    follow: 'Folgen',
    following: 'Gefolgt',
    atAGlance: 'auf einen Blick',
    relationships: 'Beziehungen',
    gossipControversy: 'Klatsch & Kontroversen',
    gossipDisclaimer: 'Basierend auf öffentlichen Berichten — nicht von Wealth Explorer verifiziert',
    assets: 'Assets',
    moreProfiles: 'Weitere Profile',
    didWeMistake: 'Haben wir einen Fehler gemacht?',
    submitSuggestion: 'Korrektur einreichen',
    category: 'Kategorie',
    netWorth: 'Vermögen',
    birthday: 'Geburtstag',
    birthplace: 'Geburtsort',
    height: 'Größe',
    profession: 'Beruf',
    totalValue: 'Gesamtwert',
    moreDetails: 'Mehr Details',
    less: 'Weniger',
    likes: 'Likes',
    noResults: 'Keine Ergebnisse',
    featuredAthletes: 'Top-Athleten',
    featuredActors: 'Top-Schauspieler',
    featuredMusicians: 'Top-Musiker',
    featuredPoliticians: 'Top-Politiker',
    featuredEntrepreneurs: 'Top-Unternehmer',
    featuredModels: 'Top-Models',
    exploreTitle: 'Wealth Explorer',
    exploreSubtitle: 'Der',
  },
  fr: {
    heroSubtitle: 'Explorez les yachts, jets, montres et propriétés des personnalités les plus en vue au monde.',
    searchPlaceholder: 'Rechercher une personnalité, catégorie ou bien...',
    trendingProfiles: 'Profils Tendance',
    featuredAssets: 'Assets en Vedette',
    profiles: 'Profils',
    allAssets: 'Tous les Assets',
    follow: 'Suivre',
    following: 'Suivi',
    atAGlance: 'en un coup d\'œil',
    relationships: 'Relations',
    gossipControversy: 'Rumeurs & Controverses',
    gossipDisclaimer: 'Basé sur des informations publiques — non vérifié par Wealth Explorer',
    assets: 'Assets',
    moreProfiles: 'Plus de Profils',
    didWeMistake: 'Avons-nous fait une erreur ?',
    submitSuggestion: 'Soumettre une Correction',
    category: 'Catégorie',
    netWorth: 'Fortune',
    birthday: 'Anniversaire',
    birthplace: 'Lieu de Naissance',
    height: 'Taille',
    profession: 'Profession',
    totalValue: 'Valeur Totale',
    moreDetails: 'Plus de détails',
    less: 'Moins',
    likes: 'j\'aime',
    noResults: 'Aucun résultat',
    featuredAthletes: 'Athlètes en Vedette',
    featuredActors: 'Acteurs en Vedette',
    featuredMusicians: 'Musiciens en Vedette',
    featuredPoliticians: 'Politiciens en Vedette',
    featuredEntrepreneurs: 'Entrepreneurs en Vedette',
    featuredModels: 'Mannequins en Vedette',
    exploreTitle: 'Wealth Explorer',
    exploreSubtitle: 'Le',
  },
  es: {
    heroSubtitle: 'Explora yates, jets, relojes y propiedades verificadas de las personalidades más notables del mundo.',
    searchPlaceholder: 'Buscar una figura pública, categoría o activo...',
    trendingProfiles: 'Perfiles Tendencia',
    featuredAssets: 'Activos Destacados',
    profiles: 'Perfiles',
    allAssets: 'Todos los Activos',
    follow: 'Seguir',
    following: 'Siguiendo',
    atAGlance: 'de un vistazo',
    relationships: 'Relaciones',
    gossipControversy: 'Rumores & Controversias',
    gossipDisclaimer: 'Basado en noticias públicas — no verificado por Wealth Explorer',
    assets: 'Activos',
    moreProfiles: 'Más Perfiles',
    didWeMistake: '¿Cometimos un error?',
    submitSuggestion: 'Enviar Corrección',
    category: 'Categoría',
    netWorth: 'Patrimonio',
    birthday: 'Cumpleaños',
    birthplace: 'Lugar de Nacimiento',
    height: 'Altura',
    profession: 'Profesión',
    totalValue: 'Valor Total',
    moreDetails: 'Más detalles',
    less: 'Menos',
    likes: 'me gusta',
    noResults: 'Sin resultados',
    featuredAthletes: 'Atletas Destacados',
    featuredActors: 'Actores Destacados',
    featuredMusicians: 'Músicos Destacados',
    featuredPoliticians: 'Políticos Destacados',
    featuredEntrepreneurs: 'Empresarios Destacados',
    featuredModels: 'Modelos Destacadas',
    exploreTitle: 'Wealth Explorer',
    exploreSubtitle: 'El',
  },
  it: {
    heroSubtitle: 'Esplora yacht, jet, orologi e proprietà verificati delle personalità più note al mondo.',
    searchPlaceholder: 'Cerca un personaggio pubblico, categoria o bene...',
    trendingProfiles: 'Profili di Tendenza',
    featuredAssets: 'Asset in Evidenza',
    profiles: 'Profili',
    allAssets: 'Tutti gli Asset',
    follow: 'Segui',
    following: 'Seguito',
    atAGlance: 'in sintesi',
    relationships: 'Relazioni',
    gossipControversy: 'Gossip & Controversie',
    gossipDisclaimer: 'Basato su notizie pubbliche — non verificato da Wealth Explorer',
    assets: 'Asset',
    moreProfiles: 'Altri Profili',
    didWeMistake: 'Abbiamo fatto un errore?',
    submitSuggestion: 'Invia Correzione',
    category: 'Categoria',
    netWorth: 'Patrimonio',
    birthday: 'Compleanno',
    birthplace: 'Luogo di Nascita',
    height: 'Altezza',
    profession: 'Professione',
    totalValue: 'Valore Totale',
    moreDetails: 'Più dettagli',
    less: 'Meno',
    likes: 'mi piace',
    noResults: 'Nessun risultato',
    featuredAthletes: 'Atleti in Evidenza',
    featuredActors: 'Attori in Evidenza',
    featuredMusicians: 'Musicisti in Evidenza',
    featuredPoliticians: 'Politici in Evidenza',
    featuredEntrepreneurs: 'Imprenditori in Evidenza',
    featuredModels: 'Modelle in Evidenza',
    exploreTitle: 'Wealth Explorer',
    exploreSubtitle: 'Il',
  },
  pt: {
    heroSubtitle: 'Explore iates, jatos, relógios e propriedades verificadas das personalidades mais notáveis do mundo.',
    searchPlaceholder: 'Pesquisar uma figura pública, categoria ou ativo...',
    trendingProfiles: 'Perfis em Alta',
    featuredAssets: 'Ativos em Destaque',
    profiles: 'Perfis',
    allAssets: 'Todos os Ativos',
    follow: 'Seguir',
    following: 'Seguindo',
    atAGlance: 'em resumo',
    relationships: 'Relacionamentos',
    gossipControversy: 'Fofoca & Controvérsia',
    gossipDisclaimer: 'Baseado em notícias públicas — não verificado pela Wealth Explorer',
    assets: 'Ativos',
    moreProfiles: 'Mais Perfis',
    didWeMistake: 'Cometemos um erro?',
    submitSuggestion: 'Enviar Sugestão',
    category: 'Categoria',
    netWorth: 'Patrimônio',
    birthday: 'Aniversário',
    birthplace: 'Local de Nascimento',
    height: 'Altura',
    profession: 'Profissão',
    totalValue: 'Valor Total',
    moreDetails: 'Mais detalhes',
    less: 'Menos',
    likes: 'curtidas',
    noResults: 'Sem resultados',
    featuredAthletes: 'Atletas em Destaque',
    featuredActors: 'Atores em Destaque',
    featuredMusicians: 'Músicos em Destaque',
    featuredPoliticians: 'Políticos em Destaque',
    featuredEntrepreneurs: 'Empreendedores em Destaque',
    featuredModels: 'Modelos em Destaque',
    exploreTitle: 'Wealth Explorer',
    exploreSubtitle: 'O',
  },
  ar: {
    heroSubtitle: 'استكشف اليخوت والطائرات الخاصة والساعات والعقارات الموثقة لأبرز شخصيات العالم.',
    searchPlaceholder: 'ابحث عن شخصية عامة أو فئة أو أصل...',
    trendingProfiles: 'الملفات الرائجة',
    featuredAssets: 'الأصول المميزة',
    profiles: 'الملفات',
    allAssets: 'جميع الأصول',
    follow: 'متابعة',
    following: 'تتابع',
    atAGlance: 'لمحة سريعة',
    relationships: 'العلاقات',
    gossipControversy: 'الشائعات والجدل',
    gossipDisclaimer: 'استناداً إلى أخبار عامة — غير موثق من Wealth Explorer',
    assets: 'الأصول',
    moreProfiles: 'المزيد من الملفات',
    didWeMistake: 'هل أخطأنا؟',
    submitSuggestion: 'إرسال تصحيح',
    category: 'الفئة',
    netWorth: 'صافي الثروة',
    birthday: 'تاريخ الميلاد',
    birthplace: 'مكان الميلاد',
    height: 'الطول',
    profession: 'المهنة',
    totalValue: 'إجمالي القيمة',
    moreDetails: 'المزيد من التفاصيل',
    less: 'أقل',
    likes: 'إعجاب',
    noResults: 'لا توجد نتائج',
    featuredAthletes: 'رياضيون مميزون',
    featuredActors: 'ممثلون مميزون',
    featuredMusicians: 'موسيقيون مميزون',
    featuredPoliticians: 'سياسيون مميزون',
    featuredEntrepreneurs: 'رجال أعمال مميزون',
    featuredModels: 'عارضات مميزات',
    exploreTitle: 'مستكشف الثروات',
    exploreSubtitle: '',
  },
  zh: {
    heroSubtitle: '探索全球最知名人士的游艇、私人飞机、名表和豪宅。',
    searchPlaceholder: '搜索公众人物、类别或资产...',
    trendingProfiles: '热门档案',
    featuredAssets: '精选资产',
    profiles: '档案',
    allAssets: '全部资产',
    follow: '关注',
    following: '已关注',
    atAGlance: '概览',
    relationships: '人际关系',
    gossipControversy: '八卦与争议',
    gossipDisclaimer: '基于公开新闻 — 未经 Wealth Explorer 核实',
    assets: '资产',
    moreProfiles: '更多档案',
    didWeMistake: '我们犯了错误吗？',
    submitSuggestion: '提交建议',
    category: '类别',
    netWorth: '净资产',
    birthday: '生日',
    birthplace: '出生地',
    height: '身高',
    profession: '职业',
    totalValue: '总价值',
    moreDetails: '更多详情',
    less: '收起',
    likes: '赞',
    noResults: '未找到结果',
    featuredAthletes: '精选运动员',
    featuredActors: '精选演员',
    featuredMusicians: '精选音乐人',
    featuredPoliticians: '精选政治家',
    featuredEntrepreneurs: '精选企业家',
    featuredModels: '精选模特',
    exploreTitle: '财富探索者',
    exploreSubtitle: '',
  },
}

// ── Context ────────────────────────────────────────────────────────────────────
interface LangContextValue {
  lang: LangCode
  setLang: (code: LangCode) => void
  t: (key: TranslationKey) => string
  activeLang: { code: LangCode; label: string; flag: string }
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => translations.en[key],
  activeLang: LANGUAGES[0],
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en')
  const activeLang = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0]

  function t(key: TranslationKey): string {
    return translations[lang][key] ?? translations.en[key]
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t, activeLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
