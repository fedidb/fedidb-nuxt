<template>
    <div v-if="isLoading" class="flex h-screen flex-col items-center justify-center gap-4 bg-gray-100 dark:bg-gray-900">
        <Spinner />
        <span class="text-sm text-gray-600 dark:text-gray-400">Loading versions…</span>
    </div>

    <div v-else-if="!sw"
        class="flex h-screen flex-col items-center justify-center gap-3 bg-gray-100 px-4 text-center dark:bg-gray-900">
        <Icon name="feather:alert-triangle" class="text-3xl text-gray-400 dark:text-gray-500" />
        <p class="text-gray-700 dark:text-gray-300">Couldn't load version data for "{{ slug }}".</p>
        <NuxtLink to="/software" :class="['text-sm font-medium', ui.link, ui.focus]">Browse all software</NuxtLink>
    </div>

    <div v-else class="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <div class="container mx-auto max-w-7xl px-4 py-8">
            <Breadcrumb secondLevelTitle="Software" secondLevelPath="/software" :thirdLevelTitle="sw.name"
                :thirdLevelPath="`/software/${sw.slug}`" :thirdLevelCapitalize="true" fourthLevelTitle="Versions" />

            <header class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex min-w-0 items-center gap-4">
                    <img v-if="sw.logo_url" :src="sw.logo_url" :alt="`${sw.name} logo`"
                        class="h-12 w-12 shrink-0 rounded-xl bg-white object-contain p-1.5 ring-1 ring-gray-200 dark:ring-white/10" />
                    <div class="min-w-0">
                        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                            {{ sw.name }} versions
                        </h1>
                        <p class="mt-0.5 text-gray-600 dark:text-gray-400">
                            What the {{ num(totalInstances) }} known {{ sw.name }} servers are running
                        </p>
                    </div>
                </div>

                <a v-if="sw.source_repo" :href="sw.source_repo" target="_blank" rel="noopener" :class="[
                    'inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:self-auto dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/60',
                    ui.focus,
                ]">
                    <Icon name="feather:git-branch" class="h-4 w-4" />
                    Source code
                </a>
            </header>

            <section class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div :class="[ui.card, 'p-5']">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p :class="ui.label">Latest release</p>
                            <p :class="[ui.value, 'mt-1 truncate']">{{ latest?.tag ?? '-' }}</p>
                            <p v-if="latest?.published_at" :class="['mt-1 text-sm', ui.muted]"
                                :title="formatDate(latest.published_at)">
                                Released {{ timeAgo(latest.published_at) }}
                            </p>
                        </div>
                        <div :class="ui.chip">
                            <Icon name="feather:package" class="h-5 w-5" />
                        </div>
                    </div>
                    <div class="mt-4">
                        <div :class="['flex justify-between text-xs', ui.muted]">
                            <span>Adoption</span>
                            <span class="tabular-nums">{{ pct(latest?.share) }}%</span>
                        </div>
                        <div :class="['mt-1.5 h-1.5 w-full overflow-hidden rounded-full', ui.track]">
                            <div :class="['h-full rounded-full', FRESHNESS.latest.bar]"
                                :style="{ width: `${latest?.share ?? 0}%` }"></div>
                        </div>
                    </div>
                </div>

                <div :class="[ui.card, 'p-5']">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p :class="ui.label">Servers</p>
                            <p :class="[ui.value, 'mt-1']">{{ num(totalInstances) }}</p>
                            <p :class="['mt-1 text-sm', ui.muted]">seen by FediDB</p>
                        </div>
                        <div :class="ui.chip">
                            <Icon name="feather:server" class="h-5 w-5" />
                        </div>
                    </div>
                    <dl class="mt-4 space-y-1.5 text-xs">
                        <div class="flex justify-between gap-3">
                            <dt :class="ui.muted">Accounts</dt>
                            <dd class="tabular-nums text-gray-700 dark:text-gray-300">{{ num(sw.user_count) }}</dd>
                        </div>
                        <div class="flex justify-between gap-3">
                            <dt :class="ui.muted">Monthly actives</dt>
                            <dd class="tabular-nums text-gray-700 dark:text-gray-300">{{ num(sw.monthly_actives) }}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div :class="[ui.card, 'p-5']">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p :class="ui.label">Most common version</p>
                            <p :class="[ui.value, 'mt-1 truncate']">{{ mostCommon?.tag ?? '-' }}</p>
                            <p v-if="mostCommon?.release" :class="['mt-1 text-sm', ui.muted]"
                                :title="formatDate(mostCommon.release.published_at)">
                                Released {{ timeAgo(mostCommon.release.published_at) }}
                            </p>
                        </div>
                        <div :class="ui.chip">
                            <Icon name="feather:bar-chart-2" class="h-5 w-5" />
                        </div>
                    </div>
                    <div v-if="mostCommon" class="mt-4">
                        <div :class="['flex justify-between gap-3 text-xs', ui.muted]">
                            <span>{{ behindLabel(mostCommon) }}</span>
                            <span class="tabular-nums">{{ pct(mostCommon.share) }}%</span>
                        </div>
                        <div :class="['mt-1.5 h-1.5 w-full overflow-hidden rounded-full', ui.track]">
                            <div :class="['h-full rounded-full', FRESHNESS[mostCommon.freshness].bar]"
                                :style="{ width: `${mostCommon.share}%` }"></div>
                        </div>
                    </div>
                </div>

                <div :class="[ui.card, 'p-5']">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p :class="ui.label">Top host</p>
                            <p :class="[ui.value, 'mt-1 truncate']">{{ topAsns[0]?.asn_org ?? '-' }}</p>
                            <p v-if="topAsns.length" :class="['mt-1 text-sm', ui.muted]">
                                {{ pct(hostShare(topAsns[0])) }}% of servers
                            </p>
                        </div>
                        <div :class="ui.chip">
                            <Icon name="feather:cloud" class="h-5 w-5" />
                        </div>
                    </div>
                    <dl v-if="topAsns.length > 1" class="mt-4 space-y-1.5 text-xs">
                        <div v-for="asn in topAsns.slice(1, 3)" :key="asn.asn_org" class="flex justify-between gap-3">
                            <dt :class="['truncate', ui.muted]">{{ asn.asn_org }}</dt>
                            <dd class="tabular-nums text-gray-700 dark:text-gray-300">{{ pct(hostShare(asn)) }}%</dd>
                        </div>
                    </dl>
                </div>
            </section>

            <section :class="[ui.card, 'mb-8 p-5 sm:p-6']">
                <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">How current are servers?</h2>
                    <p :class="['text-sm', ui.muted]">
                        {{ familyMode ? 'Colored by release series' : 'Colored by releases behind the latest' }}
                    </p>
                </div>

                <div class="mt-4 flex h-9 w-full gap-0.5 overflow-hidden rounded-lg" role="img"
                    :aria-label="freshnessSummary">
                    <div v-for="segment in segments" :key="segment.key"
                        :class="['flex min-w-[3px] items-center justify-center overflow-hidden', FRESHNESS[segment.freshness].bar]"
                        :style="{ flex: `${segment.count} 1 0%` }"
                        :title="`${segment.label}: ${num(segment.count)} servers (${pct(segment.share)}%)`">
                        <span v-if="segment.share >= 7"
                            :class="['hidden truncate px-1.5 text-[11px] font-semibold tabular-nums sm:block', FRESHNESS[segment.freshness].onBar]">
                            {{ segment.label }}
                        </span>
                    </div>
                </div>

                <div
                    class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
                    <div v-for="bucket in visibleBuckets" :key="bucket.key" :class="[ui.well, 'p-3']">
                        <div class="flex items-center gap-2">
                            <span :class="['h-2.5 w-2.5 shrink-0 rounded-full', FRESHNESS[bucket.key].bar]"></span>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ bucket.label }}</span>
                        </div>
                        <p class="mt-2 text-xl font-semibold tabular-nums text-gray-900 dark:text-white">
                            {{ pct(bucket.share) }}%
                        </p>
                        <p :class="['mt-0.5 text-xs', ui.muted]">{{ num(bucket.count) }} servers</p>
                        <p :class="['text-xs', ui.muted]">{{ bucket.hint }}</p>
                    </div>
                </div>
            </section>

            <div class="mb-6 flex gap-6 border-b border-gray-200 dark:border-gray-700/60" role="tablist">
                <button v-for="tab in tabs" :key="tab.id" type="button" role="tab" :aria-selected="activeTab === tab.id"
                    @click="activeTab = tab.id" :class="[
                        '-mb-px flex cursor-pointer items-center gap-2 border-b-2 pb-3 pt-1 text-sm font-medium transition-colors motion-reduce:transition-none',
                        ui.focus,
                        activeTab === tab.id
                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
                    ]">
                    {{ tab.label }}
                    <span
                        class="rounded-full bg-gray-200 px-2 py-0.5 text-xs tabular-nums text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {{ tab.count }}
                    </span>
                </button>
            </div>

            <div v-if="activeTab === 'distribution'" class="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                <section :class="[ui.card, 'overflow-hidden lg:col-span-2']">
                    <div
                        class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700/60">
                        <h3 class="font-semibold text-gray-900 dark:text-white">Versions in use</h3>
                        <span :class="['text-sm', ui.muted]">Servers</span>
                    </div>

                    <ul class="divide-y divide-gray-100 dark:divide-gray-700/40">
                        <li v-for="version in visibleVersions" :key="version.version" class="px-5 py-4">
                            <div class="flex items-center justify-between gap-3">
                                <div class="flex min-w-0 flex-wrap items-center gap-2">
                                    <span
                                        :class="['h-2.5 w-2.5 shrink-0 rounded-full', FRESHNESS[version.freshness].bar]"></span>
                                    <span
                                        class="max-w-full truncate font-medium tabular-nums text-gray-900 dark:text-white">
                                        {{ version.tag }}
                                    </span>
                                    <span v-if="version.freshness === 'latest'"
                                        :class="[ui.pill, FRESHNESS.latest.pill]">Latest</span>
                                    <span v-if="version.isFork" :class="[ui.pill, FRESHNESS.unknown.pill]">Fork</span>
                                    <span v-if="version.isPrerelease"
                                        :class="[ui.pill, FRESHNESS.unknown.pill]">Pre-release</span>
                                </div>
                                <div class="flex shrink-0 items-baseline gap-2 tabular-nums">
                                    <span class="font-medium text-gray-900 dark:text-white">{{ num(version.count)
                                        }}</span>
                                    <span :class="['w-12 text-right text-sm', ui.muted]">{{ pct(version.share)
                                        }}%</span>
                                </div>
                            </div>

                            <div :class="['mt-2 h-2 w-full overflow-hidden rounded-full', ui.track]">
                                <div :class="['h-full min-w-[4px] rounded-full', FRESHNESS[version.freshness].bar]"
                                    :style="{ width: `${version.share}%` }"></div>
                            </div>

                            <div
                                :class="['mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs', ui.muted]">
                                <div class="flex flex-wrap gap-x-4 gap-y-1">
                                    <span>{{ behindLabel(version) }}</span>
                                    <span v-if="version.release">Released {{ formatDate(version.release.published_at)
                                        }}</span>
                                </div>
                                <button v-if="version.release" type="button" @click="openRelease(version.release)"
                                    :class="['cursor-pointer rounded font-medium', ui.link, ui.focus]">
                                    Read release notes
                                </button>
                            </div>
                        </li>

                        <li v-if="tailCount > 0" class="px-5 py-4">
                            <div class="flex items-center justify-between gap-3">
                                <div class="flex min-w-0 items-center gap-2">
                                    <span :class="['h-2.5 w-2.5 shrink-0 rounded-full', FRESHNESS.unknown.bar]"></span>
                                    <span class="font-medium text-gray-900 dark:text-white">Other versions</span>
                                </div>
                                <div class="flex shrink-0 items-baseline gap-2 tabular-nums">
                                    <span class="font-medium text-gray-900 dark:text-white">{{ num(tailCount) }}</span>
                                    <span :class="['w-12 text-right text-sm', ui.muted]">{{ pct(tailShare) }}%</span>
                                </div>
                            </div>
                            <div :class="['mt-2 h-2 w-full overflow-hidden rounded-full', ui.track]">
                                <div :class="['h-full rounded-full', FRESHNESS.unknown.bar]"
                                    :style="{ width: `${tailShare}%` }"></div>
                            </div>
                            <p :class="['mt-2 text-xs', ui.muted]">
                                Servers on versions too rare to be listed individually
                            </p>
                        </li>
                    </ul>

                    <div v-if="distribution.length > VERSION_LIMIT"
                        class="border-t border-gray-200 px-5 py-3 dark:border-gray-700/60">
                        <button type="button" @click="showAllVersions = !showAllVersions"
                            :class="['cursor-pointer rounded text-sm font-medium', ui.link, ui.focus]">
                            {{ showAllVersions ? 'Show fewer versions' : `Show all ${distribution.length} versions` }}
                        </button>
                    </div>
                </section>

                <section :class="[ui.card, 'overflow-hidden']">
                    <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-700/60">
                        <h3 class="font-semibold text-gray-900 dark:text-white">Release series</h3>
                    </div>

                    <ul class="space-y-5 p-5">
                        <li v-for="group in familyGroups" :key="group.label">
                            <div class="flex items-baseline justify-between gap-3">
                                <span class="font-medium tabular-nums text-gray-900 dark:text-white">{{ group.label
                                    }}.x</span>
                                <span class="flex items-baseline gap-2 tabular-nums">
                                    <span class="font-medium text-gray-900 dark:text-white">{{ num(group.count)
                                        }}</span>
                                    <span :class="['text-sm', ui.muted]">{{ pct(group.share) }}%</span>
                                </span>
                            </div>
                            <div :class="['mt-2 flex h-2 w-full gap-px overflow-hidden rounded-full', ui.track]">
                                <div v-for="version in group.versions" :key="version.version"
                                    :class="['h-full', FRESHNESS[version.freshness].bar]"
                                    :style="{ width: `${version.share}%` }"
                                    :title="`${version.tag}: ${num(version.count)} servers (${pct(version.share)}%)`">
                                </div>
                            </div>
                            <p :class="['mt-1.5 text-xs', ui.muted]">
                                {{ group.versions.length }} {{ group.versions.length === 1 ? 'version' : 'versions' }},
                                newest is {{ group.versions[0].tag }}
                            </p>
                        </li>
                    </ul>

                    <p v-if="tailCount > 0"
                        :class="['border-t border-gray-200 px-5 py-4 text-xs dark:border-gray-700/60', ui.muted]">
                        Series totals cover the listed versions only. {{ num(tailCount) }} servers run something
                        outside that list.
                    </p>
                </section>
            </div>

            <div v-if="activeTab === 'releases'">
                <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div class="relative sm:w-72">
                        <Icon name="feather:search"
                            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input v-model="releaseSearch" type="search" placeholder="Search release notes"
                            aria-label="Search release notes" :class="[ui.input, 'w-full pl-9 pr-3']" />
                    </div>
                    <select v-model="releaseFamily" aria-label="Filter by release series" :class="[ui.input, 'px-3']">
                        <option value="">All series</option>
                        <option v-for="family in releaseFamilyOptions" :key="family" :value="family">{{ family }}.x
                        </option>
                    </select>
                    <span :class="['text-sm tabular-nums sm:ml-auto', ui.muted]">
                        {{ filteredReleases.length }} {{ filteredReleases.length === 1 ? 'release' : 'releases' }}
                    </span>
                </div>

                <div v-if="filteredReleases.length"
                    :class="[ui.card, 'divide-y divide-gray-200 overflow-hidden dark:divide-gray-700/60']">
                    <article v-for="release in visibleReleases" :key="release.tag"
                        :id="`release-${releaseKey(release)}`" class="scroll-mt-24">
                        <button type="button" @click="toggleRelease(release)"
                            :aria-expanded="expanded.has(releaseKey(release))" :class="[
                                'flex w-full cursor-pointer items-start gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30',
                                ui.focus,
                            ]">
                            <Icon name="feather:chevron-right" :class="[
                                'mt-1 h-4 w-4 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none dark:text-gray-500',
                                expanded.has(releaseKey(release)) ? 'rotate-90' : '',
                            ]" />

                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="font-semibold tabular-nums text-gray-900 dark:text-white">{{
                                        release.tag }}</span>
                                    <span v-if="isLatest(release)"
                                        :class="[ui.pill, FRESHNESS.latest.pill]">Latest</span>
                                    <span v-if="release.prerelease"
                                        :class="[ui.pill, FRESHNESS.unknown.pill]">Pre-release</span>
                                    <span v-if="release.has_security" :class="[ui.pill, FRESHNESS.outdated.pill]">
                                        <Icon name="feather:shield" class="h-3 w-3" />
                                        Security
                                    </span>
                                    <span v-if="release.has_features"
                                        :class="[ui.pill, FRESHNESS.unknown.pill]">Features</span>
                                    <span v-if="release.has_bugfixes" :class="[ui.pill, FRESHNESS.unknown.pill]">Bug
                                        fixes</span>
                                </div>
                                <p v-if="!expanded.has(releaseKey(release)) && excerpt(release.body)"
                                    :class="['mt-1 truncate text-sm', ui.muted]">
                                    {{ excerpt(release.body) }}
                                </p>
                                <div :class="['mt-1 flex flex-wrap gap-x-4 text-xs sm:hidden', ui.muted]">
                                    <span>{{ formatDate(release.published_at) }}</span>
                                    <span v-if="runningOn(release)">{{ num(runningOn(release).count) }} servers</span>
                                </div>
                            </div>

                            <div class="hidden shrink-0 flex-col items-end text-right sm:flex">
                                <span class="text-sm text-gray-700 dark:text-gray-300">{{
                                    formatDate(release.published_at) }}</span>
                                <span v-if="runningOn(release)"
                                    :class="['mt-0.5 flex items-center gap-1.5 text-xs tabular-nums', ui.muted]">
                                    <span
                                        :class="['h-2 w-2 rounded-full', FRESHNESS[runningOn(release).freshness].bar]"></span>
                                    {{ num(runningOn(release).count) }} servers running it
                                </span>
                            </div>
                        </button>

                        <div v-if="expanded.has(releaseKey(release))"
                            class="border-t border-gray-100 px-4 pb-5 pt-4 sm:pl-11 dark:border-gray-700/40">
                            <div v-if="release.author" class="mb-4 flex items-center gap-2 text-sm">
                                <img :src="release.author.avatar_url" alt="" loading="lazy"
                                    class="h-6 w-6 rounded-full ring-1 ring-gray-200 dark:ring-white/10" />
                                <span :class="ui.muted">Released by</span>
                                <span class="font-medium text-gray-700 dark:text-gray-200">{{ release.author.login
                                    }}</span>
                            </div>

                            <MDC :value="displayBody(release.body)" tag="article"
                                class="prose prose-sm max-w-none break-words prose-a:text-blue-600 dark:prose-invert dark:prose-a:text-blue-400" />

                            <div
                                :class="[ui.well, 'mt-4 flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm']">
                                <span :class="ui.muted">
                                    {{ isTruncated(release.body) ?
                                        'These notes are shortened here.' :
                                        'Commits, assets and discussion live on GitHub.' }}
                                </span>
                                <a :href="release.html_url" target="_blank" rel="noopener"
                                    :class="['inline-flex items-center gap-1 rounded font-medium', ui.link, ui.focus]">
                                    Open full notes on GitHub
                                    <Icon name="feather:external-link" class="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>
                    </article>
                </div>

                <div v-if="filteredReleases.length > releaseLimit" class="mt-4 text-center">
                    <button type="button" @click="releaseLimit += RELEASE_PAGE" :class="[
                        'cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/60',
                        ui.focus,
                    ]">
                        Show {{ Math.min(RELEASE_PAGE, filteredReleases.length - releaseLimit) }} more releases
                    </button>
                </div>

                <div v-if="!filteredReleases.length" :class="[ui.card, 'px-4 py-12 text-center']">
                    <p class="text-gray-700 dark:text-gray-200">No releases match those filters.</p>
                    <button type="button" @click="clearReleaseFilters"
                        :class="['mt-2 cursor-pointer rounded text-sm font-medium', ui.link, ui.focus]">
                        Clear filters
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const slug = route.params.id

