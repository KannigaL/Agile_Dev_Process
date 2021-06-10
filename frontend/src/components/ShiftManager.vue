<template>
  <div class="inputForm" >
    <form>
      <div class="group">
        <select class="select" type="text" v-model="inpDep">
          <option v-for="department in departments" :key="department._id" :value="department._id">{{department.name}}</option>
        </select>
        <span class="bar"></span>
        <label class="labelStyle">Department</label>
        <div v-if="missingDept" class="error">{{missingDept}}</div>
      </div>

      <div class="group">
        <select class="select" type="text" v-model="inpAssigned">
          <option v-for="person in personnel" :key="person._id" :value="person._id">{{person.firstName}} {{person.lastName}}</option>
        </select>
        <span class="bar"></span>
        <label class="labelStyle">Staff name</label>
        <div v-if="missingName" class="error">{{missingName}}</div>
      </div>

      <div class="group">
        <vc-date-picker id="datePicker" v-model="date" date color="pink" is-required/>
      </div>

      <div class="group">
        <input type="number" min="8" max="21" v-model="inpFrom">
        <span class="bar"></span>
        <label class="labelStyle">From</label>
        <div v-if="missingFrom" class="error">{{missingFrom}}</div>
      </div>

      <div class="group">
        <input type="number" min="9" max="22" v-model="inpTo">
        <span class="bar"></span>
        <label class="labelStyle">To</label>
        <div v-if="missingTo" class="error">{{missingTo}}</div>
      </div>

      <div class="group">
        <b-form-checkbox v-model="isEmergency" class="checkboxMark">Emergency Shift</b-form-checkbox>
        <b-form-checkbox v-model="isSick" class="checkboxMark" :style="{visibility: createVisible ? 'hidden' : 'visible'}">Mark Sick</b-form-checkbox>
      </div>

      <div class="buttonsGroup">
        <button v-if="deleteVisible" @click="deleteShift" class="button-danger" type="button">Delete</button>
        <button v-if="updateVisible" @click="updateShift" class="button-filled" type="button">Update</button>
        <button v-if="createVisible" @click="createShift" class="button-filled" type="button">Create</button>
        <button v-if="closeVisible"  @click="close"       class="button-close"  type="button">Close</button>
      </div>

    </form>
  </div>
</template>

<script>

import axios from 'axios'
import { Api } from "@/Api"
import Vue from 'vue';

