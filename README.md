# VDocViewer

> Vue.js component


[![NPMVERSION](https://img.shields.io/npm/v/v-doc-viewer.svg)](http://npmjs.com/package/v-doc-viewer) [![GITHUBSTARS](https://img.shields.io/github/stars/IvanSotelo/VDocViewer.svg)](https://github.com/IvanSotelo/VDocViewer/stargazers) [![BUILD](https://travis-ci.org/IvanSotelo/VDocViewer.svg?branch=master)](https://travis-ci.org/IvanSotelo/VDocViewer) [![DOWNLOADS](https://img.shields.io/npm/dt/v-doc-viewer.svg)](https://npmjs.com/package/v-doc-viewer)

## Installation

``` bash
# Install with npm
$ npm i -S v-doc-viewer

# or yarn
$ yarn add v-doc-viewer
```


## Usage

``` js
import VDocViewer from 'v-doc-viewer'
Vue.use(VDocViewer)
```

``` vue
<template>
  <div class="app">
    <vm-button @click="openViewer()" color="primary" type="flat"> Open Viewer </vm-button>
  </div>
</template>

<script>
  export default {
    name: 'demo',
    methods: {
      openViewer () {
        this.$viewer.show({
          urlFile: 'https://si.ua.es/es/documentos/documentacion/pdf-s/mozilla12-pdf.pdf'
        })
      }
    }
  };
</script>
```

## Properties

* `urlFile` **[String]**

  Requiered; Url from the media.


## License

```
The MIT License (MIT)

Copyright (c) 2019 Ivan Sotelo Vargas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
