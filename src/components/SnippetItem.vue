<template>
	<div style="margin-bottom: 3px">

		<button data-drag-snippet>☰</button>

		{{ snippet.title }}

		<div style="float: right">
			<button @click="editing=!editing">modifier</button>
			<button>supprimer</button>
		</div>


		<div v-if="editing">
			<input type="text" placeholder="Title goes here">


			<br>
			<!-- switch la langue affichée -->
			<button v-for="language in languages" :key="language.id">{{language.name}}</button>


			<textarea style="width: 100%" rows="4">
				Bonjour tout le monde !
			</textarea>

			<!--<textarea style="width: 100%" rows="4">
				Hello everyone !
			</textarea>-->


			<button>Enregistrer</button>
		</div>
		<!--
		zone d'affichage du snippet editor

		-->


	</div>
</template>

<script>
	import {mapState} from "vuex";

	export default {
		name: "SnippetItem",
		props: ['snippet'],
		data(){
			return{
				editing: false
			}
		},
		computed:{
			...mapState(['languages'])
		}
	}
</script>