export default {
  name: 'shift-manager',
  props: {
    closeVisible: false,
    createVisible: false,
    updateVisible: false,
    deleteVisible: false,
    existingData: null,
  },
  watch: {
    existingData(newData){
      this.inpDep = newData.department,
      this.inpAssigned = newData.assigned,
      this.date = newData.date,
      this.inpFrom = newData.startTime,
      this.inpTo = newData.endTime,
      this.isEmergency = newData.isEmergency,
      this.isSick = newData.isSick
    }
  },
  data() {
    return {
      // Real data fields:
      date: this.existingData ? this.existingData.date : new Date(),
      inpDep: '',
      inpAssigned: '',
      inpFrom: '',
      inpTo: '',
      isEmergency: false,
      isSick:false,
      // Data fields for validation messages:
      missingDept:'',
      missingName:'',
      missingFrom:'',
      missingTo:'',
      personnel: [],
      departments: []

    }
  },
  mounted(){
    this.fetchPersonnel();
    this.fetchDepartments();
  },
  methods: {
    createShift() {
      var config = this.validateShiftAndGetRequestStructure()

      if (config) {
        axios.post("http://localhost:3000/api/shifts/", config)
          .then(response => {
            this.$emit('newShift', response.data)
            Vue.$toast.open({
              message: 'Added shift successfully!',
              type: 'success',
              position: 'top',
              duration: 3000
            })

            //remove fields on success
            this.inpDep = "",
            this.inpAssigned = "",
            this.inpFrom = "",
            this.inpTo = ""
          })
          .catch(error => {
            var error_msg = "Shift could not be added!"

            if (error.response.status == 418) {
              error_msg = error.response.data.message
            }

            Vue.$toast.open({
              message: error_msg,
              type: 'error',
              position: 'top',
              duration: 5000
            })
          })
      }
    },
    deleteShift(){
      if(confirm("Do you really want to delete this shift?")){
        axios.delete("http://localhost:3000/api/shifts/" + this.existingData._id.toString())
        .then(this.$emit('deletedShift', this.existingData._id))
        .then(
              Vue.$toast.open({
                  message: 'Deleted shift successfully!',
                  type: 'success',
                  position: 'top',
                  duration: 3000
              })
            )
        .catch(error => {
              console.log(error)
              Vue.$toast.open({
                message: 'Shift could not be deleted!',
                type: 'error',
                position: 'top',
                duration: 5000
              })
        })
      }
    },
    updateShift(){
      var config = this.validateShiftAndGetRequestStructure()
      if (config) {
        config._id = this.existingData._id
        axios.put("http://localhost:3000/api/shifts/", config)
          .then(response => {
            this.$emit('updatedShift', response.data)
            Vue.$toast.open({
              message: 'Updated shift successfully!',
              type: 'success',
              position: 'top',
              duration: 3000
            })
          })
          .catch(error => {
            var error_msg = "Shift could not be updated!"

            if (error.response.status == 418) {
              error_msg = error.response.data.message
            }
            Vue.$toast.open({
              message: error_msg,
              type: 'error',
              position: 'top',
              duration: 5000
            })
          })
      }
    },
    validateShiftAndGetRequestStructure() {
      this.missingDept = this.inpDep != "" ? "" : "Please select a department.";
      this.missingName = this.inpAssigned != "" ? "" : "Please selected an assigned staff.";
      this.missingFrom = this.inpFrom != "" ? "" : "Please enter the start time.";
      this.missingTo = this.inpTo != "" ? "" : "Please enter the end time.";

      // 1. Check whether the time fields are filled to be able to do the validation.
      // If the error messages for these fields are empty (evaluated to false), the process can be continued.
      if (!this.missingFrom && !this.missingTo) {
        var startDate = new Date(this.date.getTime());
        var endDate = new Date(this.date.getTime());
        var inpToAsInt = parseInt(this.inpTo);
        var inpFromAsInt = parseInt(this.inpFrom);
        startDate.setHours(inpFromAsInt, 0, 0, 0);
        endDate.setHours(inpToAsInt, 0, 0, 0);
        
        if (this.inpFrom.toString().includes(".")) {
          this.missingFrom = "Only full hours are valid."
        } else if (!(Number.isInteger(inpFromAsInt) && inpFromAsInt >= 8 && inpFromAsInt <= 21)) {
          this.missingFrom = "Only 8 - 21 is valid.";
        }

        if (this.inpTo.toString().includes(".")) {
          this.missingTo = "Only full hours are valid."
        } else if (inpToAsInt < inpFromAsInt) {
          this.missingTo = "Shift end has to be after shift begin ( > " + inpFromAsInt + ")."
        } else if (!(Number.isInteger(inpToAsInt) && inpToAsInt >= 9 && inpToAsInt <= 22)) {
          if (inpFromAsInt === 21) {
            this.missingTo = "Only 22 is valid.";
          } else {
            this.missingTo = "Only " + (inpFromAsInt + 1) + " - 22 is valid.";
          }
        }

        // 2. Check whether all fields are filled correctly.
        // If all error messages are still empty (evaluated to false), the process can be continued.
        if (!this.missingDept && !this.missingName && !this.missingFrom && !this.missingTo) {
          var config = {
            startDate: startDate,
            endDate: endDate,
            department: this.inpDep,
            assigned: this.inpAssigned,
            isEmergency: this.isEmergency,
            isSick: this.isSick
          }
          // This config is only returned, if the validation was successful and creation/update of the shift is allowed.
          return config;
        }
      }
      // If the validation has a failure, null is returned.
      return null;
    },
    close() {
      this.$emit('close');
    },
    fetchPersonnel(){
      Api.get('/personnel')
      .then(response => {
        this.personnel = response.data;
        this.personnel.sort(function (a, b) {
            //Comparing both fname and lname in sorting e.g. Anna Andersson will come before Anna Eskilsson
            var nameA = a.firstName.toUpperCase() + a.lastName.toUpperCase();
            var nameB = b.firstName.toUpperCase() + b.lastName.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
        });
      })
      .catch(error =>{
        console.log(error);
      })
    },
    fetchDepartments(){
      Api.get('/department')
      .then(response =>{
        this.departments = response.data;
        this.departments.sort(function (a, b) {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
        });
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>

.inputForm {
  padding: 20px;
}

.group {
  position:relative;
  margin-bottom:45px;
  margin-left: auto;
}

.buttonsGroup {
  position:relative;
  text-align:center;
  margin-top:10px;
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

.button-danger {
  margin: 10px;
  padding: 14px 28px;
  color: var(--on-secondary);
  background-color: red;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
}

.button-close {
  margin: 10px;
  padding: 14px 28px;
  color: black;
  background-color: #b3b3b3;
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

input {
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

input:focus {
  outline:none;
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

input:focus ~ label, input:valid ~ label {
  top:-20px;
  font-size:14px;
  color:var(--secondary-dark);
}

.error {
  color:#a50000;
  font-size: 0.8em;
  font-style: italic;
  position: absolute;
  left:50%;
  margin-left:-150px;
  width:300px;
  text-align:left;
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

input:focus ~ .bar:before, input:focus ~ .bar:after {
  width:50%;
}

.checkboxMark {
  color:var(--secondary-dark);
  left:50%;
  margin-left:-70px;
  width:300px;
  text-align:left;
}

</style>
