# vue-provide-inject
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nguyenthanh1995/vue-provide-inject/blob/master/LICENSE)  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

**Allows you to use provide / inject but have reactive and update value parent on children.**
**Use options $provide and $inject**

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

``` bash
npm install vue-provide-inject
```

``` bash
yarn add vue-provide-inject
```

## Usage

``` JavaScript
import Vue from "vue"
import Inject from "vue-provide-inject"

Vue.use(Inject)

```

App.vue
``` vue.js
<template>
   <div>
      <input v-model="value" />
      <app-action />
   </div>
</template>

<script>
import AppAction from "@/components/AppAction"

export default {
   components: { AppAction },
   $provide: ["value"],
   provideSet: true,
   data: () => ({
      value: ""
   })
}
</script>
```

components/AppAction.vue
``` vue.js
<template>
   <div>
      Value input: {{ value }}
      <br>
      <button @click="value = ''"> Reset if provideSet = true </button>
   </div>
</template>

<script>
export default {
   $inject: ["value"]
}
</script>
```
### setting the inject values ​​in children is off by default if you want to do so set provideSet: true as the provider.
### At \$provide and $inject you can also set the object and specify its own properties

component provide
``` vue.js
export default {
   $provide: {
      value: {
         as: "email", // alternate name. it will be replaced with the original specified name
         allowSet: false // Whether the children allow the data to update. It will override the provideSet value
      }
      /*
         If you just want to provide a name to provide you can write off
         $provide: {
            value: "email"
         }
      */
   },
   data: () => ({
      value: ""
   })
}
```

component inject
``` vue.js
export default {
   $inject: {
      email: {
         as: "value", // alternate name. it will be replaced with the original specified name get value by this.<alias name>
         allowEmit: false // Whether to enable event triggering when you update data. Note if the provide component set allowSet: true this option will always be on
      }
      /*
         If you just want to provide a name to provide you can write off
         $inject: {
            email: "value"
         }
      */
   },
   data: () => ({
      value: ""
   })
}
```



This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.