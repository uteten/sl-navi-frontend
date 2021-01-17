<template>
  <div class="view">
    <h5>■アクセス統計(9/15から記録開始)</h5>
    <highcharts :options="chartOptions" />
    凡例クリックで表示on/off(「看板が表示された回数」が大きすぎて他の項目が見えない場合、これをオフにすると他のも見えるようになる)
  </div>
</template>
<script>
import Vue from 'vue'
import HighchartsVue from 'highcharts-vue'
Vue.use(HighchartsVue)

import axios from 'axios'
Vue.prototype.$axios = axios

const LOG_SOURCE = 'https://sl-navi.com/api/analytics'
const SHOP_SOURCE = 'https://sl-navi.com/api/shop'

export default {
  data: function () {
    return {
      chartOptions: {
        chart: {
          type: 'spline'
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'datetime',
          labels: {
            format: '{value:%m-%d}',
            rotation: 0,
            align: 'left'
          }
        },
        series: [],
        credits: {
          enabled: false
        }
      }
    }
  },
  mounted () {
    axios.get(LOG_SOURCE, {
      params: {
        flag: this.$route.params.flag
      }
    }).then(res => {
      this.chartOptions['series'] = res.data
    })
    axios.get(SHOP_SOURCE, {
      params: {
        search: this.$route.params.flag
      }
    }).then(res => {
      this.chartOptions['title']['text'] = '「' + res.data[0].name + '」がSL-Naviで表示された回数'
    })
  }
}

</script>
<style scorped>
.sl-navi-kanban{
    width: 600px;
    height: 350px;
}
.osirase{
  color: #ffaa00;
}
h4{
  color: #ffaa00;
  border-bottom: dashed 2px #ffb03f;
}
dt{
  float: left;
}

dd{
  margin-left: 80px;
}
.sns_icon{
  width:20px;
  height:20px;
  margin: 5px;
}
</style>
