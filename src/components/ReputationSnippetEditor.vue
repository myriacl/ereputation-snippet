<template>
  <div class="container rse">
    <div class="header mb-1">
      <h4 class="box-title">
        Catégorie
      </h4>
      <button @click="addCategory" class="btn btn-link">
        + Ajouter une catégorie
      </button>
    </div>
    <div :class="{'frame-loading': isLoading }">
      <draggable v-model="categories" v-bind="dragOptions">
        <SnippetCategory
          v-for="category in categories"
          :category="category"
          :key="category.id"
        >
        </SnippetCategory>
      </draggable>
    </div>
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
    isLoading: {
      get() {
        return this.$store.state.isLoading;
      }
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
      window.app.ui
        .prompt('Ajouter une nouvelle catégorie')
        .then(response => {
          if (response) {
            this.$store.dispatch('addCategory', response);
          }
        });
    }
  }
};
</script>

<style scoped lang="scss">
.rse {
  .header {
    display: flex;
  }
}
</style>
