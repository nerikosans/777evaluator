/* nuxt.config.js */
// `DEPLOY_ENV` が `GH_PAGES` の場合のみ `router.base = '/<repository-name>/'` を追加する
const routerBase =
  process.env.DEPLOY_ENV === 'GH_PAGES'
    ? {
        router: {
          base: '/777evaluator/',
        },
      }
    : {};

export default {
  ssr: false,
  target: 'static',
  head: {
    title: '胡算器',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      { hid: 'og:site_name', property: 'og:site_name', content: '胡算器' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://catupper.github.io/777evaluator/',
      },
      { hid: 'og:title', property: 'og:title', content: '胡算器' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'b n ワ。',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://catupper.github.io/777evaluator/img/seven.jpg',
      },
      { hid: 'twitter:card', content: 'summary' },
    ],
  },
  buildModules: ['@nuxt/typescript-build'],
  modules: ['nuxt-webfontloader'],
  webfontloader: {
    google: {
      families: ['Noto+Sans+JP', 'M+PLUS+Rounded+1c:300,400'],
    },
  },
  ...routerBase,
};
