export const LAYERS = ['cctv', 'access', 'fire', 'intercom', 'smart', 'doors', 'integrated'] as const
export type Layer = (typeof LAYERS)[number]
