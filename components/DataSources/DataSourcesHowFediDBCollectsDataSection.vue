<template>
    <section class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <h2 class="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">How FediDB Collects Data</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
            FediDB uses an automated crawler to discover and index federated instances across the network. Our crawler operates with the following user agent:
        </p>

        <div class="bg-slate-100 dark:bg-slate-700 rounded-md p-4 my-4 font-mono text-sm overflow-x-auto text-slate-800 dark:text-slate-200">
            FediDB/0.5.0; +https://fedidb.org/crawler.html
        </div>

        <p class="text-slate-600 dark:text-slate-400 mb-6">
            We respect the autonomy of instance administrators and strictly follow the standard robots.txt protocol.
        </p>
    </section>
</template>
