// types/i18n.ts
import type {
  Angle,
  ClosureCode,
  ColorCode,
  EmbossingFont,
  EmbossingPosition,
  Flap,
  InsertType,
  LeatherCode,
  PenHolderCode,
  PocketKind,
  SizeCode,
  ThreadCode,
} from '@/types/config';

export type SupportedLocale = 'en' | 'pl' | 'de' | 'by' | 'uk' | 'ru';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
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
    pockets: string;
    included: string;
    useCases: Record<SizeCode, string>;
    names: Record<SizeCode, string>;
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
      pockets: string;
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
    embossingConfirmTitle: string;
    embossingConfirmBody: string;
    embossingConfirmEdit: string;
    embossingConfirmOk: string;
    penHolderHelp: string;
    penHolderGuideLabel: string;
    /** Uses {price} */
    insertsIncluded: string;
    /** Uses {max} and {count} */
    insertsHint: string;
    pocketsIncluded: string;
    pocketsHint: string;
    /** Uses {used} and {budget} */
    pocketsBudget: string;
    pocketsEmpty: string;
    pocketsAdd: string;
    pocketsDivide: string;
    /** Uses {name} */
    pocketsMoveUp: string;
    /** Uses {name} */
    pocketsMoveDown: string;
    /** Uses {name} */
    pocketsRemove: string;
    pocketsTop: string;
    pocketsBottom: string;
    /** Uses {name} */
    addOne: string;
    /** Uses {name} */
    removeOne: string;
    giftBoxLabel: string;
    addToCart: string;
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
  /** Names of the values a customer picks. Read by both the configurator and the cart. */
  options: {
    closures: Record<ClosureCode, { title: string; note: string }>;
    penHolders: Record<PenHolderCode, { title: string; meta: string }>;
    pockets: Record<PocketKind, { title: string; meta: string }>;
    flaps: Record<Flap, string>;
    embossingFonts: Record<EmbossingFont, string>;
    embossingPositions: Record<EmbossingPosition, string>;
    readyIn: string;
    workingDays: string;
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
    pockets: string;
    pocketsNone: string;
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
    /** Rules that apply to every product shot. */
    rules: string[];
    /** What each angle must show. */
    angleMustShow: Record<Angle, string[]>;
    /** Story shots, keyed by shot id. */
    stories: Record<string, { subject: string; requirement: string; why: string }>;
    /** {index} */
    shotNumber: string;
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
  /** Labels a screen reader announces. Not visible on screen, still user-facing. */
  a11y: {
    selectLanguage: string;
    /** {language} — the native name of the current language */
    currentLanguage: string;
    /** {label}, {value} — a 1–5 rating read out by a screen reader */
    ratingOutOf: string;
    /** {slim}, {wide} — diameters with their unit, e.g. "10 mm" */
    loopDiameters: string;
    closeCart: string;
    emailField: string;
    previewAngle: string;
    sizeGroup: string;
    leatherGroup: string;
    colorGroup: string;
    leatherTabs: string;
  };
  /** Alt text of the landing illustrations. */
  illustrations: {
    /** Alt text of each illustration; also its accessible name when drawn inline. */
    hero: string;
    stitch: string;
    refill: string;
    /** Text drawn inside the stitch illustration */
    stitchTitle: string;
    stitchLine1: string;
    stitchLine2: string;
    stitchPoint: string;
    /** Text drawn inside the refill illustration */
    refillCover: string;
    refillMany: string;
  };
  /** Page metadata: search results and link previews. */
  meta: {
    siteDescription: string;
    ogDescription: string;
    shotlistTitle: string;
  };
  /** Measurement units. Latin for en/pl/de, Cyrillic for by/uk. */
  units: {
    mm: string;
    g: string;
  };
  /** Messages the configurator shows when it changes the selection itself. */
  conflicts: {
    /** {to}, {from} */
    leatherChanged: string;
    /** {to}, {from}, {leather} */
    colorChanged: string;
    /** {max}, {size} */
    insertsReduced: string;
    /** {flap}, {size} */
    pocketsReduced: string;
    /** {leather} */
    colorNotInLeather: string;
    colorOutOfStock: string;
    leatherNotInSize: string;
  };
  /** Text drawn inside the technical drawings and read out by screen readers. */
  schematic: {
    note: string;
    /** {leather}, {color} */
    frontAria: string;
    backAria: string;
    openAria: string;
    /** {leather} */
    detailAria: string;
    elasticFront: string;
    buckleFront: string;
    spineHoles: string;
    blockBand: string;
    buckleBack: string;
    noClosure: string;
    /** {max} */
    penLoopSlim: string;
    /** {min}, {max} */
    penLoopWide: string;
    /** {flap}, {list} */
    pocketsOn: string;
    burnishedEdge: string;
    /** {mm} */
    threadDetail: string;
    /** {name}, {dimensions} */
    sizeDiagramSingle: string;
    sizeDiagramCompare: string;
    phone: string;
  };
  colors: Record<ColorCode, string>;
  threads: Record<ThreadCode, string>;
  insertTypes: Record<InsertType, string>;
  leatherNames: Record<LeatherCode, string>;
  angles: Record<Angle, string>;
}
