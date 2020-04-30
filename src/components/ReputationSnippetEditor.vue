<template>

	<div>
		Hello

		<draggable v-model="categories" v-bind="dragOptions">
			<SnippetCategory v-for="category in categories" :category="category" :key="category.id">

			</SnippetCategory>
		</draggable>


	</div>

</template>

<script>
	import SnippetCategory from "./SnippetCategory";

	let draggable = require('vuedraggable');

	export default {
		name: 'ReputationSnippetEditor',
		components: {
			SnippetCategory,
			draggable
		},
		computed: {

			categories:{
				get(){
					return this.$store.state.categories
				},

				set(value){
					this.$store.dispatch('updateCategoryOrder', value);
				}

			},


			dragOptions() {
				return {
					animation: 150,
					handle: '[data-drag-category]',

					forceFallback: true, //key to make autoScroll works
				}
			}
		}
	}
</script>

