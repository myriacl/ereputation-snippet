<template>
  <Loader :loading="loading">
    <div class="box-fieldset">
      <div class="form-group">
        <span>{{ __('Nom') }}</span
        ><br />
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
          <div class="tab-pane"></div>
        </div>
      </div>

      <!-- On associe en v-model la textarea et le contenu du langage en cours de la hashmap -->
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
          {{ __('Enregistrer') }}
        </button>
        <button class="btn btn-outline-secondary ml-2" @click="cancel">
          {{ __('Annuler') }}
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
      // Onglet du language actif à l'ouverture
      current_language_id: 1,
      title: this.snippet.title
    };
  },
  computed: {
    // On récupère les languages depuis le store
    ...mapState(['languages']),
    loading() {
      return this.$store.state.loading.saveSnippet;
      /* Si l'on souhaite isoler le loading sur l'instance du 
      composant qui appelle le loading */
      // let loading = this.$store.state.loading.saveSnippet
      // return loading.saveSnippet  && loading.el === this.uid
    }
  },
  methods: {
    freshContentsHash(snippet) {
      // On crée une hashmap avec l'id du language pour clé et le content pour valeur
      let contents_hash = {};
      snippet.contents.forEach(content => {
        contents_hash[content.language_id] = content.content;
      });
      this.$store.state.languages.forEach(language => {
        if (!(language.id in contents_hash)) {
          // Si il y a des languages sans contenu on leur met une chaine vide
          contents_hash[language.id] = '';
        }
      });
      return contents_hash;
    },
    saveSnippet() {
      this.$store.dispatch('loading', {
        event: 'saveSnippet',
        isLoading: true
      });
      /* Si l'on souhaite isoler le loading sur l'instance du composant
      qui appelle le loading */
      //this.$store.dispatch('loading', { event: 'saveSnippet', isLoading: true, el: this.uid });
      let contents = [];
      // On reconstitue le content du snippet ouis le snippet avant de l'update dans la bdd et le store
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

      // Si c'est un nouveau snippet on ajoute quelques informations au payload
      if (this.create) {
        snippet = {
          id: this.snippet.id,
          title: this.title,
          category_id: this.snippet.category_id,
          position: this.snippet.position,
          contents
        };
      }

      this.$store
        .dispatch('saveSnippet', {
          snippetToSave: snippet,
          create: this.create
        })
        .then(() => {
          this.$store.dispatch('loading', {
            event: 'saveSnippet',
            isLoading: false
          });
          this.$emit('close-editor');
        });
    },
    // On ferme l'editeur avec un emit qui sera gérer dans le parent
    cancel() {
      this.$emit('close-editor');
    }
  }
};
</script>
