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
        <div class="btn-group" v-show="!editing">
          <button class="btn btn-outline-danger" @click="deleteSnippet()">
            <i class="fas fa-trash"></i>
          </button>
          <button class="btn btn-secondary" @click="editing = !editing">
            modifier
          </button>
        </div>
      </div>
    </div>

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
      editing: false,
      isLoading: false
    };
  },
  methods: {
    deleteSnippet() {
      this.$store.commit('loading', true);
      window.app.ui.confirm('Confirmation?').then(() => {
        this.$store.dispatch('deleteSnippet', this.snippet.id)
        .then(() => {
          this.$store.commit('loading', false);  
        });
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
