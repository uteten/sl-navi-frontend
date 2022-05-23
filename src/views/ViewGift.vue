<template>
  <div class="col col-12 row">
    <div class="col-lg-10 order-lg-2 order-1">
      <gift-list ref="appGiftList" />
    </div>
    <div
      class="col-lg- order-lg-1 order-2"
    >
      <Adsense
        data-ad-client="ca-pub-7267369281211974"
        data-ad-slot="3044016459"
        ins-style="display:inline-block;width:160px;height:800px;"
        data-ad-format=""
        data-full-width-responsive=""
      />
    </div>
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
  padding-right: 0px;
  padding-left: 0px;
}
.col-lg-10{
  padding-left: 0px;
  padding-right: 0px;
}
.col{
  margin-left: 0px;
  margin-left: 0px;
  margin-bottom: 15px;
}
.ad{
  text-align: center;
  padding: 0;
  margin-left: 15px;
  margin-bottom: 15px;
  width: 100%;

}
</style>
