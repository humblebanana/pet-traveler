Component({
  properties: {
    planData: {
      type: Array,
      value: []
    }
  },
  data: {
    activeTimeIndex: 0
  },
  methods: {
    onTimeChange(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({ activeTimeIndex: index });
    },
    onSwiperChange(e) {
      const { current } = e.detail;
      const { index } = e.currentTarget.dataset;
      const newPlanData = this.data.planData.map((item, idx) => {
        if (idx === index) {
          return { ...item, activeOptionIndex: current };
        }
        return item;
      });
      this.setData({ planData: newPlanData });
    }
  }
});
