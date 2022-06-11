<template>
  <div class="col col-12 row">
    <div class="col-lg-12 order-lg-1 order-1">
      <gift-list ref="appGiftList" />
    </div>
    <!--

    <div
      class="ad col-lg- order-lg-2 order-2"
    >
      <Adsense
        data-ad-client="ca-pub-7267369281211974"
        data-ad-slot="3044016459"
        ins-style="display:inline-block;width:160px;height:800px;"
        data-ad-format=""
        data-full-width-responsive=""
      />
    </div>
    -->
  </div>
</template>

<script>
import GiftList from '@/components/GiftList'

export default {
  name: 'ViewGift',
  components: {
    GiftList
  }
}
</script>
<style>
.ad{
  text-align: center;
  padding: 0;
  margin-left: 15px;
}
.row{
  padding-right: 4px;
  padding-left: 0px;
}
.col-lg-10{
  padding-left: 5px;
  padding-right: 5px;
}
.col{
  margin-left: 0px;
  margin-left: 0px;
  margin-bottom: 15px;
}
</style>