const { data, isLoading } = useSoftwareVersionsBySlug(slug)

const FAMILY_MODE_MIN_SERIES = 3
const VERSION_LIMIT = 10
const RELEASE_PAGE = 15
const BUCKET_ORDER = ['latest', 'recent', 'behind', 'outdated', 'unknown']
const TAB_IDS = ['distribution', 'releases']
const DEFAULT_TAB = 'distribution'

const ui = {
    card: 'rounded-xl border border-gray-200 bg-white dark:border-gray-700/60 dark:bg-gray-800',
    well: 'rounded-lg bg-gray-50 dark:bg-gray-900/40',
    track: 'bg-gray-200 dark:bg-gray-700',
    label: 'text-sm font-medium text-gray-500 dark:text-gray-400',
    value: 'text-2xl font-semibold tabular-nums text-gray-900 dark:text-white',
    muted: 'text-gray-500 dark:text-gray-400',
    chip: 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-700/60 dark:text-gray-400',
    pill: 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
    link: 'text-blue-600 hover:underline dark:text-blue-400',
    focus: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    input: 'rounded-lg border border-gray-200 bg-white py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
}

const FRESHNESS = {
    latest: {
        label: 'Latest',
        bar: 'bg-emerald-500',
        onBar: 'text-gray-950/80',
        pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20',
    },
    recent: {
        label: 'Recent',
        bar: 'bg-sky-500',
        onBar: 'text-gray-950/80',
        pill: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20',
    },
    behind: {
        label: 'Behind',
        bar: 'bg-amber-500',
        onBar: 'text-gray-950/80',
        pill: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20',
    },
    outdated: {
        label: 'Outdated',
        bar: 'bg-rose-500',
        onBar: 'text-gray-950/80',
        pill: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20',
    },
    unknown: {
        label: 'Other',
        bar: 'bg-gray-400 dark:bg-gray-600',
        onBar: 'text-gray-950/80 dark:text-white/90',
        pill: 'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-700/50 dark:text-gray-300 dark:ring-white/10',
    },
}

