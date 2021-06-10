<template>
  <div>
    <div class="wrap">
      <calendar-view 
        class="calendar" 
        :items="calendarItems" 
        @calendarPageChanged="changeCalendarPage($event)"
      ></calendar-view>
      <shift-manager
        class="inputComponent"
        :createVisible="true"
        :closeVisible="false"
        :updateVisible="false"
        :deleteVisible="false"
        @newShift="handleNewShift($event)"
      ></shift-manager>
    </div>
  </div>
</template>

<script>
import CalendarView from '@/components/CalendarView'
import ShiftManager from '@/components/ShiftManager'
import axios from 'axios';

export default {
  name: 'home',
  components: {
    CalendarView,
    ShiftManager
  },
  data() {
    return {
      calendarItems: [],
      displayedMonth: new Date().getMonth(),
      displayedYear: new Date().getYear()
    }
  },
  methods: {
    changeCalendarPage(event) {
      this.displayedMonth = event.month
      this.displayedYear = event.year
      this.loadData()
    },
    handleNewShift() {
      this.loadData()
    },
    loadData() {
      this.calendarItems = []
      var dateToLoad = this.displayedYear + "-" + this.displayedMonth + "-01"
      axios.get('http://localhost:3000/api/shifts/stats/' + dateToLoad)
        .then(response => {
          var stats = response.data
          for (var i = 0; i < stats.length; i++) {
            var statsOfSingleDay = stats[i]
            this.addCalendarItemsOfDay(statsOfSingleDay)
          }
        })
        .catch(error => {
          alert("Error while loading shift data: " + error)
        })
    },
    addCalendarItemsOfDay(stats) {
      if (stats.assignedNormal > 0) {
        this.addCalendarItem(stats._id, stats.assignedNormal, stats.hoursNormal, false)
      }
      if (stats.assignedEmergency > 0) {
        this.addCalendarItem(stats._id, stats.assignedEmergency, stats.hoursEmergency, true)
      }
    },
    addCalendarItem(date, assigned, hours, isEmergency) {
      if (assigned > 0) {
        var shiftsText = assigned === 1 ? " shift, " : " shifts, "
        var hoursText = hours === 1 ? " hour" : " hours"
        this.calendarItems.push({
          key: date + (isEmergency ? 'E' : 'N'),
          title: assigned + shiftsText + hours + hoursText,
          isEmergency: isEmergency,
          date: date
        })
      }
    }
  }
}
</script>

<style>

.wrap{
  padding: 1%;
  text-align: center;
}

.calendar{
  width: 92.5%; /*72.5%*/
  float: left;
  padding-left: 7.5%;
}

.inputComponent{
  float: left;
}

@media (min-width: 763px){
  .calendar{
    width:95%;
    -moz-transform: scale(0.6,0.6); 
    -ms-transform: scale(0.6,0.6);
    -webkit-transform: scale(0.6,0.6);
    -o-transform: scale(0.6,0.6);
    transform: scale(0.6,0.6);
    -moz-transform-origin: left top;  
    -ms-transform-origin: left top;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    margin-right: -340px;
  }
  .inputComponent{
    -moz-transform: scale(0.55,0.55); 
    -ms-transform: scale(0.55,0.55); 
    -webkit-transform: scale(0.55,0.55); 
    -o-transform: scale(0.55,0.55); 
    transform: scale(0.55,0.55); 
    -moz-transform-origin: left top;  
    -ms-transform-origin: left top;
    -webkit-transform-origin: left top;
    transform-origin: left top;
  }
}
@media (min-width: 1000px) {
  .calendar{
    width:80%;
    -moz-transform: scale(0.8,0.8); 
    -ms-transform: scale(0.8,0.8);
    -webkit-transform: scale(0.8,0.8);
    -o-transform: scale(0.8,0.8);
    transform: scale(0.8,0.8);
    -moz-transform-origin: left top;  
    -ms-transform-origin: left top;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    margin-right: -185px;
  }
  .inputComponent{
    -moz-transform: scale(0.75,0.75);
    -ms-transform: scale(0.75,0.75);
    -webkit-transform: scale(0.75,0.75);
    -o-transform: scale(0.75,0.75);
    transform: scale(0.75,0.75);
    -moz-transform-origin: left top;  
    -ms-transform-origin: left top;
    -webkit-transform-origin: left top;
    transform-origin: left top;
  }
}
@media (min-width: 1366px) {
  .calendar{
    width:90%;
    -moz-transform: scale(0.8,0.8);
    -ms-transform: scale(0.8,0.8);
    -webkit-transform: scale(0.8,0.8);
    -o-transform: scale(0.8,0.8);
    transform: scale(0.8,0.8);
    -moz-transform-origin: left top;  
    -ms-transform-origin: left top;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    margin-right: -250px;
  }
  .inputComponent{
    -moz-transform: scale(0.75,0.75);
    -ms-transform: scale(0.75,0.75);
    -webkit-transform: scale(0.75,0.75);
    -o-transform: scale(0.75,0.75);
    transform: scale(0.75,0.75);
    -moz-transform-origin: left top;  
    -ms-transform-origin: left top;
    -webkit-transform-origin: left top;
    transform-origin: left top;
  }
}
@media (min-width: 1600px) {
  .calendar{
    width:75%;
    -moz-transform: scale(1.0,1.0);
    -ms-transform: scale(1.0,1.0);
    -webkit-transform: scale(1.0,1.0);
    -o-transform: scale(1.0,1.0);
    transform: scale(1.0,1.0);
    -moz-transform-origin: left top;  
    -ms-transform-origin: left top;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    margin-right: -0px;
  }
  .inputComponent{
    /* before adding emergency field: 1.0125 */
    -moz-transform: scale(0.95,0.95);
    -ms-transform: scale(0.95,0.95);
    -webkit-transform: scale(0.95,0.95);
    -o-transform: scale(0.95,0.95);
    transform: scale(0.95,0.95);
    -moz-transform-origin: left top;  
    -ms-transform-origin: left top;
    -webkit-transform-origin: left top;
    transform-origin: left top;
  }
}
@media (min-width:1920px){
  .calendar{
    width:75%;
    -moz-transform: scale(1.0,1.0);
    -ms-transform: scale(1.0,1.0);
    -webkit-transform: scale(1.0,1.0);
    -o-transform: scale(1.0,1.0);
    transform: scale(1.0,1.0);
    -moz-transform-origin: left top;  
    -ms-transform-origin: left top;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    margin-right: -0px;
  }
  .inputComponent{
    -moz-transform: scale(0.925,0.925);
    -ms-transform: scale(0.925,0.925);
    -webkit-transform: scale(0.925,0.925);
    -o-transform: scale(0.925,0.925);
    transform: scale(0.925,0.925);
    -moz-transform-origin: left top;  
    -ms-transform-origin: left top;
    -webkit-transform-origin: left top;
    transform-origin: left top;
  }
}
</style>
