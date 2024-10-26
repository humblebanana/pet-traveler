Page({
  data: {
    leftPosts: [],
    rightPosts: [],
    page: 1,
    isLoading: false
  },

  onLoad: function() {
    this.loadPosts();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2 // 设置为"社区"页面的索引
      })
    }
  },

  loadPosts: function() {
    if (this.data.isLoading) return;
    this.setData({ isLoading: true });

    // 模拟从服务器获取数据
    setTimeout(() => {
      const newPosts = this.getNewPosts();
      const { leftPosts, rightPosts } = this.data;

      newPosts.forEach((post, index) => {
        if (index % 2 === 0) {
          leftPosts.push(post);
        } else {
          rightPosts.push(post);
        }
      });

      this.setData({
        leftPosts,
        rightPosts,
        page: this.data.page + 1,
        isLoading: false
      });
    }, 1000);
  },

  loadMorePosts: function() {
    this.loadPosts();
  },

  getNewPosts: function() {
    const posts = [
      {
        id: this.data.leftPosts.length + this.data.rightPosts.length + 1,
        image: '/assets/pet-travel-1.jpg',
        title: '带柴犬游东京',
        description: '和我的柴犬一起漫步在樱花盛开的上野公园，太治愈了！',
        userAvatar: '/assets/user-avatar-1.png',
        userName: '柴犬控',
        likes: 3280
      },
      {
        id: this.data.leftPosts.length + this.data.rightPosts.length + 2,
        image: '/assets/pet-travel-2.jpg',
        title: '猫咪的巴黎之旅',
        description: '带着我的布偶猫游览巴黎，铁塔下的她比夜景还迷人！',
        userAvatar: '/assets/user-avatar-2.png',
        userName: '猫奴摄影师',
        likes: 2567
      },
      {
        id: this.data.leftPosts.length + this.data.rightPosts.length + 3,
        image: '/assets/pet-travel-3.jpg',
        title: '威尼斯水城遛狗记',
        description: '和金毛一起乘坐贡多拉，穿梭在水城的小巷中，太浪漫了！',
        userAvatar: '/assets/user-avatar-3.png',
        userName: '金毛爸爸',
        likes: 1890
      },
      {
        id: this.data.leftPosts.length + this.data.rightPosts.length + 4,
        image: '/assets/pet-travel-4.jpg',
        title: '纽约中央公园遛猫',
        description: '带着我的缅因猫在中央公园散步，引来了不少目光呢！',
        userAvatar: '/assets/user-avatar-4.png',
        userName: '城市猫咪探险家',
        likes: 2103
      },
      {
        id: this.data.leftPosts.length + this.data.rightPosts.length + 5,
        image: '/assets/pet-travel-5.jpg',
        title: '哈士奇的马尔代夫之旅',
        description: '带着哈士奇来到马尔代夫，在沙滩上撒欢的样子太可爱了！',
        userAvatar: '/assets/user-avatar-5.png',
        userName: '哈士奇麻麻',
        likes: 3456
      }
    ];
    return posts;
  }
})