const numberFormat = new Intl.NumberFormat('en-US')
const dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const num = (n) => numberFormat.format(Number(n) || 0)
const pct = (n) => (Number.isFinite(n) ? n : 0).toFixed(1)
const cleanVersion = (v = '') => String(v).trim().replace(/^v/i, '')
const coreVersion = (v = '') => cleanVersion(v).split('+')[0].split('-')[0]
const familyOf = (v = '') => coreVersion(v).split('.').slice(0, 2).join('.')

/* ---------------------------------------------------------------------------
 * URL state: ?tab=releases and ?release=<tag>
 * ------------------------------------------------------------------------- */

const queryValue = (value) => (Array.isArray(value) ? value[0] : value) || ''

function tabFromQuery(query) {
    const tab = queryValue(query.tab)
    if (TAB_IDS.includes(tab)) return tab
    // A release deep link implies the releases tab, so ?release= works on its own.
    return queryValue(query.release) ? 'releases' : DEFAULT_TAB
}

function updateQuery(patch) {
    const query = { ...route.query }
    for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === undefined || value === '') delete query[key]
        else query[key] = value
    }
    return router.replace({ query })
}

const activeTab = computed({
    get: () => tabFromQuery(route.query),
    set: (tab) => updateQuery({ tab: tab === DEFAULT_TAB ? null : tab }),
})

