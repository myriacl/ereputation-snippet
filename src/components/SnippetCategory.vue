<template>

	<div style="padding:15px;border:3px solid lightcoral;margin:15px">
		<h3>
			<button data-drag-category>↕</button>
			{{ category.name }}
		</h3>

		<draggable v-model="snippets" v-bind="dragOptions">
			<SnippetItem v-for="snippet in snippets" :snippet="snippet" :key="snippet.id"></SnippetItem>
		</draggable>

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
			snippets() {

				return this.$store.state.snippets.filter(snippet => {
					return snippet.category_id === this.category.id
				});

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
