import Vue from 'vue'
import App from './App.vue'
require("dotenv").config();

import firebase from "firebase";

Vue.config.productionTip = false



// Your web app's Firebase configuration
var firebaseConfig = {
    //init  key firebase
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
    render: (h) => h(App),
}).$mount("#app");