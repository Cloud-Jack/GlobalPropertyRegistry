import { Swagger } from 'libs/utils/documentation/swagger';

export const SwagggerResponse = {
  getLoginPhrase: {
    200: Swagger.defaultResponseText({ status: 200, text: 'PHRASE' }),
    412: Swagger.defaultResponseError({
      status: 412,
      route: '/login-phrase',
    }),
  },
};

export const SwagggerRequest = {
  /** If requesters has a body.  */
};
