<template>
    <section id="crawl_frequency" class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <h2 class="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">Crawl Frequency & Stored Data</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          We crawl each indexed instance once every 24 hours to keep our data fresh without creating excessive load.
        </p>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          FediDB collects and stores the following data points:
        </p>
        <p class="text-slate-600 dark:text-slate-400 font-bold mb-1">From the NodeInfo endpoint:</p>
        <ul class="list-disc list-inside text-slate-600 dark:text-slate-400 mb-6 ml-2">
          <li class="mb-2"><span class="font-mono text-sm">software.name</span> - The software powering the instance</li>
          <li class="mb-2"><span class="font-mono text-sm">software.version</span> - The version of the software</li>
          <li class="mb-2"><span class="font-mono text-sm">usage.localPosts</span> - Number of posts on the instance</li>
          <li class="mb-2"><span class="font-mono text-sm">usage.users.total</span> - Total number of users</li>
          <li class="mb-2"><span class="font-mono text-sm">usage.users.activeMonth</span> - Monthly active users</li>
        </ul>
        <p class="text-slate-600 dark:text-slate-400 font-bold mb-1">From ActivityPub actor objects (only for popular accounts):</p>
        <ul class="list-disc list-inside text-slate-600 dark:text-slate-400 mb-6 ml-2">
          <li class="mb-2">Total number of posts</li>
          <li class="mb-2">Followers and following count</li>
          <li class="mb-2">Display name</li>
          <li class="mb-2">Account creation date (created_at)</li>
          <li class="mb-2">Bio</li>
          <li class="mb-2">Avatar</li>
          <li class="mb-2">Profile URL</li>
        </ul>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          We do <strong>not</strong> crawl or store posts, private content, or any user-specific information beyond what's publicly accessible via the NodeInfo endpoint and public ActivityPub actor objects.
        </p>
      </section>
</template>
