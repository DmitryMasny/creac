import { AxiosRequestConfig } from 'axios';

// export const toObject = <T extends { [k: string]: any }>(
//   arr: T[],
//   key: T[string]
// ) => arr.reduce((a, v) => ({ ...a, [v[key]]: v }), {});

// export const firstLetterUppercase = (string: string): string =>
//   string.charAt(0).toUpperCase() + string.slice(1);

// export const smartTitle = (
//   string?: string | number,
//   l = 16
// ): string | undefined =>
//   string && typeof string === 'string' && string.length > l
//     ? string
//     : undefined;

// export const removeBrackets = (string: string | undefined): string =>
//   string?.replace(/[(].*?[)] */g, '') || '';

// export const hasSameSign = (a: number, b: number) => a * b > 0;

// export const logarithmicScaling = (
//   value: number,
//   base: number = 0.1
// ): number => {
//   return Math.log(value + 1) / Math.abs(Math.log(base));
// };

// export const makeFiltersOptions = <T extends Record<string, any>>(
//   array: T[] | undefined,
//   dataMapping: (item: T) => FilterOption
// ): FilterOption[] => {
//   if (!array?.length) {
//     return [];
//   }

//   const uniqueOptions = array.reduce<FilterOption[]>((acc, item) => {
//     const itemData = dataMapping(item);
//     if (itemData && !acc.some(option => option.id === itemData.id)) {
//       acc.push(itemData);
//     }
//     return acc;
//   }, []);

//   return uniqueOptions;
// };

// export const mergeProps = <T,>(...objects: T[]): T => objects.reduce((acc, obj) => ({ ...acc, ...obj }), {} as T);

import Axios, { AxiosInstance } from 'axios';

export const axios: AxiosInstance = Axios.create({
  baseURL: 'http://localhost:5050',
});

// axios.interceptors.request.use(config => {
//   const token = import.meta.env.DEV && import.meta.env.VITE_AUTH_TOKEN;
//   if (token) {
//     config.headers['x-user-token'] = import.meta.env.VITE_AUTH_TOKEN;
//   }

//   return config;
// });

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 403) {
      return Promise.reject({ ...error, message: 'Нет доступа' });
    }
    if (error.response.status === 404) {
      return Promise.reject({
        ...error,
        message: 'Путь не найден. Проверьте VPN',
      });
    }
    if (error.response.status === 500) {
      return Promise.reject({
        ...error,
        message: 'Ошибка сервера или отсутствует подключение',
      });
    }
    if (error.response.status === 503) {
      return Promise.reject({ ...error, message: 'Сервер недоступен' });
    }

    return Promise.reject(error.response.data);
  }
);

// export const qs = {
//   stringify: (obj: Record<string, string> = {}) => {
//     if (isEmpty(obj)) return '';
//     return Object.keys(obj)
//       .sort()
//       .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
//       .join('&');
//   },

//   parse: (queryString: string) => {
//     if (!queryString) return {};
//     const queryParts = queryString
//       .split('&')
//       .map(pair => pair.split('=').map(el => decodeURIComponent(el)));

//     return queryParts.reduce(
//       (acc, queryPart) => ({ ...acc, [queryPart[0]]: queryPart[1] }),
//       {}
//     );
//   },
// };

// const baseApiUrl = '/';
// for api requests => axios.get(getApiUrl('/api/users'))
// export const getApiUrl: IGetApiUrl = (routePath, routeOpts) => {
//   const { query, params } = (routeOpts || {}) as any;

//   const newQuery = isEmpty(query) ? '' : `?${qs.stringify(query)}`;
//   let newRoutePath: any = routePath;

//   if (!isEmpty(params)) {
//     const tmpRoutePath = routePath.replaceAll('{', ':').replaceAll('}', '');
//     newRoutePath = compile(tmpRoutePath)(params);
//   }

//   return `${baseApiUrl}${newRoutePath}${newQuery}`;
// };

// export const isUserHasRole = (user: User, role: IUserRole) => user.roles?.includes(role);

export const fetcher = async (url: string, config?: AxiosRequestConfig) => {
  const response = await axios.get(url, config);
  return response;
};
