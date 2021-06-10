<template>
  <div>
    <div class="inputDiv">

      <vc-date-picker id="datePicker" v-model="range" is-range date color="pink" is-required/>
      <div class="nameDiv">
        <div class="nameInput">
          <select class="select" type="text" v-model="inpAssigned">
            <option v-for="person in personnel" :key="person._id" :value="person._id">{{person.firstName}} {{person.lastName}}</option>
          </select>
          <span class="bar"></span>
          <label class="labelStyle">Staff name</label>
        </div>

        <div class="submitButton">
          <button @click="markSick" class="button-filled" type="button">Mark sick</button>
        </div>
      </div>
    </div>

    <!--
    <b-list-group class="list">
      <h3 style="text-align: left;">Currently sick personnel: </h3>
      <b-list-group-item class="item" v-for="p in sick" :key="p._id">
        {{ p.firstName }} {{p.lastName}}
      </b-list-group-item>
    </b-list-group>
    -->
    <div class="inputDiv">
      <h3 style="text-align: left;">Currently sick personnel: </h3>
      <div class="tableRow" v-for="person in sick" :key="person._id">
        <div class="columnStaffName">
          {{person.firstName}} {{person.lastName}}
        </div>
        <div class="columnSickPeriod">
          {{formatDate(new Date())}} - {{formatDate(new Date(person.lastSickDay))}}
        </div>
        <div class="removeSick">
          <img src="./../assets/delete.svg" @click="removeSick(person)">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import axios from 'axios'
import Vue from 'vue';

export default {
  name: 'sick-view',
  components: {
    // Register child components like list items
  },
  data() {
    return {
      sick: [],
      personnel: [],
      inpAssigned: '',
      range: {
        start: null,
        end: null
    }
    }
  },
  mounted() {
    // Calling method for loading data
    this.getSick()
    this.fetchPersonnel()
  },
  methods: {
    // For example calling of backend functions
    getSick() {
      Api.get('/sick')
        .then(response => {
          this.sick = response.data
        })
        .catch(error => {
          this.sick = error
        })
    },
    fetchPersonnel(){
      Api.get('/personnel')
      .then(response => {
        this.personnel = response.data;
      })
      .catch(error =>{
        console.log(error);
      })
    },
    markSick() {
      var invalid = false

      if(!this.range.start || !this.range.end){
        invalid = true
        Vue.$toast.open({
          message: 'Please enter dates!',
          type: 'error',
          position: 'top',
          duration: 3000
        })
      }

      if(this.inpAssigned == ''){
        invalid = true
        Vue.$toast.open({
          message: 'Please select an employee!',
          type: 'error',
          position: 'top',
          duration: 3000
        })
      }

      if(invalid){
        return
      }

      var config = {
        startDate: this.range.start.setHours(0, 0, 0, 0),
        endDate: this.range.end.setHours(23, 0, 0, 0),
        id: this.inpAssigned,
        isSick : true
      }
            
      axios.post("http://localhost:3000/api/sick/", config)
        .then(response => this.getSick())
        .then(
          Vue.$toast.open({
              message: 'Marked sick successfully!',
              type: 'success',
              position: 'top',
              duration: 3000
          }),
          this.inpAssigned = ''
        )
        .catch(error => {
          console.log(error)
          Vue.$toast.open({
            message: 'Error',
            type: 'error',
            position: 'top',
            duration: 5000
          })
        })
    },
    formatDate(d){
      return d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2)
    },
    removeSick(p){
      if(confirm("Do you really want to mark this person as not sick?")){
        var config = {
          startDate: new Date().setHours(0, 0, 0, 0),
          endDate: new Date(p.lastSickDay).setHours(23, 0, 0, 0),
          id: p._id,
          isSick : false
        }
              
        axios.post("http://localhost:3000/api/sick/", config)
          .then(response => this.getSick())
          .catch(error => {
            console.log(error)
            Vue.$toast.open({
              message: 'Error',
              type: 'error',
              position: 'top',
              duration: 5000
            })
          })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inputDiv {
  width: 600px;
  height: 300px;
  margin: 20px auto;
}
#datePicker {
  float: left;
}
.nameDiv {
  margin: 50px auto;
  float: right;
}
.submitButton {
  margin-top: 50px;
}

.tableRow {
  display: flex;
  background-color: var(--primary);
  padding: 10px;
  margin: 5px;
  align-items: center;
  border-radius: 10px;
}

.columnStaffName {
  float: left;
  width: 40%;
  text-align: left;
}

.columnSickPeriod {
  float: left;
  width: 55%;
  text-align: left;
}

.removeSick{
  float:right;
  cursor: pointer;
}

.list {
  width: 600px;
  margin: 20px auto;
}

.item {
  text-align: left;
}

.button-filled {
  margin: 10px;
  padding: 14px 28px;
  color: var(--on-secondary);
  background-color: var(--secondary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
}

.select{
  font-size:18px;
  padding:10px 10px 10px 5px;
  display:block;
  width:300px;
  border:2px solid var(--secondary-dark);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin-left: auto;
  margin-right: auto;
}


.labelStyle {
  color: var(--secondary-dark);
  left:50%;
  margin-left:-150px;
  width:300px;
  text-align:left;
  font-weight:normal;
  position:absolute;
  pointer-events:none;
  transition:0.2s ease all;
  -moz-transition:0.2s ease all;
  -webkit-transition:0.2s ease all;
  top:-22px;
}

.bar {
  position:relative;
  display:block;
  width:300px;
  margin-left: auto;
  margin-right: auto;
}

.bar:before, .bar:after {
  content:'';
  height:3px;
  width:0;
  bottom:1px;
  position:absolute;
  background:var(--secondary-dark);
  transition:0.2s ease all;
  -moz-transition:0.2s ease all;
  -webkit-transition:0.2s ease all;
}

.bar:before {
  left:50%;
}

.bar:after {
  right:50%;
}

</style>
