import Vue from 'vue'
import Vuex from 'vuex'

import Backend from "./Backend";
import ReputationSnippetEditor from "./components/ReputationSnippetEditor";

import { debounce } from 'lodash';

import $ from 'jquery'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.use(Vuex)

Vue.config.productionTip = false

let store = getStore()

window.app = {
  ui: {
    confirm(msg) {
      return new Promise(resolve => {
        let response = window.confirm(msg);
        if (response) {
          resolve();
        }
      });
    },
    error(msg) {
      alert('Error !' + String(msg))
    },
    success() {
      //alert('Success')
      let str = `<div class="toaster alert alert-success" role="alert" style="position: fixed; top: 0; left: 50%; margin-left: -50px;">
          Success
          </div>`
      var z = document.createElement('div'); // is a node
      z.innerHTML = str;
      document.body.appendChild(z);
      window.setTimeout(function () {
        $(".toaster.alert").fadeTo(200, 0).slideUp(200, function () {
          $(this).remove();
        });
      }, 500);
    },
    prompt(title, value) {
      return new Promise(resolve => {
        let rep = window.prompt(title, value);
        if (rep) {
          resolve(rep);
        }
      })
    }
  }
}

// Permet d'accéder à window dans les methods des components
Vue.prototype.windowUtils = window.app


/* INSTANCE DE VUE */

// On instancie la vue racine
new Vue({
  store,
  // On appelle le composant principal ReputationSnippetEditor
  render: h => h(ReputationSnippetEditor),
  // On le monte dan la div avec l'id css app qui se trouve dans index.html
}).$mount('#app')

/* On dispatch l'action load qui va se charger d'initialiser le store
avec les données */
store.dispatch('load');

/* STORE */
function getStore() {

  let state = {
    categories: [],
    snippets: [],
    languages: []
  };

  let mutations = {
    categories(state, payload) {
      state.categories = payload;
    },
    snippets(state, payload) {
      state.snippets = payload;
    },
    languages(state, payload) {
      state.languages = payload;
    },
    add_category(state, category) {
      state.categories.push(category)
    },
    add_snippet(state, snippet) {
      state.snippets.push(snippet)
    },
    delete_category(state, categoryId) {
      state.categories.splice(state.categories.findIndex(category => {
        return category.id === categoryId;
      }), 1);
    },
    delete_snippet(state, snippetId) {
      state.snippets.splice(state.snippets.findIndex(snippet => {
        return snippet.id === snippetId;
      }), 1);
    }
  };

  let actions = {
    /* On récupère commit depuis l'objet context */
    load({ commit }) {
      /* On simule l'appel à une requête asynchrone qui renvoie
      une promesse.Quand la promesse est résolut on passe au then()
      qui prend en paramètre une fonction de callback qui prend elle-même
      en argument la valeur retournée par la promesse résolue, ici
      l'objet response */
      return Backend.load().then(response => {
        /* On commit les différentes parties du state à partir des
        données de l'objet response via les mutations*/
        commit('categories', response.message.categories);
        commit('snippets', response.message.snippets);
        commit('languages', response.message.languages);
      });
    },
    updateCategoryOrder({ commit }, payload) {
      /* On met à jour le state categories avec le nouveau tableau
      ici de draggable */
      commit('categories', payload);
      /* On sauvegarde la position du nouveau tableau categories
      sur le serveur via notre service Backend.
      saveCategoriesPosition() renvoie une promesse */
      Backend.saveCategoriesPosition(payload).then(response => {
        /* Si la réponse est un succès  */
        if (response.success) {
          // On affiche une notification de succès
          window.app.ui.success()
        } else {
          // Sinon on affiche l'erreur
          window.app.ui.error(response.message)
        }
      });
    },
    /* On debounce le dispatch vers l'action updateSnippetsOrder 
    pour éviter un double appel quand on déplace un snippet
    d'une catégorie à une autre */
    debounceUpdateSnippetsOrder: debounce(({ dispatch }, snippetsUpdated) => {
      dispatch('updateSnippetsOrder', snippetsUpdated);
    }, 100),
    updateSnippetsOrder({ state, commit }, snippetsUpdated) {
      // On parcours le tableau des snippets du state
      let payload = state.snippets.map(snippet => {
        /* Pour chaque snippet on cherche grâce à son id
        si il existe dans le tableau des snippets à mettre à jour,
        un snippet avec le même id, si l existe on le retroune dans
        snippetUpdated */
        let snippetUpdated = snippetsUpdated.find(snipUp => snipUp.id === snippet.id);
        // Si on trouve un snippet mis à jour
        if (snippetUpdated) {
          // On remplace le snippet du state par le nouveau mis à jour
          snippet = snippetUpdated
        }
        // On retourne le snippet avec ou sans modification
        return snippet
      });
      /* On commit le nouveau tableau des snippets grâce à la mutation
      snippets */
      commit('snippets', payload);

      /* On sauvegarde la position du nouveau tableau
      sur le serveur via le service Backend.
      saveSnippetsPosition() renvoie une promesse */
      Backend.saveSnippetsPosition(payload).then(response => {
        if (response.success) {
          window.app.ui.success()
        } else {
          window.app.ui.error(response.message)
        }
      });
    },
    /* Permet de mettre à jour ou créer un snippet */
    saveSnippet({ state, commit }, { snippetToSave, create }) {
      /* Si on est en mode creation on appelle la
      mutation add_snippet qui va push le nouveau snippet dans
      le tableau des snippets */
      if (create) {
        console.log('ok create snippet'); ///////////////////////////
        commit('add_snippet', snippetToSave);
      /* Sinon c'est que l'on est en mode update alors on
      update le tabeau des snippets avec le nouveau snippet */
      } else {
        console.log('ok update snippet');
        let payload = state.snippets.map(snippet => {
          if (snippet.id === snippetToSave.id) {
            snippet.title = snippetToSave.title;
            snippet.contents = snippetToSave.contents;
          }
          return snippet
        });
        commit('snippets', payload);
      }      
      /* On sauvegarde le nouveau snippet dans la bdd */
      Backend.saveSnippet(snippetToSave).then(response => {
        if (response.success) {
          window.app.ui.success()
        } else {
          window.app.ui.error(response.message)
        }
      });
    },
    addCategory({ commit }, name) {
      Backend.addCategory(name).then(response => {
        if (response.success) {
          /* On commit ajoute l'objet category avec son id généré côté
          serveur bdd dans le store */
          commit('add_category', response.message.category);
          window.app.ui.success()
        } else {
          window.app.ui.error(response.message)
        }
      });
    },
    deleteSnippet({ commit }, snippetId) {
      commit('delete_snippet', snippetId);
    },
    deleteCategory({ commit }, categoryId) {
      commit('delete_category', categoryId);
    },
    updateCategory({ state, commit }, categoryUpdated) {
      let payload = state.categories.map(category => {
        if (category.id === categoryUpdated.id) {
          category.name = categoryUpdated.name;
        }
        return category
      });
      commit('categories', payload);

      Backend.updateCategory(categoryUpdated).then(response => {
        if (response.success) {
          window.app.ui.success()
        } else {
          window.app.ui.error(response.message)
        }
      });
    }
  };

  return new Vuex.Store({
    state,
    mutations,
    actions
  })

}