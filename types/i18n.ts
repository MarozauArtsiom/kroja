// types/i18n.ts
export type SupportedLocale = 'en' | 'pl' | 'de' | 'by' | 'uk';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flagId: string;
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
    items: Array<{
      title: string;
      body: string;
    }>;
  };
  sizes: {
    title: string;
    subtitle: string;
    capacity: string;
    inserts: string;
    build: string;
    weight: string;
    useCases: Record<string, string>;
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
    notDefect: {
      title: string;
      body: string;
    };
    careTitle: string;
    careBody: string;
    schematicNote: string;
    descriptions: Record<string, { description: string; character: string; origin: string; tanning: string; ageing: { m6: string; m12: string; m36: string } }>;
  };
  process: {
    title: string;
    subtitle: string;
    steps: Array<{
      title: string;
      body: string;
    }>;
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
    items: Array<{
      q: string;
      a: string;
    }>;
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
      details: string;
      engraving: string;
      inserts: string;
      giftBox: string;
    };
    thread: string;
    cord: string;
    engravingPlaceholder: string;
    engravingHint: string;
    engravingPositionLabel: string;
    engravingFontLabel: string;
    engravingPositions: {
      'bottom-right': string;
      spine: string;
    };
    engravingFonts: {
      serif: string;
      sans: string;
    };
    giftBoxLabel: string;
    addToCart: string;
    readyIn: string;
    workingDays: string;
    madeToOrder: string;
    inStock: string;
    conflictBanner: string;
    conflictResolved: string;
    capacityLimit: string;
    restorePrompt: string;
    restoreAction: string;
    notifyTitle: string;
    notifySubtitle: string;
    notifySuccess: string;
    notifyPlaceholder: string;
    notifySubmit: string;
    engravingConfirmTitle: string;
    engravingConfirmBody: string;
    engravingConfirmEdit: string;
    engravingConfirmOk: string;
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
    cord: string;
    engraving: string;
    inserts: string;
    giftBox: string;
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
  };
  shotlist: {
    title: string;
    subtitle: string;
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
  colors: Record<string, string>;
  threads: Record<string, string>;
  cords: Record<string, string>;
  leatherNames: Record<string, string>;
  angles: Record<string, string>;
}
