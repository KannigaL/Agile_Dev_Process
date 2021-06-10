<template>
  <div class="text-center section">
    <vc-calendar
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="attributes"
      v-on:update:to-page="changeCalendarPage($event)"
      disable-page-swipe
      is-expanded
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="flex flex-col h-full z-10 overflow-hidden">
          <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
          <div class="flex-grow overflow-y-auto overflow-x-auto">
            <p
              v-for="attr in attributes"
              :key="attr.key"
              class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1 routerlink"
              :class="attr.customData.class"
              @click="itemClicked(attr.key)"
            >
              {{attr.customData.title}}
            </p>
          </div>
        </div>
      </template>
    </vc-calendar>
  </div>
</template>

<script>

export default {
  name: 'calendar-view',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      masks: {
        weekdays: 'WWW'
      },
      attributes: []
    }
  },
  watch: {
    items(newItems) {
      this.createAttributes(newItems)
    }
  },
  methods: {
    changeCalendarPage(event) {
      this.$emit('calendarPageChanged', event)
    },
    createAttributes(items) {
      this.attributes = []
      for (var i = 0; i < items.length; i++) {
        this.createAttribute(items[i])
      }
    },
    createAttribute(item) {
      var newAttribute = {
        key: item.key,
        customData: {
          title: item.title,
          class: 'bg-' + (item.isEmergency ? 'emergency' : 'normal')
        },
        dates: new Date(item.date)
      }
      this.attributes.push(newAttribute)
    },
    itemClicked(key) {
      this.$router.push({
        name: 'daily-view',
        params: {
          date: this.findDateToKey(key)
        }
      })
    },
    findDateToKey(key) {
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i]
        if (item.key === key) {
          return item.date
        }
      }
    }
  }
}
</script>

<style>
::-webkit-scrollbar {
  width: 0px;
}
::-webkit-scrollbar-track {
  display: none;
}
  .custom-calendar.vc-container {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-width: 90px;
  --day-height: 120px; /* original value: 90px */
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;
  border-radius: 0;
  width: 100%;
}
 .custom-calendar.vc-container .vc-header {
    background-color: #f1f5f8;
    padding: 10px 0;
  }
 .custom-calendar.vc-container .vc-weeks {
    padding: 0;
  }
 .custom-calendar.vc-container .vc-weekday {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 5px 0;
  }
 .custom-calendar.vc-container .vc-day {
    padding: 0 5px 3px 5px;
    text-align: left;
    height: var(--day-height);
    min-width: var(--day-width);
    background-color: white;
  }
 .custom-calendar.vc-container .vc-day.weekday-1,
     .custom-calendar.vc-container .vc-day.weekday-7 {
      background-color: #eff8ff;
    }
 .custom-calendar.vc-container .vc-day:not(.on-bottom) {
      border-bottom: var(--day-border);
    }
 .custom-calendar.vc-container .vc-day:not(.on-bottom).weekday-1 {
        border-bottom: var(--day-border-highlight);
      }
 .custom-calendar.vc-container .vc-day:not(.on-right) {
      border-right: var(--day-border);
    }
 .custom-calendar.vc-container .vc-day-dots {
    margin-bottom: 5px;
  }

.bg-normal {
  background-color: var(--primary-light);
  color: white;
}
.bg-emergency {
  background-color: var(--secondary);
  color: black;
}
.routerlink {
  color: black;
}
.routerlink:hover {
    cursor: pointer;
}

</style>
