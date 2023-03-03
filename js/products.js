import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import  pagination from './pagination.js';

let productModal = null;
let delProductModal = null;

const api = {
  url: 'https://vue3-course-api.hexschool.io/v2',
  path: 'element-ice',
};

const app = {
    components: {
        pagination,
    },
  data() {
    return {
      api,
      products: {},
      productDetail: {},
      tempProduct: {
        imagesUrl: [],
        },
      isNew: false,
      pagination: {},
    }
  },
  methods: {
    checkUser() {
      axios.post(`${this.api.url}/api/user/check`)
      .then((res) => {
        this.getProdList();
      }).catch((err) =>{
        console.log(err);
        alert('無管理權限!');
        window.location = './index.html';
      })
    },
    // 登出功能
    logout() {
        axios.post(`${this.api.url}/logout`)
        .then((res) => {
            alert('已登出！');
            window.location = './index.html';
        }).catch((err) => {
            console.log(err);
        })
    },
    // 取得產品清單
    getProdList(page = 1) {
        axios.get(`${this.api.url}/api/${this.api.path}/admin/products/?page=${page}`)
        .then((res) => {
            const { products, pagination } = res.data;
            this.products = products;
            this.pagination = pagination;
            console.log(res.data);
        }).catch((err) => {
            alert('產品清單取得異常!');
            console.log(err);
        })
    },
    openModal(status, product) {
        if(status === 'add') {
            this.tempProduct = {
                imagesUrl: [],
            }
            productModal.show();
            this.isNew = true;
        } else if (status === 'edit') {
            this.tempProduct = JSON.parse(JSON.stringify(product));
            const tempImagesUrl = this.tempImagesUrl?.imagesUrl ?? [];
            productModal.show();
        } else if (status === 'delete') {
            this.tempProduct = JSON.parse(JSON.stringify(product));
            const tempImagesUrl = this.tempImagesUrl?.imagesUrl ?? [];
            delProductModal.show();            
        }
    },
    // 新增與修改資料
    updateProduct(){
        let url = `${this.api.url}/api/${this.api.path}/admin/product`;
        let method = 'post';

        if(!this.isNew) {
            url = `${this.api.url}/api/${this.api.path}/admin/product/${this.tempProduct.id}`;
            method = 'put';
        }
        axios[method](url, {data: this.tempProduct })
        .then((res) => {
            const { message } = res.data;
            alert(`${this.tempProduct.title}，${message}`);
            this.getProdList();
            productModal.hide();
        }).catch((err) => {
            console.log(err);
            const { message } = err.data;
            alert(`錯誤內容：${message}，產品資料新增失敗`);
            delProductModal.hide();
        })
    },
    // 確認刪除產品資料
    delProduct() {
        let url = `${this.api.url}/api/${this.api.path}/admin/product/${this.tempProduct.id}`
        axios.delete(url)
            .then((res) => {
                console.log(res);
                const { message } = res.data
                alert(`${message}：${this.tempProduct.title}`);
                delProductModal.hide();
                this.getProdList();

            }).catch((err) => {
                const { message } = err.data;
                alert(message);
                delProductModal.hide();
            })
    },
    createImg(){
        this.tempProduct.imagesUrl = [];
        this.tempProduct.imagesUrl.push('');
       
    }
  },
  mounted() {
    // 新增修改畫面
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
        keyboard: false,
        backdrop: false,
      });

    //   刪除畫面
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
        keyboard: false,
        backdrop: false,
      });

    // 取出 Token 
    const cookieValue = document.cookie
    .split('; ').find((row) => row.startsWith('loginToken='))?.split('=')[1];

    axios.defaults.headers.common['Authorization'] = cookieValue;
    
    this.checkUser();
  }
}
createApp(app)
 .mount('#app');