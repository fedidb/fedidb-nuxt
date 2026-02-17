<template>
  <div>
    <a href="https://mastodon.social/@dansup" rel="me" style="display: none !important;">Made by dansup</a>
    <ClientOnly>
      <NuxtLoadingIndicator color="#2b7fff" :height="3" :throttle="0" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </ClientOnly>
  </div>
</template>
