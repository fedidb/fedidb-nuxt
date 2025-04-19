<template>
  <div>
    <ClientOnly>
      <NuxtLoadingIndicator color="#2b7fff" :height="3" :throttle="0" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </ClientOnly>
  </div>
</template>
