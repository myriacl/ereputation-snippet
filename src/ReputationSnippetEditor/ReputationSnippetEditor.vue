<template>
  <div class="container reputation-snippet-editor">
    <div class="header mb-1">
      <h4 class="box-title">
        {{ __("Catégorie") }}
      </h4>
      <button @click="addCategory" class="btn btn-link">
        {{ __("+ Ajouter une catégorie") }}
      </button>
    </div>
    <Loader :loading="loading">
      <draggable v-model="categories" v-bind="dragOptions">
        <SnippetCategory
          v-for="category in categories"
          :category="category"
          :key="category.id"
        >
        </SnippetCategory>
      </draggable>
    </Loader>
  </div>
</template>

<script>
import SnippetCategory from './SnippetCategory';

let draggable = require('vuedraggable');

export default {
  name: 'ReputationSnippetEditor',
  components: {
    SnippetCategory,
    draggable
  },
  computed: {
    categories: {
      get() {
        return this.$store.state.categories;
      },
      set(value) {
        this.$store.dispatch('updateCategoryOrder', value);
      }
    },
    loading() {
      let loading = this.$store.state.loading;
      return (
        loading.delSnippet ||
        loading.addCategory ||
        loading.delCategory ||
        loading.updateCategory ||
        loading.createSnippet
      );
    },
    dragOptions() {
      return {
        animation: 150,
        handle: '[data-drag-category]',
        forceFallback: true // Key to make autoScroll works
      };
    }
  },
  methods: {
    addCategory() {
      window.app.ui.prompt(this.__('Ajouter une nouvelle catégorie')).then(response => {
        this.$store.dispatch('loading', {
          event: 'addCategory',
          isLoading: true
        });
        if (response) {
          this.$store.dispatch('addCategory', response).then(() => {
            this.$store.dispatch('loading', {
              event: 'addCategory',
              isLoading: false
            });
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.reputation-snippet-editor {
  .header {
    display: flex;
  }
}
</style>
