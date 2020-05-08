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
        <button
          class="btn btn-outline-danger ml-2"
          v-if="!snippets.length"
          @click="deleteCategory"
        >
          {{ __("Supprimer") }}
        </button>
      </div>
    </div>

    <draggable
      class="drop-category"
      v-model="snippets"
      v-bind="dragOptions"
    >
      <SnippetItem
        v-for="snippet in snippets"
        :snippet="snippet"
        :key="snippet.id"
      >
      </SnippetItem>
    </draggable>

    <button
      :disabled="editing"
      class="btn btn-link mt-2"
      @click="createSnippet"
    >
      {{ __("+ Ajouter une réponse") }}
    </button>

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
import "../crm_stuff";

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
      get() {
        console.log(this._uid);
        return this.$store.state.snippets
          .filter(snippet => {
            return snippet.category_id === this.category.id;
          })
          .sort((item1, item2) => item1.position - item2.position);
      },
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
            this.$store.dispatch('loading', { event: 'updateCategory', isLoading: true });
            this.$store.dispatch('updateCategory', {
              id: this.category.id,
              name: response
            })
            .then(() => {
              this.$store.dispatch('loading', { event: 'updateCategory', isLoading: false });
            });
          }
        });
    },
    deleteCategory() {
      window.app.ui.confirm(this.__('Voulez-vous vraiment supprimer ?')).then(() => {
        this.$store.dispatch('loading', { event: 'delCategory', isLoading: true });
        this.$store.dispatch('deleteCategory', this.category.id)
        .then(() => {
          this.$store.dispatch('loading', { event: 'delCategory', isLoading: false });
        });
      });
    },
    createSnippet() {
      this.$store.dispatch('loading', { event: 'createSnippet', isLoading: true });
      this.$store.dispatch('getEmptySnippet').then(response => { 
        let emptySnippet = response.message.snippet;

          emptySnippet.category_id = this.category.id;

          emptySnippet.position = this.snippets.length + 1;
          this.emptySnippet = emptySnippet;
          this.editing = true;
          
      })
      .then(() => {
        this.$store.dispatch('loading', { event: 'createSnippet', isLoading: false });
      });
    },
    closeEditor() {
      this.editing = !this.editing;
    }
  }
};
</script>

<style scoped>
.snippet-category .header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}

.snippet-category .drop-category {
  min-height: 40px;
}
</style>
