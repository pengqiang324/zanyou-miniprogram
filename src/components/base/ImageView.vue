<template>
  <div class="image-view" @click="onClick">
    <view>
      <image :class="[round ? ' round image' : 'image', className, img, mode]" :style="{ 'height': height }" :src="img"
        :mode="mode" :lazy-load="lazyLoad" default-source="/static/images/logo.png"/>
    </view>
  </div>
</template>

<script>
  export default {
    externalClasses: ['inner-class'],
    props: {
      src: {
        type: String,
        default: ''
      },
      mode: {
        type: String,
        default: 'widthFix'
      },
      lazyLoad: {
        type: Boolean,
        default: true
      },
      round: {
        type: Boolean,
        default: false
      },
      height: {
        type: String,
        default: 'auto'
      },
      className: {
        type: String,
        default: ''
      }
    },
    computed: {
      img() {
        return this.src ? this.src : '/static/images/logo.png'
      }
    },
    data() {
      return {
        platform: mpvuePlatform
      }
    },
    methods: {
      onClick() {
        this.$emit('onClick')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-view {
    width: 100%;
    height: 100%;
    .round {
      border-radius: 50%;
    }
    .image {
      width: 100%;
      height: 100%;
    }
  }
</style>
