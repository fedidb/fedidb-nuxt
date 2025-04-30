<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <header class="mb-12">
        <h1 class="text-4xl font-bold mb-2">API Documentation</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Explore the open FediDB API endpoints.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">API Overview</h2>
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p class="mb-0">The v1 API endpoint is <code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">https://api.fedidb.org/v1/</code>. All requests should be made to this endpoint.</p>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold mb-6">Endpoints</h2>
        
        <div 
          v-for="(endpoint, index) in endpoints" 
          :key="index"
          class="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        >
          <div class="flex items-start p-4 bg-gray-50 dark:bg-gray-800">
            <div :class="`px-2 py-1 rounded text-white font-mono text-sm mr-3 ${methodColors[endpoint.method]}`">
              {{ endpoint.method }}
            </div>
            <div class="flex-grow">
              <h3 class="text-xl font-bold font-mono">{{ endpoint.path }}</h3>
              <p class="mt-1 text-gray-600 dark:text-gray-400">{{ endpoint.description }}</p>
            </div>
          </div>
          
          <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <div v-if="endpoint.parameters && endpoint.parameters.length > 0" class="mb-6">
              <h4 class="text-lg font-semibold mb-2">Parameters</h4>
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-100 dark:bg-gray-800">
                    <th class="p-2 border border-gray-200 dark:border-gray-700">Name</th>
                    <th class="p-2 border border-gray-200 dark:border-gray-700">Type</th>
                    <th class="p-2 border border-gray-200 dark:border-gray-700">Required</th>
                    <th class="p-2 border border-gray-200 dark:border-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(param, paramIndex) in endpoint.parameters" :key="paramIndex" class="border-b border-gray-200 dark:border-gray-700">
                    <td class="p-2 border border-gray-200 dark:border-gray-700 font-mono">{{ param.name }}</td>
                    <td class="p-2 border border-gray-200 dark:border-gray-700">{{ param.type }}</td>
                    <td class="p-2 border border-gray-200 dark:border-gray-700">{{ param.required ? 'Yes' : 'No' }}</td>
                    <td class="p-2 border border-gray-200 dark:border-gray-700">{{ param.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-2">Example Request</h4>
              <pre class="bg-gray-200 dark:bg-gray-700 p-3 rounded overflow-x-auto">{{ endpoint.exampleRequest }}</pre>
            </div>

            <div>
              <div 
                @click="toggleResponse(index)" 
                class="flex justify-between items-center cursor-pointer py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded"
              >
                <h4 class="text-lg font-semibold">Example Response</h4>
                <div class="transform transition-transform" :class="{ 'rotate-180': openResponses[index] }">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div 
                v-show="openResponses[index]" 
                class="mt-2 transition-all duration-300 ease-in-out overflow-hidden"
              >
                <pre class="bg-gray-200 dark:bg-gray-700 p-3 rounded overflow-x-auto whitespace-pre-wrap">{{ endpoint.exampleResponse }}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="mb-10">
        <h2 class="text-2xl font-bold mb-6">Entity Definitions</h2>
        
        <div class="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div class="flex items-start p-4 bg-gray-50 dark:bg-gray-800">
            <div class="flex-grow">
              <h3 class="text-xl font-bold">ServerEntity</h3>
              <p class="mt-1 text-gray-600 dark:text-gray-400">ServerEntity represents an individual Server and returns the following attributes.</p>
            </div>
            <div 
              @click="toggleEntity('serverEntity')" 
              class="cursor-pointer p-2"
            >
              <div class="transform transition-transform" :class="{ 'rotate-180': openEntities.serverEntity }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div v-show="openEntities.serverEntity" class="p-4 border-t border-gray-200 dark:border-gray-700">
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-2">Attributes</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-gray-100 dark:bg-gray-800">
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Name</th>
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Type</th>
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Nullable</th>
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(attr, attrIndex) in serverEntityAttributes" :key="attrIndex" class="border-b border-gray-200 dark:border-gray-700">
                      <td class="p-2 border border-gray-200 dark:border-gray-700 font-mono">{{ attr.name }}</td>
                      <td class="p-2 border border-gray-200 dark:border-gray-700">{{ attr.type }}</td>
                      <td class="p-2 border border-gray-200 dark:border-gray-700">
                        <svg v-if="attr.nullable" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </td>
                      <td class="p-2 border border-gray-200 dark:border-gray-700">{{ attr.description }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold mb-2">Example Response</h4>
              <pre class="bg-gray-200 dark:bg-gray-700 p-3 rounded overflow-x-auto">{
    "id": 18006,
    "domain": "pixelfed.social",
    "open_registration": true,
    "description": "The original Pixelfed instance, operated by the main developer @dansup",
    "banner_url": "https://fedidb.pixelcdn.net/instances/18006/tvz8e8xw_thumbnail.jpg",
    "location": {
        "city": null,
        "country": "United States"
    },
    "software": {
        "id": 1,
        "name": "Pixelfed",
        "url": "https://fedidb.org/software/pixelfed",
        "version": "0.11.5"
    },
    "stats": {
        "status_count": 2019860,
        "user_count": 74706,
        "monthly_active_users": 3951
    },
    "first_seen_at": "2021-03-30T14:10:44.000000Z",
    "last_seen_at": "2023-04-13T12:00:11.000000Z"
}</pre>
            </div>
          </div>
        </div>
        
        <div class="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div class="flex items-start p-4 bg-gray-50 dark:bg-gray-800">
            <div class="flex-grow">
              <h3 class="text-xl font-bold">SoftwareEntity</h3>
              <p class="mt-1 text-gray-600 dark:text-gray-400">SoftwareEntity represents an individual Software project and returns the following attributes.</p>
            </div>
            <div 
              @click="toggleEntity('softwareEntity')" 
              class="cursor-pointer p-2"
            >
              <div class="transform transition-transform" :class="{ 'rotate-180': openEntities.softwareEntity }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div v-show="openEntities.softwareEntity" class="p-4 border-t border-gray-200 dark:border-gray-700">
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-2">Attributes</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-gray-100 dark:bg-gray-800">
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Name</th>
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Type</th>
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Nullable</th>
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(attr, attrIndex) in softwareEntityAttributes" :key="attrIndex" class="border-b border-gray-200 dark:border-gray-700">
                      <td class="p-2 border border-gray-200 dark:border-gray-700 font-mono">{{ attr.name }}</td>
                      <td class="p-2 border border-gray-200 dark:border-gray-700">{{ attr.type }}</td>
                      <td class="p-2 border border-gray-200 dark:border-gray-700">
                        <svg v-if="attr.nullable" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </td>
                      <td class="p-2 border border-gray-200 dark:border-gray-700">{{ attr.description }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold mb-2">Example Response</h4>
              <pre class="bg-gray-200 dark:bg-gray-700 p-3 rounded overflow-x-auto">{
    "id": 1,
    "name": "Pixelfed",
    "url": "https://fedidb.org/software/pixelfed",
    "description": "Photo Sharing. For Everyone.",
    "license": "AGPL",
    "instance_count": 410,
    "user_count": 144275,
    "monthly_active_users": 12598,
    "status_count": 4289378,
    "website": "https://pixelfed.org",
    "source_repo": "https://github.com/pixelfed/pixelfed"
}</pre>
            </div>
          </div>
        </div>
        
        <div class="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div class="flex items-start p-4 bg-gray-50 dark:bg-gray-800">
            <div class="flex-grow">
              <h3 class="text-xl font-bold">PopularAccountEntity</h3>
              <p class="mt-1 text-gray-600 dark:text-gray-400">PopularAccountEntity represents an individual account and returns the following attributes.</p>
            </div>
            <div 
              @click="toggleEntity('popularAccountEntity')" 
              class="cursor-pointer p-2"
            >
              <div class="transform transition-transform" :class="{ 'rotate-180': openEntities.popularAccountEntity }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div v-show="openEntities.popularAccountEntity" class="p-4 border-t border-gray-200 dark:border-gray-700">
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-2">Attributes</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-gray-100 dark:bg-gray-800">
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Name</th>
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Type</th>
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Nullable</th>
                      <th class="p-2 border border-gray-200 dark:border-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(attr, attrIndex) in popularAccountEntityAttributes" :key="attrIndex" class="border-b border-gray-200 dark:border-gray-700">
                      <td class="p-2 border border-gray-200 dark:border-gray-700 font-mono">{{ attr.name }}</td>
                      <td class="p-2 border border-gray-200 dark:border-gray-700">{{ attr.type }}</td>
                      <td class="p-2 border border-gray-200 dark:border-gray-700">
                        <svg v-if="attr.nullable" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </td>
                      <td class="p-2 border border-gray-200 dark:border-gray-700">{{ attr.description }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold mb-2">Example Response</h4>
              <pre class="bg-gray-200 dark:bg-gray-700 p-3 rounded overflow-x-auto">{
    "id": 1,
    "rank": 5,
    "username": "Mastodon",
    "name": "Mastodon",
    "domain": "mastodon.social",
    "account_url": "https://mastodon.social/@Mastodon",
    "avatar_url": "https://files.mastodon.social/accounts/avatars/000/013/179/original/b4ceb19c9c54ec7e.png",
    "following_count": 3,
    "followers_count": 816794,
    "status_count": 265,
    "webfinger": "@Mastodon@mastodon.social",
    "bio": "&lt;p>Free, open-source decentralized social media platform.&lt;/p>",
    "account_created_at": "2016-11-22T17:00:00+00:00",
    "last_fetched_at": "2024-06-30T20:01:07.000000Z"
}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const openResponses = ref({});
const openEntities = ref({
    serverEntity: false,
    softwareEntity: false,
    popularAccountEntity: false,
});

const toggleResponse = (index) => {
    openResponses.value[index] = !openResponses.value[index];
};

const toggleEntity = (entity) => {
    openEntities.value[entity] = !openEntities.value[entity];
};

const methodColors = {
    GET: 'bg-green-600',
    POST: 'bg-blue-600',
    PUT: 'bg-amber-600',
    DELETE: 'bg-red-600',
    PATCH: 'bg-purple-600',
};

const serverEntityAttributes = [
    {
        name: 'id',
        type: 'String',
        nullable: false,
        description: 'The server id',
    },
    {
        name: 'domain',
        type: 'String',
        nullable: false,
        description: 'The server domain',
    },
    {
        name: 'open_registration',
        type: 'Boolean',
        nullable: true,
        description: 'Server allows new account registration',
    },
    {
        name: 'description',
        type: 'String',
        nullable: true,
        description: 'Description of the server',
    },
    {
        name: 'banner_url',
        type: 'String',
        nullable: true,
        description: 'URL of server banner image',
    },
    {
        name: 'location[city]',
        type: 'String',
        nullable: true,
        description: 'The city the server is hosted in',
    },
    {
        name: 'location[country]',
        type: 'String',
        nullable: true,
        description: 'The country the server is hosted in',
    },
    {
        name: 'software[id]',
        type: 'Integer',
        nullable: true,
        description: 'The server software id',
    },
    {
        name: 'software[name]',
        type: 'String',
        nullable: true,
        description: 'The server software name',
    },
    {
        name: 'software[url]',
        type: 'String',
        nullable: true,
        description: 'The server software FediDB listing URL',
    },
    {
        name: 'software[version]',
        type: 'String',
        nullable: true,
        description: 'The server software version',
    },
    {
        name: 'stats[status_count]',
        type: 'Integer',
        nullable: true,
        description: 'The total status count of this server',
    },
    {
        name: 'stats[user_count]',
        type: 'Integer',
        nullable: true,
        description: 'The total user count of this server',
    },
    {
        name: 'stats[monthly_active_users]',
        type: 'Integer',
        nullable: true,
        description: 'The monthly active users of the server',
    },
    {
        name: 'first_seen_at',
        type: 'String',
        nullable: false,
        description:
            'The ISO8601 timestamp of when we first observed the server',
    },
    {
        name: 'last_seen_at',
        type: 'String',
        nullable: true,
        description:
            'The ISO8601 timestamp of when we last observed the server',
    },
];

const softwareEntityAttributes = [
    {
        name: 'id',
        type: 'String',
        nullable: false,
        description: 'The software id',
    },
    {
        name: 'name',
        type: 'String',
        nullable: false,
        description: 'The software name',
    },
    {
        name: 'url',
        type: 'String',
        nullable: false,
        description: 'The url of the FediDB software listing',
    },
    {
        name: 'description',
        type: 'String',
        nullable: true,
        description: 'The software description',
    },
    {
        name: 'license',
        type: 'String',
        nullable: true,
        description: 'The software license',
    },
    {
        name: 'instance_count',
        type: 'Integer',
        nullable: false,
        description: '',
    },
    { name: 'user_count', type: 'Integer', nullable: false, description: '' },
    {
        name: 'monthly_active_users',
        type: 'Integer',
        nullable: true,
        description: '',
    },
    { name: 'status_count', type: 'Integer', nullable: false, description: '' },
    { name: 'website', type: 'String', nullable: true, description: '' },
    { name: 'source_repo', type: 'String', nullable: true, description: '' },
];

const popularAccountEntityAttributes = [
    {
        name: 'id',
        type: 'Integer',
        nullable: false,
        description: 'The account id',
    },
    {
        name: 'rank',
        type: 'Integer',
        nullable: false,
        description: 'The account popularity rank',
    },
    {
        name: 'username',
        type: 'String',
        nullable: false,
        description: 'The account username',
    },
    {
        name: 'name',
        type: 'String',
        nullable: false,
        description: 'The account name',
    },
    {
        name: 'domain',
        type: 'String',
        nullable: false,
        description: 'The account server domain',
    },
    {
        name: 'account_url',
        type: 'String',
        nullable: false,
        description: 'The url of account',
    },
    {
        name: 'avatar_url',
        type: 'String',
        nullable: false,
        description: 'The avatar url of account',
    },
    {
        name: 'following_count',
        type: 'Integer',
        nullable: false,
        description: 'The following count of account',
    },
    {
        name: 'followers_count',
        type: 'Integer',
        nullable: false,
        description: 'The followers count of account',
    },
    {
        name: 'status_count',
        type: 'Integer',
        nullable: false,
        description: 'The status count of account',
    },
    {
        name: 'webfinger',
        type: 'String',
        nullable: false,
        description: 'The account webfinger address',
    },
    {
        name: 'bio',
        type: 'String',
        nullable: true,
        description: 'The account bio',
    },
    {
        name: 'account_created_at',
        type: 'String',
        nullable: true,
        description: 'ISO 8601 timestamp of account creation',
    },
    {
        name: 'last_fetched_at',
        type: 'String',
        nullable: true,
        description: 'ISO 8601 timestamp of last account fetch',
    },
];

const endpoints = ref([
    {
        method: 'GET',
        path: '/v1/stats',
        description:
            'Returns network statistics, updated every 15 minutes using the latest data we collect.',
        parameters: [],
        exampleRequest: `curl -X GET "https://api.fedidb.org/v1/stats"`,
        exampleResponse: `{
    "total_instances": 23815,
    "total_instances_str": "23815",
    "total_statuses": 1052877187,
    "total_statuses_str": "1052877187",
    "total_users": 10001240,
    "total_users_str": "10001240",
    "monthly_active_users": 1898279,
    "monthly_active_users_str": "1898279",
    "last_updated_at": "2023-07-09T05:00:00+00:00"
}`,
    },
    {
        method: 'GET',
        path: '/v1/popular-accounts',
        description:
            'Returns popular accounts across the fediverse, updated every 24 hours using the latest data we collect.',
        parameters: [],
        exampleRequest: `curl -X GET "https://api.fedidb.org/v1/popular-accounts"`,
        exampleResponse: `[
    {
        "id": 1,
        "rank": 5,
        "username": "Mastodon",
        "name": "Mastodon",
        "domain": "mastodon.social",
        "account_url": "https://mastodon.social/@Mastodon",
        "avatar_url": "https://files.mastodon.social/accounts/avatars/000/013/179/original/b4ceb19c9c54ec7e.png",
        "following_count": 3,
        "followers_count": 816794,
        "status_count": 265,
        "webfinger": "@Mastodon@mastodon.social",
        "bio": "<p>Free, open-source decentralized social media platform.</p>",
        "account_created_at": "2016-11-22T17:00:00+00:00",
        "last_fetched_at": "2024-06-30T20:01:07.000000Z"
    }
]`,
    },
    {
        method: 'GET',
        path: '/v1/servers',
        description: 'Returns an array of ServerEntity',
        parameters: [
            {
                name: 'limit',
                type: 'Integer',
                required: false,
                description:
                    'The number of records to return, between 1-40. Default 10.',
            },
        ],
        exampleRequest: `curl -X GET "https://api.fedidb.org/v1/servers?limit=10"`,
        exampleResponse: ``,
    },
    {
        method: 'GET',
        path: '/v1/server/domain/{domain}',
        description: 'Endpoint is not cached. Returns a ServerEntity.',
        parameters: [
            {
                name: 'domain',
                type: 'string',
                required: true,
                description: 'The domain name of the server.',
            },
        ],
        exampleRequest: `curl -X GET "https://api.fedidb.org/v1/server/domain/mastodon.social"`,
        exampleResponse: ``,
    },
    {
        method: 'GET',
        path: '/v1/software',
        description: 'Returns an array of SoftwareEntity',
        parameters: [
            {
                name: 'limit',
                type: 'Integer',
                required: false,
                description:
                    'The number of records to return, between 1-40. Default 10.',
            },
        ],
        exampleRequest: `curl -X GET "https://api.fedidb.org/v1/software?limit=10"`,
        exampleResponse: ``,
    },
    {
        method: 'GET',
        path: '/v1/software/{slug}',
        description:
            'Endpoint is cached for 15 minutes. Returns a SoftwareEntity.',
        parameters: [
            {
                name: 'slug',
                type: 'string',
                required: true,
                description: 'The slug identifier for the software.',
            },
        ],
        exampleRequest: `curl -X GET "https://api.fedidb.org/v1/software/pixelfed"`,
        exampleResponse: ``,
    },
]);

onMounted(() => {
    endpoints.value.forEach((_, index) => {
        openResponses.value[index] = false;
    });
});

useHead(() => ({
    title: 'FediDB API Documentation',
    meta: [
        {
            name: 'description',
            content: 'FediDB API Documentation',
        },
    ],
}));
</script>

<style scoped>
code, pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
