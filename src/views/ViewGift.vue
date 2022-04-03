<template>
  <div class="col col-12 row">
    <gift-list ref="appGiftList" />
  </div>
</template>

<script>
import GiftList from '@/components/GiftList'

export default {
  name: 'Gift',
  components: {
    GiftList
  }
}
</script>
<style>
.row{
  padding-right: 4px;
  padding-left: 4px;
}
.ad{
  text-align: center;
  padding: 0;
  margin-left: 15px;
  margin-bottom: 15px;

}
</style>
