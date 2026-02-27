---
layout: page
title: AI 助手
---

<script setup>
import Chat from './.vitepress/components/chat/index.vue'
</script>

<div class="ai-chat-page">
  <Chat />
</div>

<style>
/* 隐藏默认页面的侧边栏和内边距，让聊天框占据更多空间 */
.VPDoc.has-sidebar .content-container {
  max-width: 100% !important;
  padding: 0 !important;
}
.VPDoc .container {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}
.VPDoc .aside {
  display: none !important;
}
.ai-chat-page {
  padding: 20px;
}
@media (max-width: 768px) {
  .ai-chat-page {
    padding: 0;
  }
}
</style>
