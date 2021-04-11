<template>
  <div id="app">
    <p>{{urlfirebase}}</p>
    <vue-dropzone
      ref="imgDropZone"
      id="customdropzone"
      :options="dropzoneOptions"
      @vdropzone-complete="afterComplete"
    ></vue-dropzone>
    <br>
     <button v-on:click="reverseMessage">Get data</button>
    <div v-if="images.length > 0" class="image-div">
      <div v-for="image in images" :key="image.src">
        <p>{{image.id}}</p>
        <img :src="image.src" class="image" />
        <button v-on:click="deleteImage(image.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>

import firebase from "firebase";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
let uuid = require("uuid");



export default {
  name: "App",
  components: {
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
      urlfirebase: process.env.DB_HOST,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        addRemoveLinks: true,
        acceptedFiles: ".jpg, .jpeg, .png",
        dictDefaultMessage: `<p class='text-default'><i class='fa fa-cloud-upload mr-2'></i> Drag Images or Click Here</p>
          <p class="form-text">Allowed Files: .jpg, .jpeg, .png</p>
          `,
      },
      images: [],
    };
  },
  methods: {
    async afterComplete(upload) {
      var imageName = uuid.v1();
      this.isLoading = true;
      try {
        //save image
        let file = upload;
        var metadata = {
          contentType: "image/png",
        };
        var storageRef = firebase.storage().ref();
        var imageRef = storageRef.child(`images/${imageName}.png`);
        await imageRef.put(file, metadata);
        var downloadURL = await imageRef.getDownloadURL();
        this.images.push({ src: downloadURL ,  id: imageRef.fullPath });
      } catch (error) {
        console.log(error);
      }
      this.$refs.imgDropZone.removeFile(upload);
    },
reverseMessage: function () {
 
  var _this = this
  _this.images.length = 0 
  var storageRef = firebase.storage().ref();
        var listRef = storageRef.child('images/');

        listRef.listAll()
  .then((res) => {
    // res.prefixes.forEach((folderRef) => {
    //   console.log(folderRef)
    // });
    res.items.forEach((itemRef) => {
      itemRef.getDownloadURL().then(function(result) {
              _this.images.push({ src: result, id: itemRef.fullPath });
           });  
    });
  }).catch((error) => {
    console.log(error)
  });

    },

   async deleteImage(id) {
     var storageRef = firebase.storage().ref();
     var desertRef = storageRef.child(id);

      // Delete the file
     await desertRef.delete().then(function() {
        this.created()
      }).catch(function(error) {
        // Uh-oh, an error occurred!
      });

   }
    
  },
  mounted(){
    console.log(`cok ${process.env.DB_HOST}`)
  }

  
};
</script>

<style>
.image-div {
  display: flex;
  margin: 25px;
}
.image {
  max-width: 250px;
  margin: 15px;
}
</style>
