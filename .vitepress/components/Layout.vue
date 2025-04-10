<template>
  <Layout>
    <template #doc-after>
      <div style="margin-top: 24px">
        <Giscus
          :key="page.filePath"
          repo="dargon-start/lz-blog"
          repo-id="R_kgDOHJsINA"
          category="Announcements"
          category-id="DIC_kwDOHJsINM4Co4Rq"
          mapping="url"
          strict="0"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="top"
          :theme="isDark ? 'dark_tritanopia' : 'light_tritanopia'"
          lang="zh-CN"
        />
      </div>
    </template>

    <template #not-found>
      <NotFound />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import Giscus from "@giscus/vue";
import DefaultTheme from "vitepress/theme";
import NotFound from "./NotFound.vue";
import { watch } from "vue";
import { inBrowser, useData } from "vitepress";

const { isDark, page } = useData();

const { Layout } = DefaultTheme;

watch(isDark, (dark) => {
  if (!inBrowser) return;

  const iframe = document
    .querySelector("giscus-widget")
    ?.shadowRoot?.querySelector("iframe");

  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: dark ? "dark_tritanopia" : "light_tritanopia" } } },
    "https://giscus.app"
  );
});
</script>