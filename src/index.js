import { emptyObject, convertProvide, covertInject } from "./utils";

export default Vue => {
  Vue.mixin({
    beforeCreate() {
      const $inject = covertInject(this.$options.$inject);

      if (emptyObject($inject) === false) {
        this._injects = {};
        const { $root } = this;

        for (const key in $inject) {
          // @get component parent exists inject property
          const inject = $inject[key];

          let { $parent } = this;
          let exists = false;

          while ($parent !== undefined && $parent !== $root) {
            const provide = convertProvide(
              $parent.$options.$provide,
              {
                allowSet: $parent.$options.provideSet === true
              },
              inject.key
            );

            if (provide) {
              exists = true;
              Vue.util.defineReactive(
                this._injects,
                inject.key,
                $parent[provide.key]
              ); // Vue reactive $parent[inject]
              /*
               * Considering component children need data updates via Provide
               * if yes will emit event provide: <property name> on component
               * else call console.error()
               */
              let allowEmitEventUpdateValue = inject.allowEmit;
              /*
               * Consided done in component children
               */
              if (provide.allowSet === true) {
                allowEmitEventUpdateValue = true;
                /// inject.key === provide.as
                /// provide.key is property name on parent
                /// inject.as is property name on children
                this.$on(`provide:${provide.as}`, value => {
                  $parent[provide.key] = value;
                });
              }
              /*
               * Consider component Father that allow updating data via Provide
               *
               */
              Object.defineProperty(this, inject.as, {
                get() {
                  return this._injects[inject.key];
                },
                set: allowEmitEventUpdateValue
                  ? value => {
                      this.$emit(`provide:${provide.as}`, value, $parent);
                    }
                  : () => {
                      console.error(
                        `vue-provide-inject: Can't set value to "${inject.as}" because this registered provide-inject.`
                      );
                    }
              }); // Get value on this.<property name> in vue component
              $parent.$watch(provide.key, newValue => {
                this._injects[inject.key] = newValue;
              }); // handle change value
              break;
            }

            $parent = $parent.$parent;
          }
          if (!exists) {
            console.error(
              `vue-provide-inject: Can't find parent provide "${inject.as}".`
            );
          }
        }
      }
    }
  });
};
