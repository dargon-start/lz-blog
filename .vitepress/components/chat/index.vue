<template>
  <div class="chat-wrapper">
    <!-- 左侧会话列表 -->
    <div class="chat-sidebar">
      <div class="sidebar-header">
        <button class="new-chat-btn" @click="createNewSession">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          <span>新对话</span>
        </button>
      </div>
      <div class="sidebar-content">
        <Conversations
          v-model:active="activeSessionId"
          :items="sessionList"
          @change="handleSessionChange"
          groupable
        />
      </div>
    </div>

    <!-- 右侧对话主区域 -->
    <div class="chat-main">
      <div class="chat-header">
        <div class="header-info">
          <span class="header-title">{{ currentSession?.label || 'AI 智能助手' }}</span>
        </div>
        <div class="header-actions">
          <button class="action-btn" @click="deleteCurrentSession" title="删除当前对话">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="chat-body" ref="bodyRef">
        <!-- 欢迎界面 (消息为空时显示) -->
        <template v-if="messages.length === 0">
          <div class="welcome-container">
            <Welcome
              title="你好，我是 lz-blog AI"
              description="基于博客内容，为您提供专业的技术解答和设计指导。"
              variant="borderless"
            >
              <template #icon>
                <div class="welcome-ai-icon">
                  <img src="/logo.png" alt="AI" />
                </div>
              </template>
            </Welcome>

            <div class="prompts-grid">
              <Prompts
                title="🔥 热门话题"
                :items="hotPrompts"
                vertical
                @itemClick="handlePromptClick"
              />
              <Prompts
                title="📖 探索博客"
                :items="blogPrompts"
                vertical
                @itemClick="handlePromptClick"
              />
            </div>
          </div>
        </template>

        <!-- 消息流 -->
        <BubbleList v-else :data="messages" :key="activeSessionId + messages.length" class="custom-bubble-list">
          <template #avatar="{ item }">
            <div :class="['avatar', item.role]">
              <template v-if="item.role === 'assistant'">
                <img src="/logo.png" alt="AI" />
              </template>
              <template v-else>
                <div class="user-icon">U</div>
              </template>
            </div>
          </template>

          <template #content="{ item }">
            <div :class="['bubble-content', item.role]">
              <div v-if="(item as any).role === 'assistant'" class="markdown-body">
                <XMarkdown :markdown="(item as any).content" />
                <div v-if="(item as any).sources && (item as any).sources.length > 0" class="sources">
                  <div class="source-tags">
                    <a v-for="source in (item as any).sources" 
                       :key="source" 
                       :href="source" 
                       target="_blank" 
                       class="source-tag">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="margin-right: 4px;">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                      </svg>
                      {{ source.split('/').pop()?.replace('.md', '') || '文章' }}
                    </a>
                  </div>
                </div>
              </div>
              <div v-else class="user-text">
                {{ (item as any).content }}
              </div>
            </div>
          </template>
        </BubbleList>
      </div>

      <div class="chat-footer">
        <div class="footer-actions">
           <button class="footer-tool-btn">
             <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4s-4 1.79-4 4v12.5c0 3.31 2.69 6 6 6s6-2.69 6-6V6h-1.5z"/></svg>
             <span>上传</span>
           </button>
           <button class="footer-tool-btn">
             <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
             <span>图片</span>
           </button>
        </div>
        <Sender
          v-model="inputMessage"
          :loading="loading"
          placeholder="提问或输入 / 使用技能"
          @submit="handleSend"
          class="custom-sender"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { BubbleList, Sender, XMarkdown, Conversations, Welcome, Prompts } from 'vue-element-plus-x';
import dayjs from 'dayjs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

interface ChatSession {
  id: string;
  label: string;
  group: string;
  messages: Message[];
  timestamp: number;
}

const STORAGE_KEY = 'lz_blog_chat_sessions';
const activeSessionId = ref<string>('');
const sessionList = ref<ChatSession[]>([]);
const inputMessage = ref('');
const loading = ref(false);
const bodyRef = ref<HTMLElement | null>(null);

// 热门话题 Prompt
const hotPrompts = [
  { key: '1', label: 'Vue3 响应式原理深度解析' },
  { key: '2', label: '如何优化博客的 SEO 排名？' },
  { key: '3', label: '前端持久化存储方案对比' },
];

const blogPrompts = [
  { key: '4', label: '介绍一下这个博客的技术栈' },
  { key: '5', label: '最新的文章有哪些？' },
  { key: '6', label: '如何通过 GitHub Actions 自动部署？' },
];

const currentSession = computed(() => 
  sessionList.value.find(s => s.id === activeSessionId.value)
);

const messages = computed(() => 
  currentSession.value?.messages || []
);

