<template>
  <div class="box-fieldset">
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
      title: this.snippet.title
    };
  },
  computed: {
    ...mapState(['languages'])
  },
  methods: {
    /* Permet de générer un state local pour les objets contents
    à partir du snippet passé en props pour éviter de cloner
    l'objet entier */
    freshContentsHash(snippet) {
      let contents_hash = {};
      /* On créer un objet des contents_hash qui va contenir
      les contenus pour chaque langue */
      snippet.contents.forEach(content => {
        contents_hash[content.language_id] = content.content;
      });
      this.$store.state.languages.forEach(language => {
        /* Si un language existe dans le store (si on le rajoute
        a posteriori par exemple dans la bdd) mais qu'il n'est pas
        dans les contents du snippet alors on l'ajoute comme même
        aux contents avec un contenu vide */
        if (!(language.id in contents_hash)) {
          contents_hash[language.id] = '';
        }
      });
      return contents_hash;
    },
    saveSnippet() {
      /* On peut construit ici le snippet que l'on souhaite renvoyer
      vers le store */
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

      /* Si on crée un nouveau snippet on construit un objet avec
      toutes ses valeurs */
      if (this.create) {
        snippet = {
          id: this.snippet.id,
          title: this.title,
          category_id: this.snippet.category_id,
          position: this.snippet.position,
          contents
        };
      }

      /* On dispatch l'action saveSnippet avec les données du
      snippet à mettre à jour ou le snippet entier à ajouter
      au store et un argument create qui indiquera si c'est
      une creation ou un update */
      this.$store.dispatch('saveSnippet', {
        snippetToSave: snippet,
        create: this.create
      });

      /* On émet un événement qui indique que l'on a sauver
      le snippet */
      this.$emit('snippet-save');

      /* Si on est en mode creation on efface le contenu des champs
      en attente de la création d'un nouveau snippet */
      if (this.create) {
        this.contents_hash = {};
        this.title = '';
      }
    },
    cancel() {
      /* Quand on annule on regénère le state local avec les
      valeurs du snippet d'origine */
      this.contents_hash = this.freshContentsHash(this.snippet);
      this.title = this.snippet.title;

      /* On émet un événement pour fermer l'éditeur */
      this.$emit('close-editor');
    }
  }
};
</script>
