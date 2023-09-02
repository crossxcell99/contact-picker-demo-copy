<script lang="ts" context="module">
	/// <reference types="../contact-picker" />

	type CbProps = { [k in ContactsPropertiesKeys]?: boolean };

	const getNameSuffix = () => new Date().toISOString().split('.', 1)[0].replace(/[:-]/g, '');

	const triggerDownload = (obj: any[], name: string) => {
		const a = window.document.createElement('a');
		a.download = name;
		a.href = URL.createObjectURL(new Blob([JSON.stringify(obj)], { type: 'application/json' }));
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
</script>

<script lang="ts">
	import ContactDisplay from '$lib/ContactDisplay.svelte';
	import { onMount } from 'svelte';

	let onhttps = true;
	let httpsLink = '';
	let supported = false;
	let cbProps: CbProps = {};
	let cbUserProps: CbProps = {};
	let multiple = false;
	let success = false;
	let error = '';
	let contacts: ContactProperties[] = [];

	onMount(() => {
		if (window.location.protocol === 'http:') {
			onhttps = false;
			httpsLink = window.location.href.replace('http://', 'https://');

			const host = window.location.host.split(':', 1)[0];
			if (!host.startsWith('192.168') && !['localhost', '127.0.0.1', '0.0.0.0'].includes(host)) {
				window.location.href = httpsLink;
			}
		}

		if ('contacts' in navigator && 'ContactsManager' in window) {
			supported = true;
			checkProperties();
		}
	});

	async function checkProperties() {
		const supportedProperties = await navigator.contacts.getProperties();
		cbProps = supportedProperties.reduce<CbProps>((acc, k) => {
			acc[k] = true;
			return acc;
		}, {});
		cbUserProps = { ...cbProps };
	}

	async function getContacts() {
		const props = Object.keys(cbUserProps).reduce<ContactsPropertiesKeys[]>((acc, k) => {
			const key = k as ContactsPropertiesKeys;
			if (cbUserProps[key] && cbProps[key]) acc.push(key);
			return acc;
		}, []);

		try {
			contacts = await navigator.contacts.select(props, { multiple });
			success = true;
			error = '';
		} catch (ex) {
			success = false;
			error = String(ex) || '<Error getting contacts>';
		}
	}
</script>

<div class="mx-4">
	<h1 class="p-4 font-bold text-center text-2xl sticky top-0 bg-white">Contact Picker API Demo</h1>

	<p class:hidden={onhttps} class="clear-both">
		<b class="text-red-600">STOP!</b> This page <b>must</b> be served over HTTPS. Please
		<a
			class="text-blue-600 visited:text-purple-600 hover:underline focus:underline"
			href={httpsLink}>reload this page via HTTPS</a
		>.
	</p>

	<p class:hidden={supported} class="clear-both">
		<b class="text-red-500">Sorry!</b> This browser doesn't support the Contact Picker API, which is
		required for this demo. Try enabling the
		<code>#enable-experimental-web-platform-features</code> in chrome://flags and try again.
	</p>

	<p class="clear-both mt-3">
		<b>Note:</b> This demo requires Chrome 80 or later running on Android M or later to work properly.
	</p>

	<ol class=" list-none ps-0">
		<li>
			<input type="checkbox" id="multiple" bind:checked={multiple} />
			<label class="inline-block w-80" for="multiple">Multiple results?</label>
		</li>
		<li>
			<input type="checkbox" id="name" bind:checked={cbUserProps.name} disabled={!cbProps.name} />
			<label class="inline-block w-80" for="name">Include name?</label>
		</li>
		<li>
			<input
				type="checkbox"
				id="email"
				bind:checked={cbUserProps.email}
				disabled={!cbProps.email}
			/>
			<label class="inline-block w-80" for="email">Include email addresses?</label>
		</li>
		<li>
			<input type="checkbox" id="tel" bind:checked={cbUserProps.tel} disabled={!cbProps.tel} />
			<label class="inline-block w-80" for="tel">Include telephone numbers?</label>
		</li>
		<li>
			<input
				type="checkbox"
				id="address"
				bind:checked={cbUserProps.address}
				disabled={!cbProps.address}
			/>
			<label class="inline-block w-80" for="address">Include addresses? (Chrome 84 and later)</label
			>
		</li>
		<li>
			<input type="checkbox" id="icon" bind:checked={cbUserProps.icon} disabled={!cbProps.icon} />
			<label class="inline-block w-80" for="icons">Include icons? (Chrome 84 and later)</label>
		</li>
	</ol>

	<p class="clear-both mt-3">
		This demo <b>does not</b>
		share or upload your contacts. It simply shows them on screen, and no contact data is transferred
		off this device.
	</p>

	<p class="clear-both mt-3">
		<button
			on:click={getContacts}
			type="button"
			disabled={!supported}
			class="transition ease-in-out duration-200 bg-slate-200 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50 disabled:border-purple-600 rounded p-2"
		>
			Open contact picker
		</button>
		{#if contacts.length > 0}
			<button
				type="button"
				on:click={() => triggerDownload(contacts, `contacts-${getNameSuffix()}.json`)}
				class="transition ease-in-out duration-200 bg-slate-200 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50 disabled:border-purple-600 hover:text-white active:text-white rounded p-2 ml-4"
			>
				Download JSON
			</button>
		{/if}
	</p>

	<p class="clear-both mt-3">
		<b>Results</b>
	</p>
	<ul id="results" class:error class:success class="text-gray-800">
		<li>Results will be populated here.</li>
		{#each contacts as contact}
			<ContactDisplay {contact} />
		{/each}
	</ul>
	<pre id="rawResults" />

	<p class="clear-both mt-3">
		Check out the
		<a
			class="text-blue-600 visited:text-purple-600 hover:underline focus:underline"
			href="https://contact-picker.glitch.me/">original</a
		>.
	</p>
</div>

<style lang="postcss">
	:global(body) {
		font-family: Helvetica, Arial, sans-serif;
	}

	ul.success {
		color: #000;
	}

	ul.error {
		color: red;
	}
</style>
