export const APP_ROUTES = {
  home: '',
  contact: 'contact',
} as const;

export type RoutePath = typeof APP_ROUTES[keyof typeof APP_ROUTES];

export function toPath(route: RoutePath): string {
  return '/' + route;
}
