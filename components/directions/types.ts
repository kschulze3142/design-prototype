export type DirectionId = 'd1' | 'd2' | 'd3' | 'd4';
export type ScreenId = 'home' | 'inbox' | 'dashboard';

export const DIRECTION_LABELS: Record<DirectionId, string> = {
  d1: 'Maze — bold editorial',
  d2: 'Mercury — quiet minimal',
  d3: 'Notion — workflow / surface-dense',
  d4: 'Airbnb — warm / human',
};

export const SCREEN_LABELS: Record<ScreenId, string> = {
  home: 'Home',
  inbox: 'Inbox',
  dashboard: 'Dashboard',
};
