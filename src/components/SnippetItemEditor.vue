<template>
  <div>
    <div class="form-group pt-3">
      <input
        class="form-control"
        v-model="title"
        type="text"
        placeholder="Title goes here"
      />
    </div>

    <ul class="nav nav-tabs pb-2 border-bottom-0">
      <li
        class="nav-item"
        @click="current_language_id = language.id"
        v-for="language in languages"
        :key="language.id"
      >
        <a
          class="nav-link"
          :class="{ active: current_language_id === language.id }"
          @click.prevent
          href="#"
        >
          {{ language.name }}
        </a>
      </li>
    </ul>

    <div
      class="form-group"
      v-for="language in languages"
      :key="language.id"
      v-show="current_language_id === language.id"
    >
      <textarea
        class="form-control"
        v-model="contents_hash[language.id]"
        style="width: 100%"
        rows="4"
      ></textarea>
    </div>

    <div class="text-right">
      <button class="btn btn-primary ml-2" @click="saveSnippet">
        Enregistrer
      </button>
      <button class="btn btn-secondary  ml-2" @click="cancel">Annuler</button>
    </div>

    Snippet: {{ snippet }} <br />
    contents_hash: {{ contents_hash }}<br />
    {{ create }}
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SnippetItemEditor',
  props: ['snippet', 'create'],
  data() {
    return {
      contents_hash: this.freshContentsHash(this.snippet),
      current_language_id: 1,
      title: this.snippet.title
      // snippetModified: cloneDeep(this.snippet)
    };
  },
  computed: {
    ...mapState(['languages'])
  },
  methods: {
    freshContentsHash(snippet) {
      let contents_hash = {};
      snippet.contents.forEach(content => {
        contents_hash[content.language_id] = content.content;
      });
      this.$store.state.languages.forEach(language => {
        if (!(language.id in contents_hash)) {
          contents_hash[language.id] = '';
        }
      });
      return contents_hash;
    },
    saveSnippet() {
      //on peut construire ici le snippet qu'on souhaite renvoyer vers le store
      let contents = [];
      for (let language_id in this.contents_hash) {
        contents.push({
          language_id,
          content: this.contents_hash[language_id]
        });
      }
      let snippet = {
        id: this.snippet.id,
        title: this.title,
        contents
      };

      if (this.create) {
        snippet = {
          id: this.snippet.id,
          title: this.title,
          category_id: this.snippet.category_id,
          position: this.snippet.position,
          contents
        };
      }
      //this.$store.dispatch('non_existing_function', snippet);

      console.log('snippetToSave', snippet); ///////////////////////////////////////////////
      console.log('this.create', this.create); ///////////////////////////////////////////

      this.$store.dispatch('saveSnippet', {
        snippetToSave: snippet,
        create: this.create
      });
      //if(this.create) {this.$emit('snippetCreated')}
      this.$emit('snippet-save');
      if (this.create) {
        this.contents_hash = {};
        this.title = '';
      }
    },
    cancel() {
      this.contents_hash = this.freshContentsHash(this.snippet);
      this.title = this.snippet.title;
      this.$emit('close-editor');
    }
  }
};
</script>
