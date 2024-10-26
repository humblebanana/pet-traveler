// pages/profile/profile.js
const glm4Service = require('../../utils/glm4Service.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始数据
    userInfo: {
      avatarUrl: '/assets/user-avatar.png', // 更新头像路径
      nickName: '从前慢。'
    },
    statusBarHeight: 0, // 新增状态栏高度数据
    longitude: 116.397390,
    latitude: 39.908860,
    scale: 12,
    markers: [],
    polyline: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });

    // 初始化地图
    this.initMap();
  },

  initMap() {
    // 这里可以调用高德地图API来获取更详细的地图数据
    // 为了演示，我们使用一些模拟数据
    this.setData({
      markers: [{
        id: 1,
        latitude: 39.908860,
        longitude: 116.397390,
        title: 'Day 1'
      }, {
        id: 2,
        latitude: 39.918860,
        longitude: 116.407390,
        title: 'Day 3'
      }],
      polyline: [{
        points: [{
          longitude: 116.397390,
          latitude: 39.908860
        }, {
          longitude: 116.407390,
          latitude: 39.918860
        }],
        color: "#FF0000DD",
        width: 2,
        dottedLine: true
      }]
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1 // 设置为"我的"页面的索引
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  navigateToDetailProfile() {
    // 导航到详细的个人资料页面
    wx.navigateTo({
      url: '/pages/profileDetail/profileDetail'
    });
  },

  selectDate(e) {
    const selectedDate = e.currentTarget.dataset.date;
    console.log('Selected date:', selectedDate);
    // 这里可以添加选择日期后的逻辑，比如更新UI或加载特定日期的数据
  },

  updateMapForDate(date) {
    // 这里应该调用高德地图API来获取特定日期的路线数据
    // 为了演示，我们使用一个模拟的API调用
    glm4Service.getRouteForDate(date)
      .then(routeData => {
        // 更新地图数据
        this.setData({
          markers: routeData.markers,
          polyline: routeData.polyline
        });
      })
      .catch(error => {
        console.error('获取路线数据失败:', error);
      });
  },

  viewFullMap() {
    // 导航到全屏地图页面
    wx.navigateTo({
      url: '/pages/fullMap/fullMap'
    });
  }
})