const queryRelease = computed(() => cleanVersion(queryValue(route.query.release)))

const showAllVersions = ref(false)
const releaseSearch = ref('')
const releaseFamily = ref('')
const releaseLimit = ref(RELEASE_PAGE)
const expanded = ref(new Set())

function parseSemver(tag = '') {
    const [core, ...pre] = cleanVersion(tag).split('+')[0].split('-')
    const [major = 0, minor = 0, patch = 0] = core.split('.').map((n) => parseInt(n, 10) || 0)
    return { major, minor, patch, pre: pre.join('-') }
}

function compareSemverDesc(a, b) {
    const x = parseSemver(a)
    const y = parseSemver(b)
    const core = y.major - x.major || y.minor - x.minor || y.patch - x.patch
    if (core) return core
    if (x.pre && !y.pre) return 1
    if (!x.pre && y.pre) return -1
    return y.pre.localeCompare(x.pre, undefined, { numeric: true })
}

function formatDate(dateString) {
    if (!dateString) return '-'
    return dateFormat.format(new Date(dateString))
}

function timeAgo(dateString) {
    if (!dateString) return ''
    const diff = new Date(dateString).getTime() - Date.now()
    const units = [
        ['year', 31536000000],
        ['month', 2592000000],
        ['week', 604800000],
        ['day', 86400000],
        ['hour', 3600000],
        ['minute', 60000],
    ]
    for (const [unit, ms] of units) {
        if (Math.abs(diff) >= ms) return relativeFormat.format(Math.round(diff / ms), unit)
    }
    return 'just now'
}

