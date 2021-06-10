/* eslint-disable */
<template>
  <div class="timeTable">
    <div class="tableRow rowHeader" v-on:click="toggleDepartment" :style="getBackgroundImage()">
      <div>
        <h2>{{departmentAndShifts.department}}</h2>
      </div>
      <div class="headerStats">
        <div class="shiftsStaff">
          <h2>{{departmentAndShifts.shifts.length}}</h2>
        </div>
        <div class="totalHoursPerDepartment">
          <h2>{{totalHoursPerDepartment(departmentAndShifts)}}</h2>
        </div>
      </div>
    </div>
    <div class="tableRow" v-show="opened" v-for="shift in departmentAndShifts.shifts" :key="shift.id">
      <div class="columnStaffName">
        {{shift.assigned}}
      </div>
      <div class="totalHoursPerStaff" :class="{totalHoursPerStaffSick:shift.isSick}">
        {{totalHoursPerStaff(shift.startDate, shift.endDate)}}
      </div>
      <div class="columnTimeBar" :style="setShiftStyle(shift.startDate, shift.endDate, shift.isEmergency)" v-on:click="showShift(departmentAndShifts, shift)">
        <div style="float: left; text-align: left; width: 50%; padding-left: 5px">
          {{new Date(shift.startDate).getHours()}}{{displayMinutes(shift.startDate, shift.endDate)}}
        </div>
        <div style="float: left; text-align: right; width: 50%; padding-right: 5px">
          {{new Date(shift.endDate).getHours()}}{{displayMinutes(shift.startDate, shift.endDate)}}
        </div>
      </div>
      <div class="columnSick" :style="{visibility: shift.isSick ? 'visible' : 'hidden'}">
       <img src="./../assets/sick.png">
      </div>
    </div>
    
    <dialogue-window v-show="isShiftVisible">    
      <shift-manager
        :createVisible="false"
        :closeVisible="true"
        :updateVisible="true"
        :deleteVisible="true"
        :existingData="latestShift"
        @close="closeShift"
        @updatedShift="handleUpdatedShift($event)"
        @deletedShift="handleDeletedShift($event)"
      ></shift-manager>
    </dialogue-window> 
  </div>
</template>

<script>
import DialogueWindow from '../components/DialogueWindow.vue';
import ShiftManager from './ShiftManager.vue';
export default {
  components: {
    DialogueWindow,
    ShiftManager
  },
  name: 'department-time-table',
  props: ['departmentAndShifts'],
  data() {
    return {
      opened: this.departmentAndShifts.departmentOpened,
      isShiftVisible: false,
      latestShift: null,
    }
  },
  methods: {
    showShift(departmentAndShifts, shift) {
      this.latestShift = {
        department : departmentAndShifts.departmentId,
        assigned : shift.assignedId,
        date : new Date(shift.startDate),
        startTime : new Date(shift.startDate).getHours(),
        endTime :new Date(shift.endDate).getHours(),  
        isEmergency : shift.isEmergency,
        isSick : shift.isSick,
        _id :shift._id 
      }
      this.isShiftVisible = true;
    },
    handleUpdatedShift(event){
      this.$emit('updatedShift') // Forward the event to DailyView
    },
    handleDeletedShift(event){
      this.$emit('deletedShift') // Forward the event to DailyView 
    },
    closeShift() {
      this.isShiftVisible = false;
    },
    toggleDepartment() {
      this.opened = !this.opened
      if (this.opened) {
        this.$emit('departmentOpened', this.departmentAndShifts.departmentId)
      } else {
        this.$emit('departmentClosed', this.departmentAndShifts.departmentId)
      }
    },
    getBackgroundImage() {
      if (this.opened) {
        return {
          'background-image': 'url(' + require('./../assets/expand_less.svg') + ')'
        }
      } else {
        return {
          'background-image': 'url(' + require('./../assets/expand_more.svg') + ')'
        }
      }
    },
    setShiftStyle(start, end, isEmergency) {
      return {
        '--itemWidth': (new Date(end).getHours() - new Date(start).getHours()) * 90 / 14 + '%',
        '--startMargin': (new Date (start).getHours() - 8) * 90 / 14 + '%',
        '--border': (isEmergency ? '5px solid red' : '0px solid red')
      }
    },
    displayMinutes(start, end) {
      return new Date(end).getHours() - new Date(start).getHours() < 2 ? '' : ':00'
    },
    totalHoursPerStaff(start, end){
      var totalHours = new Date(end).getHours() - new Date(start).getHours();
      if (totalHours == 1){
        return totalHours + " hr";
      } else{
        return totalHours + " hrs";
      }
    },
    totalHoursPerDepartment(departmentAndShifts){
      var totalHours = 0;
      for(var i = 0; i < departmentAndShifts.shifts.length; i++){
        var shift = departmentAndShifts.shifts[i]
        if (!shift.isSick) {
          totalHours += new Date(shift.endDate).getHours() - new Date(shift.startDate).getHours();
        }
      }
      return totalHours;
    }
  }
}
</script>

<style scoped>
  
  .timeTable{
    width: 60%;
    min-width: 1000px;
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

  .rowHeader {
    color: var(--secondary-dark);
    background-color: var(--primary-light);
    background-image: url('./../assets/expand_more.svg');
    background-position: 99% 50%;
    background-size: 40px 40px;
    background-repeat: no-repeat;
    cursor: pointer;
  }

  .headerStats {
    width: 180px;
    margin-left: auto;
    margin-right: 50px;
    text-align: right;
    position: relative;
    display: flex;
  }

  .shiftsStaff {
    width:80px;
    background-image: url('./../assets/person_outlined.svg');
    background-color: var(--primary-light);
    background-position: 0%;
    background-size: 35px 35px;
    background-repeat: no-repeat;
    text-align: left;
    position: relative;
    padding-left: 40px;
  }

  .rowHeader h2{
    margin: 0 0;
  }

  .columnStaffName {
    float: left;
    width: 7.5%;
    text-align: left;
  }

  .columnTimeBar {
    width: var(--itemWidth);
    margin-left: var(--startMargin);
    background-color: var(--secondary);
    border-radius: 10px;
    border: var(--border);
  }

  .columnTimeBar:hover {
    background-color: var(--secondary-light);
    cursor: pointer;
  }

  .totalHoursPerStaff {
    background-color: var(--primary-light);
    margin: 5px;
    align-items: center;
    border-radius: 10px;
    border: 2px solid var(--secondary);
    width: 65px;
  }

  .totalHoursPerStaffSick {
    background-color: #ffcc4d;
  }

  .totalHoursPerDepartment {
    width: 100px;
    background-image: url('./../assets/clock.svg');
    background-color: var(--primary-light);
    background-position: 0%;
    background-size: 30px 30px;
    background-repeat: no-repeat;
    text-align: right;
    position: relative;
    padding-right: 20px;
  }

  .columnSick{
    float:right;
    position:right;
    margin-right:-1cm;
  }

  img {
  position:relative;
  height:30px;
  width:30px;
}

</style>
