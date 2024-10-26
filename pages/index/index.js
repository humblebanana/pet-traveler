// index.js
Page({
  data: {
    inputValue: '',
    chatHistory: [],
    scrollToView: '',
    assistantOptions: ['管家小慢', '管家小快', '管家小中'],
    activeAssistant: 0,
    initialMessages: [
      "你好呀，朋友，我是你的专属出行管家小慢",
      "你好呀，朋友，我是你的city walk管家小快",
      "你好呀，朋友，我是你的旅行管家小中"
    ]
  },

  onLoad() {
    // 初始化界面后显示第一条AI消息
    this.addMessageToChat('ai', this.data.initialMessages[0]);
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  startVoiceInput() {
    console.log('Starting voice input');
    // 实现语音输入的逻辑
  },

  sendMessage() {
    if (!this.data.inputValue.trim()) return;

    const userMessage = this.data.inputValue;
    this.addMessageToChat('user', userMessage);
    this.setData({ inputValue: '' });

    // 显示AI正在输入的提示
    this.setData({
      chatHistory: [...this.data.chatHistory, { sender: 'ai', content: '正在输入...', isTyping: true }]
    });

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = this.generateAIResponse(userMessage);
      // 移除"正在输入"的消息
      let updatedHistory = this.data.chatHistory.filter(msg => !msg.isTyping);
      updatedHistory.push({ sender: 'ai', content: aiResponse });
      
      this.setData({
        chatHistory: updatedHistory,
        scrollToView: `msg-${updatedHistory.length - 1}`
      });
    }, 1500);
  },

  addMessageToChat(sender, content) {
    const newChatHistory = [...this.data.chatHistory, { sender, content }];
    const scrollToView = `msg-${newChatHistory.length - 1}`;
    
    this.setData({
      chatHistory: newChatHistory,
      scrollToView: scrollToView
    });
  },

  generateAIResponse(userMessage) {
    const responses = [
      "这是一个很好的旅行问题！让我为您提供一些建议...",
      "关于这个旅行目的地，我有以下信息可以分享...",
      "您提到的这个旅行话题很有趣，我的建议是...",
      "根据您的旅行需求，我推荐以下几个地方...",
      "作为您的AI旅行助手，我建议您考虑以下几点..."
    ];
    return responses[Math.floor(Math.random() * responses.length)] + " 关于'" + userMessage + "'的更多旅行信息，我们可以继续探讨。";
  },

  createImage() {
    wx.showToast({
      title: '正在为您创建图片...',
      icon: 'loading',
      duration: 2000
    });
  },

  createCalendar() {
    wx.showToast({
      title: '正在创建内容日历...',
      icon: 'loading',
      duration: 2000
    });
  },

  setActiveAssistant(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeAssistant: index,
      chatHistory: [] // 清空聊天历史
    });
    // 添加新选择的助手的初始消息
    this.addMessageToChat('ai', this.data.initialMessages[index]);
  },

  onQuickAction(e) {
    const action = e.currentTarget.dataset.action;
    console.log(`Quick action: ${action}`);
    this.addMessageToChat('user', action);
    
    // 模拟AI回复
    setTimeout(() => {
      let aiResponse;
      switch(action) {
        case '一日出行规划':
          aiResponse = "好的，我来帮您规划一日出行。您想去哪里玩呢？";
          break;
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
  }
});
