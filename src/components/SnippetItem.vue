<template>
  <div class="snippet-row mb-3 mt-3 pb-3 border-bottom">
    <div class="d-flex align-items-center">
      <button class="btn btn-secondary" data-drag-snippet>☰</button>

      <div class="d-inline-block pl-2">
        {{ snippet.title }} <strong>Position: {{ snippet.position }}</strong>
      </div>

      <div class="ml-auto">
        <div v-show="!editing">
          <button class="btn btn-primary ml-2" @click="editing = !editing">
            modifier
          </button>
          <button class="btn btn-primary ml-2" @click="deleteSnippet()">
            supprimer
          </button>
        </div>
        <button class="btn btn-primary" v-show="editing" @click="editing = !editing">
            ⋀
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
.snippet-row:last-child {
  border-bottom: none !important;
  margin-bottom: 0 !important;
}
</style>
