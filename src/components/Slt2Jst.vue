<template>
  <div
    id="slt2jst"
    class="col me"
  >
    SLT⇨JST変換機 :
    SLT <input
      v-model="sltCalculate"
      type="text"
      @change="doSltCalculate()"
    >
    ⇨
    日本時間 {{ sltCalculateJST }}
    (時差 +{{ jisa/60/60/1000 }}時間)
  </div>
</template>

<script>

export default {
  name: 'Slt2Jst',
  data: function () {
    return {
      sltCalculate: '2020/01/01 00:00',
      sltCalculateJST: '2020/01/01 00:00',
      jisa: 0
    }
  },
  mounted () {
    this.sltCalculate = this.epoch2str(new Date() - this.calculateJisa(new Date()))
    this.doSltCalculate()
  },
  methods: {
    // 日本とDSTの時差は基本17時間差だが、サマータイムは16時間差になる
    getDstStart (argYear) {
      // 3月の第2日曜日を検索
      var dstStart = new Date(argYear, 3 - 1, 1, 2, 0, 0)
      let sunday = 0
      for (var i = 1; i <= 14; i++) {
        dstStart.setDate(i)
        if (dstStart.getDay() === 0) {
          if (sunday++) {
            break
          }
        }
      }
      return dstStart.getTime()
    },
    getDstEnd (argYear) {
      // 11月の第一日曜日
      var dstEnd = new Date(argYear, 11 - 1, 1, 2, 0, 0)
      for (var i = 1; i <= 7; i++) {
        dstEnd.setDate(i)
        if (dstEnd.getDay() === 0) {
          break
        }
      }
      return dstEnd.getTime()
    },
    niketa (number) {
      return ('0' + number).slice(-2)
    },
    str2epoch (str) {
      return Date.parse(str)
    },
    epoch2str (num) {
      const currentdate = new Date(num)
      return currentdate.getFullYear() + '/' +
      this.niketa(1 + currentdate.getMonth()) + '/' +
      this.niketa(currentdate.getDate()) + ' ' +
      this.niketa(currentdate.getHours()) + ':' +
      this.niketa(currentdate.getMinutes())
    },
    calculateJisa (num) {
      // const start = new Date(2021, 3 - 1, 21, 2) // 3月の第2日曜日
      // const end = new Date(2021, 11 - 1, 7, 2) // 11月の第1日曜日
      const start = this.getDstStart(new Date(num).getFullYear())
      const end = this.getDstEnd(new Date(num).getFullYear())
      if (start < num && num < end) {
        return 16 * 60 * 60 * 1000 // 夏
      } else {
        return 17 * 60 * 60 * 1000 // 冬
      }
    },
    doSltCalculate: function (e) {
      let tmp = Date.parse(this.sltCalculate)
      this.jisa = this.calculateJisa(tmp)
      tmp = tmp + this.jisa
      this.sltCalculateJST = this.epoch2str(tmp)
    }
  }

}
</script>

<style scorped>
  .me{
    background: #fdfcec;
    border: 1px solid #ffb03f;
    border-radius: 5px;
    padding: 1;
    margin-left: 15px;
    margin-bottom: 5px;
  }
  input {
    font-size: small;
    padding: 0px 0px 0px 0px;
    margin-right: 5px;
    margin-bottom: 1px;
  }
</style>
