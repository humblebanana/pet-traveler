// index.js
Page({
  data: {
    inputValue: '',
    chatHistory: [],
    scrollToView: '',
    assistantOptions: ['走遍中国的小狮子', '喜欢city walk的小浣熊', '飞行绕地球一圈的猫头鹰'],
    activeAssistant: 0,
    initialMessages: [
      "hello，我是您的宠物的好朋友小浣熊，我和我的主人有很多city walk的旅游路线可以推荐，请告诉我您的偏好吧～",
      "hello，我是您的宠物的好朋友小狮子，我和我的主人有很多国内的旅游路线可以推荐，请您告诉我的偏好吧～",
      "hello，我是您的宠物的好朋友猫头鹰，我和我的主人有很多国外的旅游路线可以推荐，请您告诉我的偏好吧～"
    ],
    isAIThinking: false,
    showTravelPlan: false,
    travelPlanData: null,
    isWaitingForTravelInfo: false,
    showQuickActions: true,
    InputBottom: 0,  // 添加输入框距离
  },

  onLoad() {
    this.addMessageToChat('ai', this.data.initialMessages[0]);
  },

  onUnload() {
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    });
    this.scrollToBottom();
  },

  InputBlur(e) {
    this.setData({
      InputBottom: 0
    });
  },

  sendMessage() {
    if (!this.data.inputValue.trim()) return;

    const userMessage = this.data.inputValue;
    this.addMessageToChat('user', userMessage);
    this.setData({ 
      inputValue: '',
      scrollToView: `msg-${this.data.chatHistory.length - 1}`  // 更新滚动位置
    });
    
    console.log("q:", userMessage);
    this.GLM4(userMessage);
  },

  GLM4(content) {
    const that = this;
    wx.request({
      url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'e9ac68ed0ee2d619e73c3c6f26842669.2g0XZMeavxkO6shd'
      },
      data: {
        model: "glm-4-0520",
        messages: [
          {"role": "user", "content": content}
        ],
        temperature: 0.7,
        top_p: 0.9
      },
      success(res) {
        console.log("API响应:", res.data);
        if (res.data && res.data.choices && res.data.choices.length > 0) {
          const robContent = res.data.choices[0].message.content;
          console.log("AI回复:", robContent);
          that.addMessageToChat('ai', robContent);
          
          // 更新滚动位置到最新消息
          that.setData({
            scrollToView: `msg-${that.data.chatHistory.length - 1}`
          });
        } else {
          console.error("API响应格式不正确:", res.data);
          that.addMessageToChat('ai', "抱歉，我遇到了一些问题，无法正确回答您的问题。");
        }
      },
      fail(err) {
        console.error("API调用失败", err);
        that.addMessageToChat('ai', "抱歉，我暂时无法连接到服务器。请稍后再试。");
      }
    });
  },


  addMessageToChat(sender, content, travelPlanData = null) {
    const newMessage = { 
      sender, 
      content,
      avatarIndex: this.data.activeAssistant
    };
    if (travelPlanData) {
      newMessage.showTravelPlan = true;
      newMessage.travelPlanData = travelPlanData;
    }
    const newChatHistory = [...this.data.chatHistory, newMessage];
    
    this.setData({
      chatHistory: newChatHistory,
      scrollToView: `msg-${newChatHistory.length - 1}`  // 更新滚动位置
    }, () => {
      // 确保消息添加后滚动到底部
      this.scrollToBottom();
    });
  },

  generateAIResponse(userMessage) {
    if (userMessage.includes('时间') && userMessage.includes('地点') && userMessage.includes('宠物')) {
      this.setData({ isAIThinking: true });
      
      // 模拟AI思考过程
      setTimeout(() => {
        const planData = this.generateTravelPlan();
        const aiResponse = "根据您提供的信息，我为您生成了以下一日出行规划：";
        
        this.addMessageToChat('ai', aiResponse, planData);
        this.setData({
          isAIThinking: false,
          showTravelPlan: true,
          travelPlanData: planData
        });
      }, 3000);

      return;
    }

    const responses = [
      "这是一个很好的旅行问题！让我为您提供一些建议...",
      "关于这个旅行目的地，我有以下信息可以分享...",
      "您提到的这个旅行话题很有趣，我的建议是...",
      "根据您的旅行需求，我推荐以下几个地方...",
      "作为您的AI旅行助手，我建议您考虑以下几点..."
    ];
    return responses[Math.floor(Math.random() * responses.length)] + " 关于'" + userMessage + "'的更多旅行信息，我们可以继续探讨。";
  },

  setActiveAssistant(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeAssistant: index,
      chatHistory: [] // 清空聊天历史
    });
    this.addMessageToChat('ai', this.data.initialMessages[index]);
  },

  onQuickAction(e) {
    const action = e.currentTarget.dataset.action;
    if (action === '一日出行规划') {
      this.handleTravelPlanRequest();
      this.setData({ showQuickActions: false });
      return;
    }
    this.addMessageToChat('user', action);
    
    setTimeout(() => {
      let aiResponse;
      switch(action) {
        case '旅行物品准备':
          aiResponse = "为您的旅行准备物品是个好主意。您计划去哪里旅行？我可以根据目的地和季节为您提供建议。";
          break;
        case '宠物酒店推荐':
          aiResponse = "我可以为您推荐宠物友好的酒店。您要去哪个城市，有什么特别的需求吗？";
          break;
        case '机票价格比较':
          aiResponse = "我可以帮您比较机票价格。请告诉我您的出发地、目的地和大致日期。";
          break;
        default:
          aiResponse = "抱歉，我没有理解您的请求。请告诉我更多关于您需要帮助的细节。";
      }
      this.addMessageToChat('ai', aiResponse);
    }, 1000);
  },

  handleOneDayTravelPlan() {
    const planData = this.generateTravelPlan();
    const aiResponse = "好的，我为您生成了一份一日出行规划���以下是详细安排：";
    
    this.addMessageToChat('ai', aiResponse, planData);
  },

  generateTravelPlan() {
    const timeSlots = ['09:00', '12:00', '15:00', '18:00', '21:00'];
    return timeSlots.map(time => ({
      time,
      options: [
        {
          location: this.getRandomLocation(),
          address: this.getRandomAddress(),
          image: `/assets/location-${Math.floor(Math.random() * 5) + 1}.jpg`,
          petFriendly: this.getRandomPetFriendlyReason(),
          price: `${Math.floor(Math.random() * 200) + 50}`,
        },
        {
          location: this.getRandomLocation(),
          address: this.getRandomAddress(),
          image: `/assets/location-${Math.floor(Math.random() * 5) + 1}.jpg`,
          petFriendly: this.getRandomPetFriendlyReason(),
          price: `${Math.floor(Math.random() * 200) + 50}`,
        }
      ],
      activeOptionIndex: 0
    }));
  },

  getRandomLocation() {
    const locations = ['宠物主题咖啡厅', '宠物友好公园', '宠物摄影工作室', '宠物SPA中心', '宠物主题餐厅'];
    return locations[Math.floor(Math.random() * locations.length)];
  },

  getRandomAddress() {
    return `XX市YY区ZZ街${Math.floor(Math.random() * 100) + 1}号`;
  },

  getRandomPetFriendlyReason() {
    const reasons = [
      '提供宠物���属座位和餐具',
      '有专门的宠物活动区域',
      '提供宠物美容和护理服务',
      '有专业的宠物摄影师',
      '提供宠物专属的休息区'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  },

  loadMoreHistory() {
    // 这里可以添加加载更多历史消息的逻辑
    console.log('Loading more history...');
  },

  handleTravelPlanRequest() {
    const aiResponse = "好的，我可以帮您制定一日出行规划。请告诉我时间、地点和您携带的宠物。";
    this.addMessageToChat('ai', aiResponse);
    this.setData({ isWaitingForTravelInfo: true });
  },

  handleTravelInfoResponse(userMessage) {
    this.setData({ isAIThinking: true, isWaitingForTravelInfo: false });
    
    setTimeout(() => {
      const planData = this.generateTravelPlan();
      const aiResponse = "根据您提供的信息，我为您生成了以下一日出行规划：";
      
      this.addMessageToChat('ai', aiResponse, planData);
      this.setData({
        isAIThinking: false,
        travelPlanData: planData
      });
    }, 3000);
  },

  scrollToBottom() {
    const query = wx.createSelectorQuery();
    query.select('.chat-area').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      if (res[0] && res[1]) {
        const scrollHeight = res[1].scrollHeight;
        const scrollTop = scrollHeight - res[0].height;
        wx.pageScrollTo({
          scrollTop: scrollTop,
          duration: 300
        });
      }
    });
  },
});