const sw = computed(() => data.value?.software ?? null)
const releases = computed(() => data.value?.history ?? [])
const totalInstances = computed(() => sw.value?.instance_count ?? 0)

const historyVersions = computed(() =>
    [
        ...new Set(
            releases.value.filter((r) => !r.draft && !r.prerelease).map((r) => cleanVersion(r.version))
        ),
    ].sort(compareSemverDesc)
)

const latestVersion = computed(() => {
    const declared = sw.value?.latest_version?.version
    return declared ? cleanVersion(declared) : historyVersions.value[0] ?? null
})

const rankedVersions = computed(() => {
    const list = historyVersions.value
    const lv = latestVersion.value
    if (!lv || list.includes(lv)) return list
    return [lv, ...list].sort(compareSemverDesc)
})

const releaseFamilies = computed(() => [...new Set(rankedVersions.value.map(familyOf))])

const familyMode = computed(() => {
    const families = new Set((sw.value?.versions ?? []).map((v) => familyOf(v.version)))
    return families.size >= FAMILY_MODE_MIN_SERIES
})

const releaseByVersion = computed(() => new Map(releases.value.map((r) => [cleanVersion(r.version), r])))

function rankOf(version) {
    const list = rankedVersions.value
    const base = list.indexOf(latestVersion.value)
    let index = list.indexOf(version)
    if (index === -1) index = list.indexOf(coreVersion(version))
    if (index === -1 || base === -1) return null
    return Math.max(0, index - base)
}

