<template>
<div class="view">
 <h4>イベント登録画面</h4>

<div class="card-body">
	<form>

	<div class="col-md-8 order-md-1">
		<label>投稿者：</label>
			<template v-if="username">
				<a href="javascript:void(0)" v-on:click="logout()">{{ username }}(ログアウトする場合はクリックしてください)</a>
			</template>
			<template v-else>
				<a href="//sl-navi.com/user/login/twitter/?next=/%23/createEvent">未ログイン(イベント登録にはTwitter認証が必要です。ここをクリックして認証してね)</a>
			</template>
		<br>
		<p class="alert alert-danger" v-if="errors.username" v-html="errors.username"></p>

		<label for="id_title">イベント名（必須）:</label>
		<input v-model="title" name="title" type="text"  maxlength="64" class="form-control" required id="id_title">
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
					noLabel
					noHeader
				/>
		<p class="alert alert-danger" v-if="errors.start_time" v-html="errors.start_time"></p>

		<label for="id_end_time">終了日時（必須）:</label>
		<VueCtkDateTimePicker 
					v-model="end_time"
          format="YYYY-MM-DD HH:mm"
					:minDate="start_time"
					noLabel
					noHeader
				/>
		<p class="alert alert-danger" v-if="errors.end_time" v-html="errors.end_time"></p>
		
		<label for="id_description">詳細（必須）（タグとか使えないです。単なるテキストでお願いします）:</label>
		<textarea v-model="description" name="description" cols="20" rows="20" class="form-control" required id="id_description"></textarea>
		<p class="alert alert-danger" v-if="errors.description" v-html="errors.description"></p>

		<label for="id_map_url">マップ（必須）(SIM名に「スペース」があるときは、代わりに「%20」を入力してください）:</label>
		<input v-model="map_url" name="map_url" type="text" placeholder="https://maps.secondlife.com/secondlife/SIM-NAME/XXX/YYY/ZZZ" maxlength="200" class="form-control" required id="id_map_url">
		<p class="alert alert-danger" v-if="errors.map_url" v-html="errors.map_url"></p>

		<label for="id_shop_flag">SL-Naviの関連施設の画像UID（任意）（イベント期間中の看板が目立つようになります）:</label>
		<input v-model="shop_flag" name="shop_flag" type="text" placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" maxlength="37" class="form-control" id="id_shop_flag">
		<p class="alert alert-danger" v-if="errors.shop_flag" v-html="errors.shop_flag"></p>
		<br>
		<div class="form-row">
			<div class="col-sm-2">
				<button type="button" class='form-control' @click="postEvent()">投稿</button>
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
			shop_flag:""
    }
  },
  methods: {
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
			const params = {
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
			const headers ={
				'X-CSRFTOKEN': this.csrftoken
			}
			axios.post(EVENT_SOURCE, params,{headers: headers}
			).then(res =>{
				alert("投稿に成功しました")
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
			await axios.get(LOGIN_STATUS_URL).then(res => {
				this.username=res.data[0].name
				console.log(["username=",this.username])
      }).catch(err=>{
				console.log(err)
				this.username=""
			})
		}
	},mounted () {
		this.getUsername()
		this.csrftoken = this.getCookie('csrftoken')
		// this.csrftoken="testabc"
		// console.log(["csrftoken=",this.csrftoken])
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
