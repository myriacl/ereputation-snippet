<template>
<Loader :loading="loading">
  <div class="box-fieldset">
    <div class="form-group">
      <span>{{ __("Nom") }}</span><br />
      <input type="text" class="form-control" v-model="title" />
    </div>
    <div class="tab-body ">
      <div class="tab-heading">
        <nav>
          <div class="nav-tabs nav">
            <a
              @click="current_language_id = language.id"
              v-for="language in languages"
              :key="language.id"
              class="nav-item nav-link"
              :class="{ active: current_language_id === language.id }"
              @click.prevent
              href="#"
            >
              <span class="name">{{ language.name }}</span>
            </a>
          </div>
        </nav>
      </div>

      <div id="nav-tabContent" class="tab-content">
        <div
          class="tab-pane"
          v-for="language in languages"
          :key="language.id"
          v-show="current_language_id === language.id"
        >
          <div class="form-group">
            <textarea
              class="form-control"
              v-model="contents_hash[language.id]"
              style="width: 100%"
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

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
      <button class="btn btn-secondary ml-2" @click="saveSnippet">
        {{ __("Enregistrer") }}
      </button>
      <button class="btn btn-outline-secondary ml-2" @click="cancel">
        {{ __("Annuler") }}
      </button>
    </div>
  </div>
  </Loader>
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
    };
  },
  computed: {
    ...mapState(['languages']),
    loading() {
      console.log('snippet', this._uid);
      return this.$store.state.loading.saveSnippet
      /* Si l'on souhaite isoler le loading sur l'instance du 
      composant qui appelle le loading */
      // let loading = this.$store.state.loading.saveSnippet     
      // return loading.saveSnippet  && loading.el === this.uid
    } 
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
      this.$store.dispatch('loading', { event: 'saveSnippet', isLoading: true });
      /* Si l'on souhaite isoler le loading sur l'instance du composant
      qui appelle le loading */
      //this.$store.dispatch('loading', { event: 'saveSnippet', isLoading: true, el: this.uid });
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

      this.$store.dispatch('saveSnippet', {
        snippetToSave: snippet,
        create: this.create
      })
      .then(() => {
        this.$store.dispatch('loading', { event: 'saveSnippet', isLoading: false });
        this.$emit('close-editor');
      });
      
    },
    cancel() {
      this.$emit('close-editor');
    }
  }
};
</script>
