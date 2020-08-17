<template>
  <div class="box-xxl-less shadow-lg mb-0 snippet-category">
    <div class="header pb-2">
      <button class="btn btn-link" data-drag-category>
        <i class="fas fa-arrows-alt-v"></i>
      </button>
      <h6 class="pl-2 mb-0">
        <strong>{{ __(category.name) }}</strong>
      </h6>
      <button class="btn btn-link p-2" @click="updateCategory">
        <i class="fas fa-pen"></i>
      </button>
      <div class=" ml-auto">
        <!-- On affiche le bouton de suppression de la catégorie si il n'y a plus de snippets associé
        à cette catégorie -->
        <button
          class="btn btn-outline-danger ml-2"
          v-if="!snippets.length"
          @click="deleteCategory"
        >
          {{ __('Supprimer') }}
        </button>
      </div>
    </div>
    <!-- Composant Drag n Drop sur la liste du tableau des snippets -->
    <draggable class="drop-category" v-model="snippets" v-bind="dragOptions">
      <!-- Comosant d'une ligne d'item de catégorie -->
      <SnippetItem
        v-for="snippet in snippets"
        :snippet="snippet"
        :key="snippet.id"
      >
      </SnippetItem>
    </draggable>

    <!-- On désactive le bouton quand on est en mode édition -->
    <button
      :disabled="editing"
      class="btn btn-link mt-2"
      @click="createSnippet"
    >
      {{ __('+ Ajouter une réponse') }}
    </button>

    <!-- On affiche le composant d'édition de snippet quand on ajoute un nouveau snippet -->
    <SnippetItemEditor
      v-if="emptySnippet && editing"
      :snippet="emptySnippet"
      @snippet-save="closeEditor"
      @close-editor="closeEditor"
      :create="true"
    ></SnippetItemEditor>
  </div>
</template>

<script>
import SnippetItem from './SnippetItem';
import SnippetItemEditor from './SnippetItemEditor';
import '../crm_stuff';

let draggable = require('vuedraggable');

export default {
  name: 'SnippetCategory',
  props: ['category'],
  data() {
    return {
      editing: false,
      emptySnippet: null,
      hasSnippets: false
    };
  },
  components: {
    SnippetItem,
    draggable,
    SnippetItemEditor
  },
  computed: {
    snippets: {
      // On récupère les snippets associés à la catégorie courante depuis les snippets du store
      // et on les classent selon leur propriété position pour les afficher dans le bon ordre
      get() {
        return this.$store.state.snippets
          .filter(snippet => {
            return snippet.category_id === this.category.id;
          })
          .sort((item1, item2) => item1.position - item2.position);
      },
      // Quand le tableau est modifié par le Drag n Drop on update la bdd et le store
      // avec un dispatch et on udpate la position de chaque snippet
      set(value) {
        let snippetsUdpated = value.map((snippet, index) => {
          snippet.category_id = this.category.id;
          snippet.position = index + 1;
          return snippet;
        });
        this.$store.dispatch('debounceUpdateSnippetsOrder', snippetsUdpated);
      }
    },
    dragOptions() {
      return {
        group: 'snippets',
        animation: 150,
        handle: '[data-drag-snippet]',
        forceFallback: true // Key to make autoScroll works
      };
    }
  },
  methods: {
    updateCategory() {
      window.app.ui
        .prompt('Modifier le nom de la catégorie', this.category.name)
        .then(response => {
          if (response) {
            this.$store.dispatch('loading', {
              event: 'updateCategory',
              isLoading: true
            });
            this.$store
              .dispatch('updateCategory', {
                id: this.category.id,
                name: response
              })
              .then(() => {
                this.$store.dispatch('loading', {
                  event: 'updateCategory',
                  isLoading: false
                });
              });
          }
        });
    },
    deleteCategory() {
      window.app.ui
        .confirm(this.__('Voulez-vous vraiment supprimer ?'))
        .then(() => {
          this.$store.dispatch('loading', {
            event: 'delCategory',
            isLoading: true
          });
          this.$store.dispatch('deleteCategory', this.category.id).then(() => {
            this.$store.dispatch('loading', {
              event: 'delCategory',
              isLoading: false
            });
          });
        });
    },
    createSnippet() {
      this.$store.dispatch('loading', {
        event: 'createSnippet',
        isLoading: true
      });
      // Quand on crée un snippet, on récupère un snippet vide de puis la bdd
      this.$store
        .dispatch('getEmptySnippet')
        .then(response => {
          let emptySnippet = response.message.snippet;

          // On associe la catégorie en cours avec le nouveau snippet
          emptySnippet.category_id = this.category.id;

          // On met à jour sa position
          emptySnippet.position = this.snippets.length + 1;
          this.emptySnippet = emptySnippet;

          // On affiche l'éditeur de snippet
          this.editing = true;
        })
        .then(() => {
          this.$store.dispatch('loading', {
            event: 'createSnippet',
            isLoading: false
          });
        });
    },
    closeEditor() {
      this.editing = !this.editing;
    }
  }
};
</script>

<style scoped lang="scss">
.snippet-category {
  .header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dee2e6;
  }
  .drop-category {
    min-height: 40px;
  }
}
</style>
