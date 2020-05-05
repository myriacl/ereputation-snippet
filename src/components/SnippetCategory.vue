<template>
  <div
    style="padding:15px;border:3px solid black;margin:15px; background:white"
  >
    <div class="d-flex align-items-center">
      <button class="btn btn-secondary btn-sm mr-2" data-drag-category>
        ↕
      </button>
      <h3 class="p-2">
        {{ category.name }}
      </h3>
      <button class="btn btn-primary ml-auto" @click="editName">
        modifier
      </button>
    </div>

    <draggable
      v-model="snippets"
      v-bind="dragOptions"
      :class="'zone' + category.id"
      style="min-height: 40px;"
    >
      <SnippetItem
        v-for="snippet in snippets"
        :snippet="snippet"
        :key="snippet.id"
      >
      </SnippetItem>
    </draggable>

    <button class="btn btn-primary mt-2" @click="createSnippet">
      Ajouter un snippet
    </button>
    <div v-if="emptySnippet">
      <SnippetItemEditor
        v-show="editing"
        :snippet="emptySnippet"
        @snippet-save="handleSaveEvent"
        :create="true"
      ></SnippetItemEditor>
    </div>
  </div>
</template>

<script>
import SnippetItem from './SnippetItem';
import SnippetItemEditor from './SnippetItemEditor';
import Backend from '../Backend';

let draggable = require('vuedraggable');

export default {
  name: 'SnippetCategory',
  props: ['category'],
  data() {
    return {
      editing: false,
      emptySnippet: null
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
        /* On recupère les snippets qui ont un category.id correspondant
        à la catégorie courante puis on trie le tableau des snippets
        selon leur propriété position */
        return this.$store.state.snippets
          .filter(snippet => {
            return snippet.category_id === this.category.id;
          })
          .sort((item1, item2) => item1.position - item2.position);
      },
      set(value) {
        /* On récupère le tableau value des snippets de la catégorie
        réordonné par draggable, on met à jour la propriété position
        des snippets en fonction de leur index dans le tableau et on leur
        attribut leur nouveau category_id si ils proviennent d'un autre
        block de catégorie */
        let snippetsUdpated = value.map((snippet, index) => {
          snippet.category_id = this.category.id;
          snippet.position = index + 1;
          return snippet;
        });
        /* On dispatch une action debounceUpdateSnippetsOrder avec les snippets à
        mettre à jour dans le store */
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
    editName() {
      this.windowUtils.ui
        .prompt('Modifier le nom de la catégorie', this.category.name)
        .then(response => {
          if (response) {
            console.log(response);
            this.$store.dispatch('updateCategory', {
              id: this.category.id,
              name: response
            });
          }
        });
    },
    createSnippet() {
      //this.$store.dispatch('getEmptySnippet')
      Backend.getEmptySnippet().then(response => {
        /* Si la réponse est un succès  */
        if (response.success) {
          // On affiche une notification de succès
          window.app.ui.success();
          console.log('response.message.snippet', response.message.snippet); ////////////////////////////////////////////
          let emptySnippet = response.message.snippet;

          emptySnippet.category_id = this.category.id;
          emptySnippet.position = this.snippets.length + 1;

          this.emptySnippet = emptySnippet;
          console.log('this.emptySnippet', this.emptySnippet); //////////////////////////////////////////////////
          this.editing = !this.editing;
        } else {
          // Sinon on affiche l'erreur
          window.app.ui.error(response.message);
        }
      });
    },
    handleSaveEvent() {
      this.emptySnippet={}
      //this.createSnippet()
      this.editing = !this.editing
    }
  }
};
</script>
