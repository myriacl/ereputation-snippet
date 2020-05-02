import Vue from 'vue'
import Vuex from 'vuex'


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
            alert('success !')
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


Vue.use(Vuex)
import Backend from "./Backend";
import ReputationSnippetEditor from "./components/ReputationSnippetEditor";

Vue.config.productionTip = false


let store = getStore()

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

    };

    let actions = {
        /* On récupère commit depuis l'objet context */
        load({commit}) {
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
        updateCategoryOrder({commit}, payload) {
            /* On met à jour le state categories avec le nouveau tableau
            ici de draggable */
            commit('categories', payload);
            /* On sauvegarde la position du nouveau tableau categories
            sur le serveur via notre service Backend.
            saveCategoriesPosition() renvoie une promesse */
            Backend.saveCategoriesPosition(payload).then(response => {
                console.log(response.success)
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
        updateSnippetsOrder({state, commit}, snippetsUpdated) {
          // On parcours le tableau des snippets du state
          let payload = state.snippets.map(snippet => {
            /* Pour chaque snippet on cherche grâce à son id 
            si il existe dans le tableau des snippets à mettre à jour
            un snippet avec le même id si l existe on le retroune dans
            snippetUpdated */
            let snippetUpdated = snippetsUpdated.find(snipUp => snipUp.id === snippet.id);
            // Si on trouve un snippet mis à jour
            if (snippetUpdated) {
              // On remplace le snippet du state par le nouveau mis à jour
              snippet = snippetUpdated
            }
            // Sinon on retourne le snippet tel quel sans modification
            return snippet
          });
          /* On commit le nouveau tableau des snippets grâce à la mutation
          snippets */
          commit('snippets', payload);
        }
    };

    return new Vuex.Store({
        state,
        mutations,
        actions
    })

}