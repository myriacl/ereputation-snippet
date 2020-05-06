<template>
  <div class="snippet-item snippet-row mb-2 mt-2 pb-2">
    <div class="snippet-container">
      <div class="block-title">
        <button class="btn btn-link mr-1" data-drag-snippet>☰</button>
        <strong>{{ snippet.title }}</strong>
        <strong> / Position: {{ snippet.position }}</strong>
      </div>

      <div class="ml-auto btn-container">
        <div class="btn-group" v-show="!editing">
          <button class="btn btn-outline-danger" @click="deleteSnippet()">
            icoSuppr
          </button>
          <button class="btn btn-secondary" @click="editing = !editing">
            modifier
          </button>
        </div>
        <button
          class="btn btn-secondary"
          v-show="editing"
          @click="editing = !editing"
        >
          Fermer
        </button>
      </div>
    </div>

    <AccordeonTransition :editing="editing">
      <SnippetItemEditor
        :snippet="snippet"
        @close-editor="editing = !editing"
      ></SnippetItemEditor>
    </AccordeonTransition>
  </div>
</template>

<script>
import SnippetItemEditor from './SnippetItemEditor';
import AccordeonTransition from './AccordeonTransition';

export default {
  name: 'SnippetItem',
  props: ['snippet'],
  components: {
    SnippetItemEditor,
    AccordeonTransition
  },
  data() {
    return {
      editing: false
    };
  },
  methods: {
    deleteSnippet() {
      this.windowUtils.ui.confirm('Confirmation?').then(() => {
        console.log('il a dit oui!');
        this.$store.dispatch('deleteSnippet', this.snippet.id);
      });
    }
  }
};
</script>

<style>
.snippet-item {
  border-bottom: 1px solid #dee2e6;
}
.snippet-item .snippet-container {
  display: flex;
  align-items: center;
}

@media (max-width: 767px) {
  .snippet-item .snippet-container {
    display: initial;
  }
  .snippet-item .btn-container {
    text-align: right;
    padding-top: 0.5rem;
  }
  .snippet-item .block-title {
    display: flex;
    align-items: center;
  }
}
</style>
