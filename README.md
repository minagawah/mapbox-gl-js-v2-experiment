# mapbox-gl-js-v2-experiment

Mapbox GL JS v2 experiment.

[1. About](#1-about)  
[2. What I Did](#3-what-i-did)  
&nbsp; &nbsp; [2-1. Installed NPM Packages All](#2-1-installed-npm-packages-all)  
&nbsp; &nbsp; [2-2. Babel](#2-2-babal)  
&nbsp; &nbsp; [2-3. Webpack](#2-3-webpack)  
&nbsp; &nbsp; [2-4. Other Build Tools](#2-4-other-build-tools)  
&nbsp; &nbsp; [2-5. Other Dependencies](#2-5-other-dependencies)  
[3. Dev & Build](#3-dev--build)  
[4. LICENSE](#4-license)  

![screenshot](screenshot.png)

[View Demo](http://tokyo800.jp/mina/mapbox-gl-js-v2-experiment/)  


<a id="about"></a>
## 1. About

Playing with Mapbox GL JS v2.  

Some fancy features:
- No React
- Tailwind
- A bit of Functional Programming

&nbsp;


## 2. What I Did

### 2-1. Installed NPM Packages All


```
yarn add ramda mapbox-gl

yarn add --dev @babel/core @babel/cli @babel/preset-env core-js@3 @babel/runtime-corejs3 webpack webpack-cli webpack-dev-server babel-loader file-loader style-loader css-loader postcss-loader webpack-merge clean-webpack-plugin html-webpack-plugin copy-webpack-plugin mini-css-extract-plugin license-webpack-plugin postcss autoprefixer tailwindcss prettier http-server
```

### 2-2. Babel

For `@babel/polyfill` has been deprecated, we use `core-js`.

- @babel/core
- @babel/cli
- @babel/preset-env
- core-js@3
- @babel/runtime-corejs3
- babel-loader

```
yarn add --dev @babel/core @babel/preset-env @babel/cli core-js@3 @babel/runtime-corejs3 babel-loader
```


### 2-3. Webpack

- webpack
- webpack-cli
- webpack-dev-server

```
yarn add --dev webpack webpack-cli webpack-dev-server file-loader style-loader css-loader postcss-loader
```

### 2-4. Other Build Tools

- dotenv
- webpack-merge
- clean-webpack-plugin
- html-webpack-plugin
- copy-webpack-plugin
- mini-css-extract-plugin
- license-webpack-plugin
- postcss
- autoprefixer
- prettier

```
yarn add --dev webpack-merge clean-webpack-plugin html-webpack-plugin license-webpack-plugin postcss autoprefixer prettier
```

### 2-5. Other Dependencies

- ramda
- tailwindcss
- mapbox-gl
- http-server

```
yarn add ramda mapbox-gl

yarn add --dev tailwindcss http-server
```

&nbsp;



## 3. Dev & Build

### Build for DEV

```
yarn start
```

### Build for PROD

```
yarn build
```

&nbsp;


## 4. License

Dual-licensed under either of the followings.  
Choose at your option.

- The UNLICENSE ([LICENSE.UNLICENSE](LICENSE.UNLICENSE))
- MIT license ([LICENSE.MIT](LICENSE.MIT))


