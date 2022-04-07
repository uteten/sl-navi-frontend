<template>
  <div class="col col-12 row">
    <gift-list ref="appGiftList" />
    <Adsense
      data-ad-client="ca-pub-7267369281211974"
      data-ad-slot="4854478492"
      ins-style="display:inline-block;width:100%;height:160px;"
      data-ad-format=""
      data-full-width-responsive=""
    />
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
