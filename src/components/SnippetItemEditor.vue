<template>
    <div>
			<div class="form-group pt-3">
        <input class="form-control" v-model="snippetModified.title" type="text" placeholder="Title goes here">
      </div>

      <ul class="nav nav-tabs pb-2 border-bottom-0">
        <li 
        class="nav-item"
        @click="selectedTab = language.id"          
        v-for="language in languages" 
        :key="language.id"
        >
          <a class="nav-link" :class="{ active: selectedTab === language.id }" @click.prevent href="#">
            {{language.name}}
          </a>
        </li>
      </ul>

      <div class="form-group" v-for="(item, index) in snippetModified.contents" :key="`${index}-${snippet.id}`" v-show="selectedTab === item.language_id">
        <textarea class="form-control" v-model="item.content" style="width: 100%" rows="4"></textarea>
      </div>     

			<div class="text-right">
        <button class="btn btn-primary ml-2" @click="saveSnippet">Enregistrer</button>
        <button class="btn btn-secondary  ml-2" @click="cancel">Annuler</button>
      </div>

      Snippet: {{ snippet }} <br>
      Snippet Local: {{ snippetModified }}
		</div>

</template>

<script>
  import {mapState} from "vuex";
  import cloneDeep from 'lodash/cloneDeep';

	export default {
		name: "SnippetItemEditor",
		props: ['snippet'],
		data() {
			return {
        selectedTab: 1,
        snippetModified: cloneDeep(this.snippet)
			}
		},
		computed:{
      ...mapState(['languages']),
    },
    methods: {
      saveSnippet() {
        this.$store.dispatch('saveSnippet', this.snippetModified);      
      },
      cancel() {
        this.snippetModified = cloneDeep(this.snippet)
        this.$emit('close-editor')
      }
    }
	}
</script>
