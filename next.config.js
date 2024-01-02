// noinspection JSUnusedGlobalSymbols
module.exports = {
    experiments: {
        topLevelAwait: true,
      },
    env: {
        basePath: process.env.BASE_PATH || '',
    },
    basePath: process.env.BASE_PATH || '',
    i18n: {
        locales: ['en', 'ru', 'ar'],
        defaultLocale: 'en',
    },
};
