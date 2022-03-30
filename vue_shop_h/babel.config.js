module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],


    // 产品发布时候的插件
    'transform-remove-console',
    '@babel/plugin-syntax-dynamic-import'

  ],


}