function freshnessFor(version, rank) {
    if (rank === null) return 'unknown'
    if (rank === 0) return 'latest'
    if (!familyMode.value) return rank <= 2 ? 'recent' : rank <= 5 ? 'behind' : 'outdated'
    const families = releaseFamilies.value
    const gap = families.indexOf(familyOf(version)) - families.indexOf(familyOf(latestVersion.value))
    return gap <= 0 ? 'recent' : gap === 1 ? 'behind' : 'outdated'
}

const distribution = computed(() => {
    const total = totalInstances.value
    return (sw.value?.versions ?? [])
        .map((v) => {
            const version = cleanVersion(v.version)
            const rank = rankOf(version)
            return {
                version,
                tag: version,
                count: v.count,
                share: total ? (v.count / total) * 100 : 0,
                family: familyOf(version),
                isFork: version.includes('+'),
                isPrerelease: parseSemver(version).pre !== '',
                release:
                    releaseByVersion.value.get(version) ??
                    releaseByVersion.value.get(coreVersion(version)) ??
                    null,
                rank,
                freshness: freshnessFor(version, rank),
            }
        })
        .sort((a, b) => b.count - a.count)
})

const distributionByVersion = computed(() => new Map(distribution.value.map((d) => [d.version, d])))

const tailCount = computed(() =>
    Math.max(0, totalInstances.value - distribution.value.reduce((sum, d) => sum + d.count, 0))
)
const tailShare = computed(() => (totalInstances.value ? (tailCount.value / totalInstances.value) * 100 : 0))

