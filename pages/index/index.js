// index.js
Page({
  data: {
    inputValue: '',
    chatHistory: [],
    scrollToView: '',
    assistantOptions: ['商务出行管家小慢', 'city walk管家小快', '旅行管家小中'],
    activeAssistant: 0
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

    // 模拟AI回复
    wx.showLoading({
      title: 'AI思考中...',
    });

    setTimeout(() => {
      const aiResponse = this.generateAIResponse(userMessage);
      this.addMessageToChat('ai', aiResponse);
      wx.hideLoading();
    }, 1500);
  },

  addMessageToChat(sender, content) {
    const newChatHistory = [...this.data.chatHistory, { sender, content }];
    const scrollToView = `msg-${newChatHistory.length - 1}`;
    
    this.setData({
      chatHistory: newChatHistory,
      scrollToView: scrollToView
    });

    // 确保滚动到最新消息
    setTimeout(() => {
      this.setData({
        scrollToView: scrollToView
      });
    }, 100);
  },

  generateAIResponse(userMessage) {
    const responses = [
      "这是一个很好的旅行问题!让我为您提供一些建议...",
      "关于这个旅行目的地,我有以下信息可以分享...",
      "您提到的这个旅行话题很有趣,我的建议是...",
      "根据您的旅行需求,我推荐以下几个地方...",
      "作为您的AI旅行助手,我建议您考虑以下几点..."
    ];
    return responses[Math.floor(Math.random() * responses.length)] + " 关于'" + userMessage + "'的更多旅行信息,我们可以继续探讨。";
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
      activeAssistant: index
    });
  },

  onQuickAction(e) {
    const action = e.currentTarget.dataset.action;
    console.log(`Quick action: ${action}`);
    // 这里可以添加快捷操作的具体逻辑
  }
});