// 初始化加载
const loadSessions = () => {
  if (typeof localStorage === 'undefined') return;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      sessionList.value = JSON.parse(saved);
      if (sessionList.value.length > 0) {
        activeSessionId.value = sessionList.value[0].id;
      } else {
        createNewSession();
      }
    } catch (e) {
      console.error(e);
      createNewSession();
    }
  } else {
    createNewSession();
  }
};

const saveSessions = () => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionList.value));
};

const createNewSession = () => {
  const id = Date.now().toString();
  const session: ChatSession = {
    id,
    label: '新的对话',
    group: dayjs().isSame(dayjs(), 'day') ? '今天' : '更早',
    messages: [],
    timestamp: Date.now()
  };
  sessionList.value.unshift(session);
  activeSessionId.value = id;
  saveSessions();
};

const deleteCurrentSession = () => {
  const index = sessionList.value.findIndex(s => s.id === activeSessionId.value);
  if (index > -1) {
    sessionList.value.splice(index, 1);
    if (sessionList.value.length > 0) {
      activeSessionId.value = sessionList.value[0].id;
    } else {
      createNewSession();
    }
    saveSessions();
  }
};

const handleSessionChange = (item: any) => {
  activeSessionId.value = item.id;
};

const handlePromptClick = (item: any) => {
  inputMessage.value = item.label;
  handleSend();
};

const scrollToBottom = async () => {
  await nextTick();
  if (bodyRef.value) {
    bodyRef.value.scrollTop = bodyRef.value.scrollHeight;
  }
};

const handleSend = async () => {
  if (!inputMessage.value.trim() || loading.value) return;

  const userQuery = inputMessage.value;
  if (!currentSession.value) createNewSession();
  
  // 更新标题
  if (currentSession.value && currentSession.value.messages.length === 0) {
    currentSession.value.label = userQuery.slice(0, 15) + (userQuery.length > 15 ? '...' : '');
  }

  currentSession.value!.messages.push({ role: 'user', content: userQuery });
  inputMessage.value = '';
  loading.value = true;
  
  await scrollToBottom();
  saveSessions();

  const assistantMsg: Message = { role: 'assistant', content: '' };
  currentSession.value!.messages.push(assistantMsg);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userQuery }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) throw new Error('流不可用');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'token') {
              assistantMsg.content += data.token;
              await scrollToBottom();
            } else if (data.type === 'sources') {
              assistantMsg.sources = data.sources;
            }
          } catch (e) {}
        }
      }
    }
    saveSessions();
  } catch (error: any) {
    assistantMsg.content = `发生错误：${error.message}`;
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
};

onMounted(() => {
  loadSessions();
});
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  height: calc(100vh - 120px);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  margin: 0 -24px; /* 抵消文字外边距 */
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}

/* 侧边栏 */
.chat-sidebar {
  width: 260px;
  background: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
}

.new-chat-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px dashed var(--vp-c-brand-3);
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.new-chat-btn:hover {
  background: var(--vp-c-brand-2);
  color: white;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

/* 主区域 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
  position: relative;
}

.chat-header {
  height: 56px;
  padding: 0 24px;
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.action-btn {
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-danger-1);
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 0;
}

/* 欢迎界面 */
.welcome-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 40px;
}

.welcome-ai-icon {
  width: 64px;
  height: 64px;
  background: var(--vp-c-brand-soft);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.welcome-ai-icon img {
  width: 40px;
  height: 40px;
}

.prompts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 40px;
}

/* 消息样式 */
.custom-bubble-list {
  padding: 0 24px;
  gap: 32px !important;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar.assistant { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); }
.avatar.user { background: var(--vp-c-brand); color: white; }

.avatar img { width: 100%; height: 100%; object-fit: cover; }

.bubble-content { max-width: 85%; }

.user-text {
  background: var(--vp-c-bg-soft);
  padding: 12px 18px;
  border-radius: 18px 18px 2px 18px;
  color: var(--vp-c-text-1);
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
}

.assistant .markdown-body {
  line-height: 1.8;
  color: var(--vp-c-text-1);
}

.source-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.source-tag {
  display: flex;
  align-items: center;
  background: var(--vp-c-bg-soft);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none !important;
  transition: all 0.2s;
}

.source-tag:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

/* 页脚输入框 */
.chat-footer {
  padding: 20px 40px 30px;
  background: var(--vp-c-bg);
}

.footer-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.footer-tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.footer-tool-btn:hover {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-soft);
}

.custom-sender {
  background: var(--vp-c-bg-soft) !important;
  border: 1.5px solid var(--vp-c-divider) !important;
  border-radius: 12px !important;
  padding: 4px !important;
}

.custom-sender:focus-within {
  border-color: var(--vp-c-brand-1) !important;
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft) !important;
}

@media (max-width: 768px) {
  .chat-sidebar { display: none; }
  .chat-wrapper { margin: 0; border-radius: 0; height: calc(100vh - 80px); }
  .prompts-grid { grid-template-columns: 1fr; }
  .welcome-container { padding: 0 20px; }
}
</style>
