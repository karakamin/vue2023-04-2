import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const api = {
  url: 'https://vue3-course-api.hexschool.io/v2',
  path: 'element-ice'
};
const user = {
  username: '',
  password: '',
};
const app = {
  data() {
    return {
      api,
      user,
    }
  },
  methods:{
    login() {
      axios.post(`${this.api.url}/admin/signin`, this.user)
      .then((res) => {
        const { message, expired, token } = res.data;

        document.cookie = `loginToken${token};expires=${new Date(expired)}; path=/`;
        
        alert(`您好！${message}`);
        window.location = './products.html';
      }).catch((err) => {
        alert('登入異常');
        console.log(err);
      })
    }
  }
}
createApp(app)
  .mount('#app');