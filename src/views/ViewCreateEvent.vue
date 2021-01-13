<template>
<div class="view">
<h4 v-if="eid==0">イベント登録画面</h4>
<h4 v-else>イベント更新画面</h4>

<div class="card-body">
	<form>

	<div class="col-md-8 order-md-1">
		<label>投稿者：</label>
			<template v-if="username">
				<a href="javascript:void(0)" v-on:click="logout()">{{ username }}(ログアウトする場合はクリックしてください)</a>
			</template>
			<template v-else>
				未ログイン(以下のいずれかで認証してください。)<br>
				<span class="badge badge-info">いずれの認証もSL-Naviでアカウント情報を管理しないため安全です</span><br>
				<ul>
				<li>Twitter認証(<a href="//sl-navi.com/user/login/twitter/?next=/createEvent">ここをクリック</a>)</li>
				<li>SL認証(<a target=_blank href="http://maps.secondlife.com/secondlife/japan%20canvas/102/172/2002">SL内の認証用オブジェクト</a>にタッチし、表示されるURLにこのブラウザでアクセス)</li>
				</ul>
			</template>
		<br>
		<p class="alert alert-danger" v-if="errors.username" v-html="errors.username"></p>

		<label for="id_title">イベント名（必須）:</label>
		<input @change="checkLogin" v-model="title" name="title" type="text"  maxlength="64" class="form-control" required id="id_title">
		<p class="alert alert-danger" v-if="errors.title" v-html="errors.title"></p>

		<label for="id_img_url">画像（必須）（UID or URL）:</label>
		<div class="form-row">
			<div class="form-group col-sm-10">
				<input v-model="img_url" name="img_url" type="text" placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX or https://xxx..." maxlength="200" class="form-control" required id="id_img_url">
			</div>
			<div class="col-sm-2">
				<button type="button" class='form-control' @click="loadImgUrl()">画像読込</button>
			</div>
		<img id="kanban_img" :src="load_img_url" @error='loadImgUrlError(this)'>
		</div>
		<p class="alert alert-danger" v-if="errors.img_url" v-html="errors.img_url"></p>


    <label for="id_mode">対象（必須）:</label>
		<select v-model="mode" name="mode" class="form-control" id="id_mode">
			<option value="k" selected>一般</option>
			<option value="e">アダルト</option>
		</select>
		<p class="alert alert-danger" v-if="errors.mode" v-html="errors.mode"></p>

		<label for="id_genre">ジャンル（必須）:</label>
		<select v-model="genre" name="genre" class="form-control" required id="id_genre">
			<option value="">---------</option>
			<option value="3">ライブ</option>
			<option value="5">ゲーム</option>
			<option value="6">セール</option>
			<option value="7">祭り</option>
			<option value="1">ラジオ</option>
			<option value="2">ダンス</option>
			<option value="9">ショー</option>
			<option value="8">その他</option>
		</select>
		<p class="alert alert-danger" v-if="errors.genre" v-html="errors.genre"></p>

		<label for="id_start_time">開始日時（必須）:</label>
		<VueCtkDateTimePicker 
					v-model="start_time"
          format="YYYY-MM-DD HH:mm"
					:first-day-of-week=1
					noLabel
					noHeader
				/>
		<p class="alert alert-danger" v-if="errors.start_time" v-html="errors.start_time"></p>

		<label for="id_end_time">終了日時（必須）:</label>
		<VueCtkDateTimePicker 
					v-model="end_time"
          format="YYYY-MM-DD HH:mm"
					:first-day-of-week=1
					:minDate="start_time"
					noLabel
					noHeader
					v-on:click="input_end_time_flag=1"
				/>
		<p class="alert alert-danger" v-if="errors.end_time" v-html="errors.end_time"></p>
		
		<label for="id_description">詳細（必須）（タグとか使えないです。単なるテキストでお願いします。画像のURLを張ると自動で画像になります）:</label>
		<textarea v-model="description" name="description" cols="20" rows="20" class="form-control" required id="id_description"></textarea>
		<p class="alert alert-danger" v-if="errors.description" v-html="errors.description"></p>

		<label for="id_map_url">マップ（必須）(SIM名に「スペース」があるときは、代わりに「%20」を入力してください）:</label>
		<input v-model="map_url" name="map_url" type="text" placeholder="https://maps.secondlife.com/secondlife/SIM-NAME/XXX/YYY/ZZZ" maxlength="200" class="form-control" required id="id_map_url">
		<p class="alert alert-danger" v-if="errors.map_url" v-html="errors.map_url"></p>

		<label for="id_shop_flag">主催する施設がSL-naviにある場合、その画像UID（任意）:</label>
		<input v-model="shop_flag" name="shop_flag" type="text" placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" maxlength="37" class="form-control" id="id_shop_flag">
		※入力すると、施設の看板画像をクリックしたときに、イベント情報のリンクも追加表示します。<br>
		（ただ、イベント開催場所が主催する施設のTPポイントと近い場合は、自動で関連付くので入力不要です)
		<p class="alert alert-danger" v-if="errors.shop_flag" v-html="errors.shop_flag"></p>
		<br><br>
		<div class="form-row">
			<div class="col-sm-2">
				<button type="button" class='form-control' @click="postEvent()">
					<template v-if="eid==0">投稿</template>
					<template v-else>更新</template>
				</button>
			</div>
		</div>
		<hr>
		※投稿したデータを削除する際は、ログインした状態でイベントカレンダーからイベントを選択し画面下の[削除]ボタンを押してください
	</div>
	</form>
