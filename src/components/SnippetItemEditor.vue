<template>
  <div class="box-fieldset" :class="{'frame-loading': isLoading }">
    <div class="form-group">
      <span>Nom</span><br />
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
        Enregistrer
      </button>
      <button class="btn btn-outline-secondary ml-2" @click="cancel">
        Annuler
      </button>
    </div>

    <!-- <strong>Snippet:</strong> {{ snippet }} <br />
    <strong>contents_hash:</strong> {{ contents_hash }}<br />
    {{ create }} -->
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
      title: this.snippet.title,
      isLoading: false
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
      this.isLoading = true;
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
        this.isLoading = false;
        this.$emit('close-editor');
      });
      
    },
    cancel() {
      this.$emit('close-editor');
    }
  }
};
</script>
