// types/i18n.ts
import type {
  Angle,
  ClosureCode,
  ColorCode,
  ElasticColorCode,
  EmbossingFont,
  EmbossingPosition,
  InsertType,
  LeatherCode,
  PenHolderCode,
  SizeCode,
  ThreadCode,
} from '@/types/config';

export type SupportedLocale = 'en' | 'pl' | 'de' | 'by' | 'uk';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flagId: string;
}

export interface LeatherCopy {
  description: string;
  character: string;
  origin: string;
  tanning: string;
  ageing: { m6: string; m12: string; m36: string };
}

export interface Dictionary {
  brand: {
    name: string;
    tagline: string;
    city: string;
  };
  nav: {
    materials: string;
    craft: string;
    faq: string;
    shotlist: string;
    build: string;
    cart: string;
    backToHome: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
    trust: string;
  };
  reasons: {
    title: string;
    items: Array<{ title: string; body: string }>;
  };
  sizes: {
    title: string;
    subtitle: string;
    capacity: string;
    inserts: string;
    build: string;
    weight: string;
    cardSlots: string;
    upTo: string;
    useCases: Record<SizeCode, string>;
  };
  leather: {
    title: string;
    subtitle: string;
    origin: string;
    tanning: string;
    thickness: string;
    scratchResistance: string;
    patinaSpeed: string;
    softness: string;
    ageingTitle: string;
    m6: string;
    m12: string;
    m36: string;
    build: string;
    notDefect: { title: string; body: string };
    careTitle: string;
    careBody: string;
    schematicNote: string;
    descriptions: Record<LeatherCode, LeatherCopy>;
  };
  process: {
    title: string;
    subtitle: string;
    steps: Array<{ title: string; body: string }>;
    madeByHand: string;
  };
  included: {
    title: string;
    items: string[];
    compatibilityTitle: string;
    compatibility: string;
    timeTitle: string;
    timeBody: string;
    footerNote: string;
  };
  faq: {
    title: string;
    items: Array<{ q: string; a: string }>;
  };
  finalCta: {
    title: string;
    body: string;
    cta: string;
  };
  configurator: {
    title: string;
    steps: {
      size: string;
      leather: string;
      color: string;
      thread: string;
      closure: string;
      penHolder: string;
      cardSlots: string;
      embossing: string;
      inserts: string;
      giftBox: string;
    };
    /** Uses {mm} */
    threadThickness: string;
    embossingPlaceholder: string;
    /** Uses {max} */
    embossingHint: string;
    embossingNote: string;
    embossingPositionLabel: string;
    embossingFontLabel: string;
    embossingPositions: Record<EmbossingPosition, string>;
    embossingFonts: Record<EmbossingFont, string>;
    embossingConfirmTitle: string;
    embossingConfirmBody: string;
    embossingConfirmEdit: string;
    embossingConfirmOk: string;
    closures: Record<ClosureCode, { title: string; note: string }>;
    elasticColor: string;
    penHolders: Record<PenHolderCode, { title: string; meta: string }>;
    penHolderHelp: string;
    penHolderGuideLabel: string;
    /** Uses {max} and {count} */
    cardSlotsHint: string;
    cardSlotsMeta: string;
    cardSlotsInside: string;
    /** Uses {max} and {count} */
    insertsHint: string;
    /** Uses {name} */
    addOne: string;
    /** Uses {name} */
    removeOne: string;
    giftBoxLabel: string;
    addToCart: string;
    readyIn: string;
    workingDays: string;
    madeToOrder: string;
    inStock: string;
    conflictBanner: string;
    restorePrompt: string;
    restoreAction: string;
    notifyTitle: string;
    notifySubtitle: string;
    notifySuccess: string;
    notifyPlaceholder: string;
    notifySubmit: string;
  };
  cart: {
    title: string;
    empty: string;
    emptySubtitle: string;
    buildFirst: string;
    size: string;
    leather: string;
    color: string;
    thread: string;
    closure: string;
    penHolder: string;
    cardSlots: string;
    embossing: string;
    inserts: string;
    giftBox: string;
    elasticNote: string;
    qty: string;
    remove: string;
    edit: string;
    total: string;
    reserve: string;
    reserveTitle: string;
    reserveBody: string;
    reserveEmailPlaceholder: string;
    reserveSubmit: string;
    reserveSuccess: string;
    reserveSuccessBody: string;
    reserveError: string;
  };
  shotlist: {
    title: string;
    subtitle: string;
    postponedNote: string;
    totalLabel: string;
    generated: string;
    productShots: string;
    storyShots: string;
    rulesTitle: string;
    hatchLegendTitle: string;
    print: string;
    exportMd: string;
    exportCsv: string;
    mustShow: string;
    shotsCount: string;
    viewLabel: string;
  };
  footer: {
    line: string;
    rights: string;
  };
  notFound: {
    title: string;
    body: string;
    back: string;
  };
  colors: Record<ColorCode, string>;
  threads: Record<ThreadCode, string>;
  elasticColors: Record<ElasticColorCode, string>;
  insertTypes: Record<InsertType, string>;
  leatherNames: Record<LeatherCode, string>;
  angles: Record<Angle, string>;
}