</div>

</div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker)

var LOGIN_STATUS_URL = '//sl-navi.com/event/api/user'
var LOGOUT_URL = '//sl-navi.com/event/api/user/logout'
var EVENT_SOURCE = '//sl-navi.com/event/api/slevent'
var BLANK_IMG="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
export default {
  name: 'ViewCreateEvent',
  data: function () {
    return {
			load_img_url:BLANK_IMG,
			errors:{}, 
			csrftoken: "dmy",
			username: "",
			title:"",
			img_url:"",
			mode:"k",
			genre:"",
			start_time:"",
			end_time:"",
			description:"",
			map_url:"",
			shop_flag:"",
			eid:0,
			sl_auth:0
    }
  },
  methods: {
		checkLogin: function() {
			if(!this.username){
				alert("先にログイン認証してください")
				this.title=""
			}
		},
		loadImgUrl: function () {
			this.$delete(this.errors,"img_url")
			// URLチェックしたあと<img>に表示
			let tmp_url;
			let ret=this.img_url.match(/^https:\/\/gyazo.com\/(.*)/);
			if(ret) {
				tmp_url="https://i.gyazo.com/"+ret[1]+".png";
			}else if(this.img_url.match("^(http://|https://)")){
				tmp_url=this.img_url;
			}else if(this.img_url.match("[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}")){
				tmp_url="https://secondlife.com/app/image/"+this.img_url+"/2";
			}else if(this.img_url.match("^/static/event_img/")){
				tmp_url=this.img_url;
			}else{
				tmp_url=""
			}
			this.img_url=tmp_url
			this.load_img_url=this.img_url
		},
		loadImgUrlError: function () {
			this.load_img_url=BLANK_IMG
			this.$set(this.errors,"img_url","画像が読み込めません.入力データを確認してください")
		},
		getCookie: function (name) {
			let cookieValue = null;
			if (document.cookie && document.cookie !== '') {
					const cookies = document.cookie.split(';');
					for (let i = 0; i < cookies.length; i++) {
							const cookie = cookies[i].trim();
							// Does this cookie string begin with the name we want?
							if (cookie.substring(0, name.length + 1) === (name + '=')) {
									cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
									break;
							}
					}
			}
			return cookieValue;
		},
    postEvent: function () {
			this.errors={}
			if(this.username==""){
				this.$set(this.errors,"username","↑まずログインしてください")
			}
			if(this.load_img_url==BLANK_IMG || this.load_img_url!=this.img_url){
				this.$set(this.errors,"img_url","URLもしくはUIDを入力した後、画像読込ボタンを押してください")
			}
			if(!this.map_url.match("^(http://|https://)maps.secondlife.com/secondlife/")){
				this.$set(this.errors,"map_url","正しいマップのURLを入力してください")
			}
			// 必須項目チェック
			let keys=["title","genre","start_time","end_time","description"]
			for(let z in keys){
					if(!this[keys[z]]){
						this.$set(this.errors,keys[z],"この項目は必須です")
					}
			}
			if(Object.keys(this.errors).length>0){
				alert("投稿に失敗しました。投稿内容を確認してください。")
				return
			}
			let params = {
				title: this.title,
				img_url: this.img_url,
				mode: this.mode,
				genre: this.genre,
				start_time: this.start_time,
				end_time: this.end_time,
				description: this.description,
				map_url: this.map_url,
				shop_flag: this.shop_flag
			}
			if(this.eid){
				params["eid"]=this.eid
			}
			const headers ={
				'X-CSRFTOKEN': this.csrftoken
			}
			axios.post(EVENT_SOURCE, params,{headers: headers}
			).then(res =>{
				alert("投稿に成功しました(投稿がWeb反映されるのに1分程度かかります)")
				console.log(res)
				this.title=""
				this.img_url=""
				this.load_img_url=BLANK_IMG
				this.mode="k"
				this.genre=""
				this.start_time=""
				this.end_time=""
				this.description=""
				this.map_url=""
				this.shop_flag=""
      }).catch(err=>{
				console.log(["error",err])
				for(var key in err.response.data) {
					this.$set(this.errors, key, err.response.data[key].join('<br>'));
				}
				if(err.response.status==403){
					alert("投稿に失敗しました。認証情報が確認できないか画面遷移がおかしい可能性があります。画面を更新してから投稿してください。")
				}else{
					alert("投稿に失敗しました。投稿内容を確認してください。")
				}
			})
		},
    async logout () {
			await axios.get(LOGOUT_URL).then(res => {
				console.log(res)
				this.username=""
			})
		},
    async getUsername () {
			let logincode=""
			if(this.$route.params.logincode){
				logincode="/login/"+this.$route.params.logincode
			}
			await axios.get(LOGIN_STATUS_URL+logincode).then(res => {
				if(res.data[0]){
					this.username=res.data[0].username
					this.csrftoken = this.getCookie('csrftoken')
					console.log(["csrftoken=",this.csrftoken])
				}else{
					this.username=""
				}
				// console.log(["username=",this.username])
      }).catch(err=>{
				console.log(err)
				this.username=""
			})
		}
	},
	async mounted () {
		this.getUsername()
		this.csrftoken = this.getCookie('csrftoken')
		// this.csrftoken="testabc"
		console.log(["csrftoken=",this.csrftoken])

    if(this.$route.params.eid){
      await axios.get(EVENT_SOURCE+"/"+this.$route.params.eid).then(res => {
        let ee=res.data;

				this.eid=ee.id
        this.title=ee.title
        this.img_url=ee.img_url
				this.load_img_url=ee.img_url
        this.genre=ee.genre.id
				this.mode=ee.mode
        this.map_url=ee.map_url
        // this.ed_desc=this.escape_html(ee.description)
				this.ed_by=ee.created_by.name
				this.start_time=ee.start_time
				this.end_time=ee.end_time
				this.description=ee.description
				this.shop_flag=ee.shop_flag
      })
    }


	}
	,watch: {
    start_time: function (val) {
			if(!this.end_time){
				this.end_time = val;
			}
    }
  }
}
</script>

<style scorped>
label{
	font-weight: bold;
}
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

</style>
