<template>
  <div class="snippet-item snippet-row mb-2 mt-2 pb-2">
    <div class="snippet-container">
      <div class="block-title">
        <button class="btn btn-link mr-1" data-drag-snippet>
          <i class="fas fa-bars"></i>
        </button>
        <strong>{{ snippet.title }}</strong>
      </div>

      <div class="ml-auto btn-container">
        <!-- On affiche les boutons seulement quand on est pas en mode édition -->
        <div class="btn-group" v-show="!editing">
          <button class="btn btn-outline-danger" @click="deleteSnippet()">
            <i class="fas fa-trash"></i>
          </button>
          <button class="btn btn-secondary" @click="editing = !editing">
            {{ __('modifier') }}
          </button>
        </div>
      </div>
    </div>
    <!-- On passe le snippet courant à l'éditeur pour le pré-remplir -->
    <SnippetItemEditor
      v-if="editing"
      :snippet="snippet"
      @close-editor="editing = !editing"
    ></SnippetItemEditor>
  </div>
</template>

<script>
import SnippetItemEditor from './SnippetItemEditor';

export default {
  name: 'SnippetItem',
  props: ['snippet'],
  components: {
    SnippetItemEditor
  },
  data() {
    return {
      editing: false
    };
  },
  methods: {
    deleteSnippet() {
      window.app.ui
        .confirm(this.__('Voulez-vous vraiment supprimer ?'))
        .then(() => {
          this.$store.dispatch('loading', {
            event: 'delSnippet',
            isLoading: true
          });
          this.$store.dispatch('deleteSnippet', this.snippet.id).then(() => {
            this.$store.dispatch('loading', {
              event: 'delSnippet',
              isLoading: false
            });
          });
        });
    }
  }
};
</script>

<style scoped lang="scss">
.snippet-item {
  border-bottom: 1px solid #dee2e6;

  .snippet-container {
    display: flex;
    align-items: center;

    @media (max-width: 767px) {
      display: initial;
    }
  }
  .block-title {
    @media (max-width: 767px) {
      display: flex;
      align-items: center;
    }
  }
  .btn-container {
    @media (max-width: 767px) {
      text-align: right;
      padding-top: 0.5rem;
    }
  }
}
</style>
