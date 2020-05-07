<template>
    <div class="accordion" v-bind:class="theme">
        <!-- <div class="header" v-on:click="toggle">
          <slot name="header">HINT</slot>
          <i class="header-icon" v-bind:class="{ rotate: show }">⛛</i>
        </div> -->
        <transition name="AccordeonTransition"
                    v-on:before-enter="beforeEnter" v-on:enter="enter"
                    v-on:before-leave="beforeLeave" v-on:leave="leave">
            <div class="body" v-if="editing">
                <div class="body-inner">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "AccordeonTransition",
        props: ['theme', 'editing'],
        data() {
            return {
                show: false,
            }
        },
        methods: {
            toggle: function () {
                this.show = !this.show;
            },
            beforeEnter: function (el) {
                el.style.height = '0';
            },
            enter: function (el) {
                el.style.height = el.scrollHeight + 'px';
            },
            beforeLeave: function (el) {
                el.style.height = el.scrollHeight + 'px';
            },
            leave: function (el) {
                el.style.height = '0';
            }
        }
    }
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Lato');

    .accordion {
        max-width: 100%;
    }

    .accordion .body {
        transition: 150ms ease-out;
    }

    /* .accordion .body-inner {
      padding: 8px;
      overflow-wrap: break-word;
      white-space: pre-wrap;
    }

    .accordion .header-icon.rotate {
      transform: rotate(180deg);
      transition-duration: 0.3s;
    }

    .accordion.purple {
      background-color: #8c618d;
    }

    .accordion.purple .body {
      border-color: #8c618d;
    } */
</style>