const latest = computed(() => {
    const version = latestVersion.value
    if (!version) return null
    const running = distributionByVersion.value.get(version)
    return {
        version,
        tag: version,
        published_at:
            sw.value?.latest_version?.published_at ?? releaseByVersion.value.get(version)?.published_at ?? null,
        count: running?.count ?? 0,
        share: running?.share ?? 0,
    }
})

const mostCommon = computed(() => distribution.value[0] ?? null)

const visibleVersions = computed(() =>
    showAllVersions.value ? distribution.value : distribution.value.slice(0, VERSION_LIMIT)
)

const segments = computed(() => {
    const list = [...distribution.value]
        .sort(
            (a, b) =>
                BUCKET_ORDER.indexOf(a.freshness) - BUCKET_ORDER.indexOf(b.freshness) ||
                compareSemverDesc(a.version, b.version)
        )
        .map((d) => ({ key: d.version, label: d.tag, count: d.count, share: d.share, freshness: d.freshness }))
    if (tailCount.value > 0) {
        list.push({
            key: 'other',
            label: 'Other',
            count: tailCount.value,
            share: tailShare.value,
            freshness: 'unknown',
        })
    }
    return list
})

const buckets = computed(() => {
    const total = totalInstances.value
    const families = releaseFamilies.value
    const latestFamilyIndex = families.indexOf(familyOf(latestVersion.value ?? ''))
    const latestFamily = families[latestFamilyIndex]
    const previousFamily = latestFamilyIndex === -1 ? undefined : families[latestFamilyIndex + 1]
    const hints = familyMode.value
        ? {
            latest: latestVersion.value ?? '',
            recent: latestFamily ? `Older ${latestFamily}.x patches` : 'Same series as the latest',
            behind: previousFamily ? `${previousFamily}.x series` : 'Previous series',
            outdated: 'Older series',
            unknown: 'Forks, dev builds and the long tail',
        }
        : {
            latest: latestVersion.value ?? '',
            recent: '1 to 2 releases behind',
            behind: '3 to 5 releases behind',
            outdated: '6 or more releases behind',
            unknown: 'Forks, dev builds and the long tail',
        }
    return BUCKET_ORDER.map((key) => {
        const listed = distribution.value.filter((d) => d.freshness === key).reduce((sum, d) => sum + d.count, 0)
        const count = key === 'unknown' ? listed + tailCount.value : listed
        return {
            key,
            label: FRESHNESS[key].label,
            hint: hints[key],
            count,
            share: total ? (count / total) * 100 : 0,
        }
    })
})

const visibleBuckets = computed(() => buckets.value.filter((b) => b.count > 0))

const freshnessSummary = computed(() =>
    visibleBuckets.value.map((b) => `${b.label} ${pct(b.share)}%`).join(', ')
)

const familyGroups = computed(() => {
    const total = totalInstances.value
    const groups = new Map()
    for (const d of distribution.value) {
        if (!groups.has(d.family)) groups.set(d.family, { label: d.family, count: 0, versions: [] })
        const group = groups.get(d.family)
        group.count += d.count
        group.versions.push(d)
    }
    return [...groups.values()]
        .map((g) => ({
            ...g,
            share: total ? (g.count / total) * 100 : 0,
            versions: [...g.versions].sort((a, b) => compareSemverDesc(a.version, b.version)),
        }))
        .sort((a, b) => compareSemverDesc(a.label, b.label))
})

const topAsns = computed(() => (sw.value?.popular_asns ?? []).slice(0, 5))
const hostShare = (asn) => (totalInstances.value ? (asn.count / totalInstances.value) * 100 : 0)

const sortedReleases = computed(() =>
    [...releases.value].sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
)

const releaseFamilyOptions = computed(() =>
    [...new Set(releases.value.map((r) => familyOf(r.version)))].sort(compareSemverDesc)
)

const filteredReleases = computed(() => {
    const q = releaseSearch.value.trim().toLowerCase()
    return sortedReleases.value.filter((r) => {
        const matchesFamily = !releaseFamily.value || familyOf(r.version) === releaseFamily.value
        const matchesSearch = !q || `${r.tag} ${r.body ?? ''}`.toLowerCase().includes(q)
        return matchesFamily && matchesSearch
    })
})

const visibleReleases = computed(() => filteredReleases.value.slice(0, releaseLimit.value))

