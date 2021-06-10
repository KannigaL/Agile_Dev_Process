<template>
  <div>
    <div>
      <header class="timeTable">
      <h1>{{formatSelectedDate()}}</h1>
      <img @click="openNewShiftDialog()" src="./../assets/add.svg">
      </header>
    </div>
    <div>
      <department-time-table
        v-for="departmentAndShifts in allDepartmentsWithShifts"
        :departmentAndShifts="departmentAndShifts"
        :key="departmentAndShifts.departmentId"
        @updatedShift="handleShiftUpdatedOrDeleted"
        @deletedShift="handleShiftUpdatedOrDeleted"
        @departmentOpened="handleDepartmentOpened($event)"
        @departmentClosed="handleDepartmentClosed($event)"
      />
    </div>
    <dialogue-window v-show="isAddShiftVisible">
      <shift-manager
        :createVisible="true"
        :closeVisible="true"
        :updateVisible="false"
        :deleteVisible="false"
        :existingData="existingData"
        @close="closeNewShiftDialog"
        @newShift="handleShiftCreated"
      ></shift-manager>
    </dialogue-window>
  </div>
</template>

<script>
import { Api } from "@/Api";
import DepartmentTimeTable from '../components/DepartmentTimeTable.vue';
import DialogueWindow from '../components/DialogueWindow.vue';
import ShiftManager from '../components/ShiftManager.vue';
export default {
  name: "daily-view",
  components: {
    DepartmentTimeTable,
    DialogueWindow,
    ShiftManager
  },
  data() {
    return {
      isAddShiftVisible: false,
      selectedDate: new Date(this.$route.params.date),
      departments: [{departmentId: '', departmentName: ''}],
      listOfShifts: [],
      allDepartmentsWithShifts: [{departmentId: '', department: '', departmentOpened: false, shifts: [{ _id: '', assignedId: '', assigned: '', startDate: '', endDate: '', isEmergency: '', isSick:''}]}],
      existingData: {date : new Date(this.$route.params.date)},
      idsOpenedDepartments: []
    };
  },
  mounted() {
    this.getDepartmentsAndShifts();
  },
  methods: {
    formatSelectedDate() {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return this.selectedDate.toLocaleDateString('en-US', options)
    },
    openNewShiftDialog(){
      this.isAddShiftVisible = true;
    },
    closeNewShiftDialog(){
      this.isAddShiftVisible = false;
    },
    handleShiftUpdatedOrDeleted() {
      this.handleShiftsChanged();
    },
    handleShiftCreated() {
      this.handleShiftsChanged();
      this.closeNewShiftDialog();
    },
    handleShiftsChanged() {
      // Reinitialization and then reloading of all departments and shifts.
      this.departments = [{departmentId: '', departmentName: ''}],
      this.listOfShifts= [],
      this.allDepartmentsWithShifts = [{departmentId: '', department: '', departmentOpened: false, shifts: [{ _id: '', assignedId: '', assigned: '', startDate: '', endDate: '', isEmergency: '', isSick:''}]}],
      this.getDepartmentsAndShifts();
    },
    handleDepartmentOpened(event) {
      this.idsOpenedDepartments.push(event)
    },
    handleDepartmentClosed(event) {
      this.idsOpenedDepartments = this.idsOpenedDepartments.filter(value => value !== event)
    },
    getDepartmentsAndShifts() {
      var route = "/shifts/date/";
      route = route.concat(this.$route.params.date);
      Api.get(route)
        .then((response) => {
          this.listOfShifts = response.data;
          // Push all the departments (id and name) from listOfShifts into the departments array
          for (var i = 0; i < this.listOfShifts.length; i++) {
            if (this.departments.filter(department => department.departmentId === this.listOfShifts[i].department._id).length === 0) {
              this.departments.push({departmentId: this.listOfShifts[i].department._id, departmentName: this.listOfShifts[i].department.name});
            }
          }
          // Remove the first empty element (the empty element was added for initialisation purposes)
          this.departments.shift();
          // Display the departments name in Alphabetical order
          function compare(a, b) {
          if (a.departmentName < b.departmentName){
              return -1;
          }
          if (a.departmentName > b.departmentName){
              return 1;
          }
            return 0;
          }
          this.departments.sort(compare);
        
          // Find all the shifts for the specific department and push them into the array
          for (var i = 0; i < this.departments.length; i++) {
            this.allDepartmentsWithShifts.push({
              departmentId: this.departments[i].departmentId, 
              department: this.departments[i].departmentName,
              departmentOpened: this.idsOpenedDepartments.includes(this.departments[i].departmentId),
              shifts: []
            })
            for (var j = 0; j < this.listOfShifts.length; j++) {
              if (this.listOfShifts[j].department.name == this.departments[i].departmentName) {
                this.allDepartmentsWithShifts[i+1].shifts.push({
                    _id: this.listOfShifts[j]._id,
                    assignedId: this.listOfShifts[j].assigned._id,
                    assigned: this.listOfShifts[j].assigned.firstName,
                    startDate: this.listOfShifts[j].startDate,
                    endDate: this.listOfShifts[j].endDate,
                    isEmergency: this.listOfShifts[j].isEmergency,
                    isSick: this.listOfShifts[j].isSick
                });
              }
            }
          }
          // remove the first empty element (the empty element was added for initialisation purposes)
          this.allDepartmentsWithShifts.shift();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>

header {
  position: relative;
  height: 40px;
}
header h1 {
  color: var(--secondary-dark);
  font-size: 32px;
  font-weight: 300;

}
header img {
  position: absolute;
  height: 40px;
  top: calc(-50% + 19px);
  left: calc(99% - 40px - 4.5px);
  cursor: pointer;
}
.timeTable{
  width: 60%;
  min-width: 1000px;
  margin: 20px auto;
}

</style>
