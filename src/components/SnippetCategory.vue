<template>

    <div style="padding:15px;border:3px solid black;margin:15px">
        <h3 class="p-2">
            <button class="btn btn-secondary btn-sm mr-2" data-drag-category>↕</button>
            {{ category.name }}
        </h3>

        <draggable
                v-model="snippets"
                v-bind="dragOptions"
                :class="'zone' + category.id"
                @change="end"
        >
            <SnippetItem
                    v-for="(snippet, index) in snippets"
                    :snippet="snippet"
                    :key="`${index}-${snippet.id}`"
            >
            </SnippetItem>
        </draggable>
    </div>

</template>

<script>
    import SnippetItem from "./SnippetItem";

    let draggable = require('vuedraggable');

    export default {
        name: "SnippetCategory",
        props: ['category'],
        data() {
            return {
                newSnippets: []
            }
        },
        components: {
            SnippetItem,
            draggable
        },
        computed: {
            snippets: {
                get() {
                    /* On recupère les snippets qui ont un category.id correspondant
                    à la catégorie courante puis on trie le tableau des snippets
                    selon leur propriété position */
                    return this.$store.state.snippets.filter(snippet => {
                        return snippet.category_id === this.category.id
                    }).sort((item1, item2) => (item1.position - item2.position));
                },
                set(value) {
                    // On récupère tableau des snippets modifié par draggable
                    this.newSnippets = value
                }
            },
            dragOptions() {
                return {
                    group: 'snippets',
                    animation: 150,
                    handle: '[data-drag-snippet]',
                    forceFallback: true, // Key to make autoScroll works
                }
            }
        },
        methods: {
            end(event) {
                console.log('end', event);
                /* On ne dispatch pas sur l'event remove pour ne pas
                générer deux événements successifs quand on passe un item
                d'une liste à une autre */
                if (event.added || event.moved) {
                    /* On récupère le tableau value des snippets de la catégorie
                     réordonné par draggable, on met à jour la propriété position
                     des snippets en fonction de leur index dans le tableau et on leur
                     attribut leur nouveau category_id si ils proviennent d'un autre
                     block de catégorie */
                    let snippetsUdpated = this.newSnippets.map((obj, index) => {
                        obj.category_id = this.category.id
                        obj.position = index + 1;
                        return obj;
                    })
                    /* On dispatch une action updateSnippetsOrder avec les snippets à
                    mettre à jour dans le store */
                    this.$store.dispatch('updateSnippetsOrder', snippetsUdpated);
                }
            }
        }
    }
</script>
