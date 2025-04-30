<template>
    <section id="opt_out" class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <h2 class="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">Opting Out of Indexing</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
            If you wish to prevent your instance from being crawled by FediDB, you can add the following line to your robots.txt file:
        </p>

        <div class="bg-slate-100 dark:bg-slate-700 rounded-md p-4 my-4 font-mono text-sm overflow-x-auto text-slate-800 dark:text-slate-200">
            Disallow: /.well-known/nodeinfo
        </div>

        <p class="text-slate-600 dark:text-slate-400 mb-4">
            Adding this rule will:
        </p>
        <ul class="list-disc list-inside text-slate-600 dark:text-slate-400 mb-6 ml-2">
            <li class="mb-2">Prevent future crawls of your instance</li>
            <li class="mb-2">Remove your instance from our listings</li>
        </ul>
    </section>
</template>
