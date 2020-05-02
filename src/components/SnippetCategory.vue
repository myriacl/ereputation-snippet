<template>

	<div style="padding:15px;border:3px solid lightcoral;margin:15px">
		<h3>
			<button data-drag-category>↕</button>
			{{ category.name }}
		</h3>

		<draggable v-model="snippets" v-bind="dragOptions">
			<SnippetItem v-for="snippet in snippets" :snippet="snippet" :key="snippet.id"></SnippetItem>
		</draggable>
    {{ snippets }}

	</div>

</template>

<script>
	import SnippetItem from "./SnippetItem";

	let draggable = require('vuedraggable');

	export default {
		name: "SnippetCategory",
		props: ['category'],
		components: {
			SnippetItem,
			draggable
		},
		computed: {
      snippets:{
				get() {
          /* On recupère les snippets qui ont un category.id correspondant
          à la catégorie courante puis on trie le tableau des snippets 
          selon leur propriété position */
					return this.$store.state.snippets.filter(snippet => {
            return snippet.category_id === this.category.id
          }).sort((item1, item2) => (+item1.position - +item2.position));
				},
				set(value) {
          /* On récupère le tableau value des snippets de la catégorie
          réordonné par draggable, on met à jour la propriété position
          des snippets en fonction de leur index dans le tableau et on leur
          attribut leur nouveau category_id si ils proviennent d'un autre
          block de catégorie */
          let snippetsUdpated = value.map((obj, index) => {
            obj.category_id = this.category.id
            obj.position = index + 1;
            return obj;
          })
          /* On dispatch une action updateSnippetsOrder avec les snippets à 
          mettre à jour dans le store */
          this.$store.dispatch('updateSnippetsOrder', snippetsUdpated);
				}
			},
			dragOptions(){
				return {
					group: 'snippets',
					animation: 150,
					handle: '[data-drag-snippet]',
					forceFallback: true, //key to make autoScroll works
				}
			}
		}
	}
</script>
