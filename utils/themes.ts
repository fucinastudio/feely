export const PrimaryColorOptions = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
] as const;

export type PrimaryColorTypes = typeof PrimaryColorOptions;
export type PrimaryColorType = PrimaryColorTypes[number];

export const mapPrimary = (value: PrimaryColorType) => {
  switch (value) {
    case 'red':
      return 'bg-red-600';
    case 'orange':
      return 'bg-orange-600';
    case 'amber':
      return 'bg-amber-600';
    case 'yellow':
      return 'bg-yellow-600';
    case 'lime':
      return 'bg-lime-600';
    case 'green':
      return 'bg-green-600';
    case 'emerald':
      return 'bg-emerald-600';
    case 'teal':
      return 'bg-teal-600';
    case 'cyan':
      return 'bg-cyan-600';
    case 'sky':
      return 'bg-sky-600';
    case 'blue':
      return 'bg-blue-600';
    case 'indigo':
      return 'bg-indigo-600';
    case 'violet':
      return 'bg-violet-600';
    case 'fuchsia':
      return 'bg-fuchsia-600';
    case 'pink':
      return 'bg-pink-600';
    case 'purple':
      return 'bg-purple-600';
    case 'rose':
      return 'bg-rose-600';
  }
};

export const changePrimaryColor = (theme: PrimaryColorType) => {
  document.querySelector('html')?.setAttribute('data-primaryColor', theme);
};

export type NeutralColorOptions =
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone';

export const NeutralColorOptions = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
] as const;
export type NeutralColorTypes = typeof NeutralColorOptions;
export type NeutralColorType = NeutralColorTypes[number];

export const mapNeutral = (value: NeutralColorType) => {
  switch (value) {
    case 'gray':
      return 'bg-gray-600';
    case 'neutral':
      return 'bg-[#525252]';
    case 'slate':
      return 'bg-slate-600';
    case 'stone':
      return 'bg-stone-600';
    case 'zinc':
      return 'bg-zinc-600';
  }
};

export const changeNeutralColor = (theme: NeutralColorType) => {
  document.querySelector('html')?.setAttribute('data-neutralColor', theme);
};

export type fontFamilyOptions =
  | 'inter'
  | 'geist'
  | 'poppins'
  | 'roboto'
  | 'worksans'
  | 'raleway';

export const FontFamilyOptions = [
  'inter',
  'geist',
  'poppins',
  'roboto',
  'worksans',
  'raleway',
] as const;

export type FontFamilyTypes = typeof FontFamilyOptions;
export type FontFamilyType = FontFamilyTypes[number];

export function changeFontFamily(fontFamily: string = 'sans') {
  const body = document.body;
  body.classList.remove(
    'font-inter',
    'font-geist',
    'font-poppins',
    'font-roboto',
    'font-worksans',
    'font-raleway'
  );
  body.classList.add(`font-${fontFamily}`);
}
