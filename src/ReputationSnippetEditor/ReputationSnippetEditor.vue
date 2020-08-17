<template>
  <div class="container reputation-snippet-editor">
    <div class="header mb-1">
      <h4 class="box-title">
        {{ __('Catégorie') }}
      </h4>
      <button @click="addCategory" class="btn btn-link">
        {{ __('+ Ajouter une catégorie') }}
      </button>
    </div>
    <!-- Composant permettant d'ajouter un overlay de loading sur les éléments qu'il contient
    avec une variable loading true ou false en prop
     -->
    <Loader :loading="loading">
      <!-- Composant Drag n Drop sur la liste du tableau des categories -->
      <draggable v-model="categories" v-bind="dragOptions">
        <!-- Composant qui décrit un item de category -->
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
    // On récupère le tableau des catégories depuis le store
    categories: {
      get() {
        return this.$store.state.categories;
      },
      // Quand le tableau est modifié par le Drag n Drop on update la bdd et le store
      // avec un dispatch
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
        // Spécifie l'attribut de l'élément sur lequel se fait le Drag n Drop
        handle: '[data-drag-category]',
        forceFallback: true // Key to make autoScroll works
      };
    }
  },
  methods: {
    addCategory() {
      window.app.ui
        .prompt(this.__('Ajouter une nouvelle catégorie'))
        .then(response => {
          // Quand on ajoute une catégorie on démarre le loading
          this.$store.dispatch('loading', {
            event: 'addCategory',
            isLoading: true
          });
          if (response) {
            // Un fois qu'on a la réponse on l'ajoute à la bdd puis au store
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
