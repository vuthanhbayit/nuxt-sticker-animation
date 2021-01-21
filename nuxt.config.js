import path from 'path'
import SpritesmithPlugin from 'webpack-spritesmith'
export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~assets/css/sprites.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        const templateFunction = function(data) {
          console.log(data)
          const shared = '.sticker { display:inline-block; background-image: url(I); background-size:WSMpx HSMpx; background-position: 0px 0px; width: Wpx; height: Hpx; animation-name: sticker;animation-duration: 0.8s;animation-iteration-count: infinite;animation-fill-mode: both;animation-timing-function: step-start;}'
            .replace('I', data.sprites[0].image)
            .replace('WSM', data.spritesheet.width / 2)
            .replace('HSM', data.spritesheet.height / 2)
            .replace('W', data.items[0].width / 2)
            .replace('H', data.items[0].height / 2)
          const animations = data.sprites.map((sprite, index) => {
            const ratio = 100 / (data.sprites.length - 1)
            let position
            if (index === 0) {
              position = '0% { background-position: Xpx Ypx; }'
            }
            else if (index === sprite.length - 1) {
              position = ' 100% { background-position: Xpx Ypx; }'
            }
            else {
              position = ` ${ratio*index}% { background-position: Xpx Ypx; }`
            }
            return position
              .replace('X', sprite.offset_x / 2)
              .replace('Y', sprite.offset_y / 2)
          }).join('\n')
          const sticker = `@keyframes sticker {\n ${animations} \n}`

          return shared + '\n' + sticker
        }
        config.resolve.modules.push('./assets/sprites/')
        config.plugins.push(
          new SpritesmithPlugin({
            src: {
              cwd: path.resolve(__dirname, './assets/sprites/'),
              glob: '**/*.png'
            },
            target: {
              image: path.resolve(__dirname, './assets/sprites.png'),
              css: [
                [
                  path.resolve(__dirname, './assets/css/sprites.css'),
                  {
                    format: 'function_based_template'
                  }
                ]
              ]
            },
            customTemplates: {
              function_based_template: templateFunction
            },
            apiOptions: {
              cssImageRef: "'~assets/sprites.png'"
            },
            spritesmithOptions: {
              padding: 10
            }
          })
        )
      }
    }
  }
}
