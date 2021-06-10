<template>
<div>
  <header style="margin-top: 20px; display: inline-flex;" >
      <img style="margin-right: 20px; transform: rotate(-90deg);" @click="changeDatePreviousWeek()" src="./../assets/expand_less.svg">
      <h1>{{formatCurrentWeekMonday()}} - {{formatCurrentWeekSunday()}}</h1>
      <img style="margin-left: 20px; transform: rotate(90deg);" @click="changeDateNextWeek()" src="./../assets/expand_less.svg">
      </header>
  <div class="timeTable">
    <div>
      <input class="filter" type="text" placeholder="Filter personnel" v-model="filter"/>
      <div class="tableRow" v-for="(person, index) in filterTable" :key="`personnelId-${index}`">
      <div class="columnStaffName">
        {{person.fullName}}
      </div>
      <div class="totalHoursPerStaff">
        {{person.totalHours}}
      </div>
    </div>
      </div>
  </div>
  </div>
</template>

<script>
import { Api } from "@/Api";

export default {
  name: "shifts",
  props: {

  },
  data() {
    return {
      listOfShifts: [],
      personnel: [],
      personnelWithShifts: [{personnelId: '', fullName: '', shifts: [{_id: '', startDate: '', endDate: '', isEmergency: ''}]}],
      personnelHours: [],
      hours: "",
      next: "",
      previous: "",
      currentDate: new Date(),
      filter: '',
      // arrays for the possible new component (see the fetchWeeklyShifts() function)
      /*
      weeklyShifts: [{day: '', departmentsAndShifts: [{departmentId: '', department: '', shifts: [{_id: '', assignedId: '', assigned: '', startDate: '', endDate: '', isEmergency: ''}]}]}],
      daysInWeek: [{date: ''}],
      departmentsInWeek: [{departmentId: '', department: ''}],
      */
    };
  },
  computed: {
    filterTable() {
      return this.personnelHours.filter(person =>{
        const fullName = person.fullName.toLowerCase();
        const searchTerm = this.filter.toLowerCase();

        return fullName.includes(searchTerm);
      });
    }
  },
  mounted() {
    this.fetchPersonnel(this.currentDate);
  },
  methods: {
    fetchPersonnel(date){
      // cleanup for switching in between weeks
      this.listOfShifts = [];
      this.personnel = [];
      this.personnelWithShifts = [{personnelId: '', fullName: '', shifts: [{_id: '', startDate: '', endDate: '', isEmergency: ''}]}];
      this.personnelHours = [];

      var route = "/shifts/week/";
      route = route.concat(date);
      Api.get(route)
        .then((response) => {
          this.listOfShifts = response.data;
          // find all the personnel in the week
          for (var i = 0; i < this.listOfShifts.length; i++) { 
            if (this.personnel.filter(p => p._id === this.listOfShifts[i].assigned._id).length === 0) {
              this.personnel.push({
                _id: this.listOfShifts[i].assigned._id,
                firstName: this.listOfShifts[i].assigned.firstName,
                lastName: this.listOfShifts[i].assigned.lastName
                });
            }  
          }
          // create the new array structure
          for (var i = 0; i < this.personnel.length; i++) {
            this.personnelWithShifts.push({
              personnelId: this.personnel[i]._id, 
              firstName: this.personnel[i].firstName, 
              lastName: this.personnel[i].lastName, 
              shifts: []
              })
            for (var j = 0; j < this.listOfShifts.length; j++) {
              if (this.listOfShifts[j].assigned._id == this.personnel[i]._id) {
                this.personnelWithShifts[i+1].shifts.push({
                    _id: this.listOfShifts[j]._id,
                    startDate: this.listOfShifts[j].startDate,
                    endDate: this.listOfShifts[j].endDate,
                    isEmergency: this.listOfShifts[j].isEmergency
                }); 
              }
            }
          }
          // remove the first empty element (there is one because of initialization)
          this.personnelWithShifts.shift();
          // calculate total hours per person and push the information into the personnelHours array
          for(var i= 0; i < this.personnelWithShifts.length; i++){
            this.hours = 0;
            for(var j = 0; j < this.personnelWithShifts[i].shifts.length; j++){
              var end = new Date(this.personnelWithShifts[i].shifts[j].endDate).getHours();
              var start = new Date(this.personnelWithShifts[i].shifts[j].startDate).getHours();
              this.hours = this.hours + (end - start);
            }
            if(this.hours == 1){
              this.personnelHours.push({personnelId: this.personnelWithShifts[i].personnelId, fullName: this.personnelWithShifts[i].firstName + " " + this.personnelWithShifts[i].lastName, totalHours: this.hours + " hr"});
            }else{
              this.personnelHours.push({personnelId: this.personnelWithShifts[i].personnelId, fullName: this.personnelWithShifts[i].firstName + " " + this.personnelWithShifts[i].lastName, totalHours: this.hours + " hrs"});
            }        
          }
          // create a compare function for later use in the sort() - descending order
          function compare(a, b) {
          if (a.totalHours < b.totalHours){
              return 1;
          }
          if (a.totalHours > b.totalHours){
              return -1;
          }
            return 0;
          }
          this.personnelHours.sort(compare);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    formatCurrentWeekMonday(){
      function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
      }
      var currentMonday = getMonday(this.currentDate);
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return currentMonday.toLocaleDateString('en-US', options)
    },
    formatCurrentWeekSunday(){
      function getSunday(d) {
        d = new Date(d);
        var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6 : 7);
        return new Date(d.setDate(diff));
      }
      var currentSunday = getSunday(this.currentDate);
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return currentSunday.toLocaleDateString('en-US', options)
    },
  changeDateNextWeek(){
    this.currentDate = new Date(this.currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.fetchPersonnel(this.currentDate);
  },
  changeDatePreviousWeek(){
    this.currentDate = new Date(this.currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.fetchPersonnel(this.currentDate);
  },
    // fetchWeeklyShifts() function
    // ----
    // Idea: Get all the shifts for the specific week and display them in the weekly view
    // Problem: It is a bit redundant when we already have a daily view
    // Solution: Create 2 new components:
    // One for the personnel hours (which are currently handled straight in this view)
    // One for displaying the shifts for the given person (after a click on a given person, the component will show their shifts for the given week.) 
    // ---
    /*
    fetchWeeklyShifts() {
      var route = "/shifts/week/";
      route = route.concat(new Date());
      Api.get(route)
        .then((response) => {
          this.listOfShifts = response.data;

          for(var i = 0; i < this.listOfShifts.length; i++){
            this.listOfShifts[i].startDate = this.listOfShifts[i].startDate.slice(0,10);
          }

          // put all the dates from the fetched shifts into an array
          for (var i = 0; i < this.listOfShifts.length; i++) { 
            if (this.daysInWeek.filter(d => d.date === this.listOfShifts[i].startDate).length === 0) {
              this.daysInWeek.push({date: this.listOfShifts[i].startDate});
            }  
          }
          this.daysInWeek.shift();

          // find all departments in a week
          for (var i = 0; i < this.listOfShifts.length; i++) { 
            if (this.departmentsInWeek.filter(d => d.departmentId === this.listOfShifts[i].department._id).length === 0) {
              this.departmentsInWeek.push({departmentId: this.listOfShifts[i].department._id, department: this.listOfShifts[i].department.name});
            }  
          }
          this.departmentsInWeek.shift();

         this.weeklyShifts.shift();
          // fill in the weeklyShifts array
          for(var i = 0; i < this.daysInWeek.length; i++){
            this.weeklyShifts.push({
              day: this.daysInWeek[i].date, 
              departmentsAndShifts: []
              })
            for(var j = 0; j < this.departmentsInWeek.length; j++){
              this.weeklyShifts[i].departmentsAndShifts.push({
                departmentId: this.departmentsInWeek[j].departmentId, 
                deparment: this.departmentsInWeek[j].department, 
                shifts: []
                })
              for(var k = 0; k < this.listOfShifts.length; k++){
                if(this.listOfShifts[k].startDate.slice(0,10) == this.daysInWeek[i].date && this.listOfShifts[k].department._id == this.departmentsInWeek[j].departmentId){
                  this.weeklyShifts[i].departmentsAndShifts[j].shifts.push({
                    _id: this.listOfShifts[k]._id, 
                    assignedId: this.listOfShifts[k].assigned._id, 
                    assigned: this.listOfShifts[k].assigned.firstName + " " + this.listOfShifts[k].assigned.lastName, 
                    startDate: this.listOfShifts[k].startDate, 
                    endDate: this.listOfShifts[k].endDate, 
                    isEmergency: this.listOfShifts[k].isEmergency}
                  )}
                }
              }
            }
            console.log(this.weeklyShifts);
        })
        .catch((error) => {
          console.log(error);
        });
    },*/
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.timeTable{
    width: 35%;
    min-width: 500px;
    margin: 20px auto;
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
    width: 90%;
    text-align: left;
  }
.totalHoursPerStaff {
    background-color: var(--primary-light);
    margin: 5px;
    align-items: center;
    border-radius: 10px;
    border: 2px solid var(--secondary);
    width: 65px;
  }
  img{
    position: static;
  }
  .filter{
  font-size:18px;
  padding:10px 10px 10px 5px;
  display:block;
  width: 98%;
  border:2px solid var(--secondary-dark);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin-left: auto;
  margin-right: auto;
}
</style>