const tabs = computed(() => [
    { id: 'distribution', label: 'Distribution', count: distribution.value.length },
    { id: 'releases', label: 'Releases', count: releases.value.length },
])

const releaseKey = (release) => cleanVersion(release.tag)
const runningOn = (release) => distributionByVersion.value.get(cleanVersion(release.version)) ?? null
const isLatest = (release) => latestVersion.value !== null && releaseKey(release) === latestVersion.value

function findRelease(key) {
    const wanted = cleanVersion(key)
    if (!wanted) return null
    return (
        sortedReleases.value.find(
            (r) => releaseKey(r) === wanted || cleanVersion(r.version) === wanted
        ) ?? null
    )
}

function behindLabel(item) {
    if (item.freshness === 'latest') return 'Latest release'
    if (item.rank === null) return 'Not in the release history'
    return `${item.rank} ${item.rank === 1 ? 'release' : 'releases'} behind`
}

function clearReleaseFilters() {
    releaseSearch.value = ''
    releaseFamily.value = ''
}

// The article may not be in the DOM on the first frame: the tab switch is a
// router navigation now, and the list has to grow past releaseLimit first.
function waitForElement(id, frames = 12) {
    return new Promise((resolve) => {
        let tries = 0
        const check = () => {
            const el = document.getElementById(id)
            if (el || tries++ >= frames) return resolve(el ?? null)
            requestAnimationFrame(check)
        }
        check()
    })
}

/**
 * Expand a release, page the list far enough to include it, and scroll to it.
 * Does not touch the URL, so it is safe to call from the deep link watcher.
 */
async function revealRelease(release, { scroll = true, smooth = true } = {}) {
    const key = releaseKey(release)
    const index = filteredReleases.value.findIndex((r) => releaseKey(r) === key)
    if (index >= 0) releaseLimit.value = Math.max(releaseLimit.value, index + 1)
    expanded.value.add(key)
    if (!scroll || typeof window === 'undefined') return
    await nextTick()
    const el = await waitForElement(`release-${key}`)
    if (!el) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // One more frame so the router's own scroll handling lands first and
    // doesn't cancel a smooth scroll that started before it.
    requestAnimationFrame(() => {
        el.scrollIntoView({
            behavior: reduceMotion || !smooth ? 'auto' : 'smooth',
            block: 'start',
        })
    })
}

function toggleRelease(release) {
    const key = releaseKey(release)
    if (expanded.value.has(key)) {
        expanded.value.delete(key)
        if (queryRelease.value === key) updateQuery({ release: null })
    } else {
        expanded.value.add(key)
        updateQuery({ release: key })
    }
}

async function openRelease(release) {
    clearReleaseFilters()
    // Awaiting the navigation means the releases panel is mounted before we scroll.
    await updateQuery({ tab: 'releases', release: releaseKey(release) })
    await revealRelease(release)
}

function isTruncated(body = '') {
    return /\.\.\.$/.test(String(body ?? '').trim())
}

function displayBody(body = '') {
    const text = String(body ?? '').trim()
    if (!isTruncated(text)) return text
    const cut = text.lastIndexOf('\n')
    return cut > 0 ? text.slice(0, cut).trim() : text
}

function excerpt(body = '') {
    const lines = displayBody(body)
        .split('\n')
        .map((line) => line.trim())
    const picked = []
    for (let i = 0; i < lines.length && picked.length < 2; i++) {
        const line = lines[i]
        const next = lines[i + 1] ?? ''
        if (!line || /^#{1,6}\s/.test(line) || /^[-=]{3,}$/.test(line) || /^[-=]{3,}$/.test(next)) continue
        const isBullet = /^[-*+]\s+/.test(line)
        const text = line
            .replace(/^[-*+]\s+/, '')
            .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/[*`]/g, '')
            .replace(/\\(.)/g, '$1')
            .replace(/\(\s*(#\d+|[0-9a-f]{6,})\s*\)/gi, '')
            .replace(/\s+/g, ' ')
            .trim()
        if (!text || /:$/.test(text) || /^full changelog/i.test(text)) continue
        picked.push(text)
        if (!isBullet) break
    }
    return picked.join(', ')
}

watch(
    latestVersion,
    (version) => {
        if (version) expanded.value.add(version)
    },
    { immediate: true }
)

// Resolve ?release=<tag> once the release history has loaded. Expanding does not
// write to the query, and an already-expanded release is skipped, so a manual
// toggle cannot bounce back through here.
let deepLinked = false
watch(
    [queryRelease, sortedReleases],
    async ([key, list]) => {
        if (!key || !list.length) return
        if (expanded.value.has(key)) return
        const target = findRelease(key)
        if (!target) return
        const first = !deepLinked
        deepLinked = true
        await revealRelease(target, { smooth: !first })
    },
    { immediate: true }
)
</script>
