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


new Vue({
    render: h => h(ReputationSnippetEditor),
    store
}).$mount('#app')

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
        load({commit}) {
            return Backend.load().then(response => {
                commit('categories', response.message.categories);
                commit('snippets', response.message.snippets);
                commit('languages', response.message.languages);
            });
        },
        updateCategoryOrder({commit}, payload) {
            commit('categories', payload);
            Backend.saveCategoriesPosition(payload).then(response => {
                console.log(response.success)
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