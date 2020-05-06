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
      <div class=" ml-auto">
        <button class="btn btn-primary ml-2" @click="editName">
          modifier
        </button>
        <!-- Si le tableau des snippets est vide on affiche
        le bouton pour supprimer une catégorie -->
        <button
          class="btn btn-primary ml-2"
          v-if="!snippets.length"
          @click="deleteCategory"
        >
          Supprimer
        </button>
      </div>
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

    <button :disabled="editing" class="btn btn-primary mt-2" @click="createSnippet">
      Ajouter un snippet
    </button>
    
    <!-- On injecte le composant SnippetItemEditor seulement
    quand on a récupéré le snippet vide depuis la bdd serveur -->
    <div v-if="emptySnippet">
      <!-- On passe le snippet initialisé sans contenu
      au SnippetItemEditor et une props create pour lui indiquer
      que l'on est en mode creation ce qui n'appellera pas 
      la même mutation -->
      <SnippetItemEditor
        v-show="editing"
        :snippet="emptySnippet"
        @snippet-save="handleSaveNewSnippet"
        @close-editor="handleClose"
        :create="true"
      ></SnippetItemEditor>
    </div>

    <!-- <div class="mt-3">
      {{ snippets }}
    </div> -->
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
        // if(value) {
        //   this.hasSnippets = true
        // } else {
        //   this.hasSnippets = false
        // }
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
            this.$store.dispatch('updateCategory', {
              id: this.category.id,
              name: response
            });
          }
        });
    },
    deleteCategory() {
      this.windowUtils.ui.confirm('Confirmation?').then(() => {
        this.$store.dispatch('deleteCategory', this.category.id);
      });
    },
    createSnippet() {
      Backend.getEmptySnippet().then(response => {
        if (response.success) {
          /* On récupère un snippet vide avec un id depuis la
          bdd serveur */
          let emptySnippet = response.message.snippet;

          /* On initialise le snippet avec sa catégorie
          et sa position */
          emptySnippet.category_id = this.category.id;
          emptySnippet.position = this.snippets.length + 1;

          // window.app.ui.success();

          /* On prépare la data emptySnippet que l'on va passé en props
          au SnippetItemEditor */
          this.emptySnippet = emptySnippet;

          console.log('this.emptySnippet', this.emptySnippet);

          /* On ouvre le SnippetItemEditor */
          this.editing = true;
        } else {
          window.app.ui.error(response.message);
        }
      });
    },
    handleSaveNewSnippet() {
      /* On vide emptySnippet en attente d'un nouvel objet */
      this.emptySnippet = {};
      /* On ferme le SnippetItemEditor */
      this.editing = !this.editing;
    },
    handleClose() {
      /* On ferme le SnippetItemEditor */
      this.editing = !this.editing;
    }
  }
};
</script>
