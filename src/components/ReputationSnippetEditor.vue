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
    <!-- Le draggable est synchronisé avec le tableau des catégories
        via v-model. Si on bouge les composants SnippetCategory.
        Les modifications se répercuteront sur le tableau categories qui est
        une propriété computed -->
    <draggable v-model="categories" v-bind="dragOptions">
      <!-- On boucle sur le tableau d'objets de la propriété
            computed categories et on passe chaque objet category au composant
            SnippetCategory -->
      <SnippetCategory
        v-for="category in categories"
        :category="category"
        :key="category.id"
      >
      </SnippetCategory>
    </draggable>
      <!-- <pre>
        {{ categories }}
      </pre>
      <pre>
        {{ this.$store.state.snippets }}                               
      </pre> -->
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
        /* On récupère le tableau des categories du state depuis le store
                    pour en faire une propriété computed categories */
        return this.$store.state.categories;
      },
      /* Si l'ordre des catégories dans le tableau categories
                est modifié par le draggable, la propriété computed peut écouter
                ces changements via le setter set(value) où value est la nouvelle
                valeur de la propriété */
      set(value) {
        /* Si categories change on dispatch une action updateCategoryOrder
                    avec la nouvelle valeur pour mettre à jour le store */
        this.$store.dispatch('updateCategoryOrder', value);
      }
    },
    // Options de vue draggable
    dragOptions() {
      return {
        animation: 150,
        /* Le drag des catégories se fait à partir de lélément
                    qui porte l'attribut data-drag-category */
        handle: '[data-drag-category]',
        /* Permet de scroller la page quand l'élément draggé sort
                    du viewport */
        forceFallback: true // key to make autoScroll works
      };
    }
  },
  methods: {
    addCategory() {
      this.windowUtils.ui
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
