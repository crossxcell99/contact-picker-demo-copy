<script lang="ts">
	export let contact: ContactProperties;
</script>

<li class="mb-3 ml-5 list-disc">
	{#if contact.name}
		<span class="block"><b>Name:</b> {contact.name.join(', ')}</span>
	{/if}
	{#if contact.email}
		<span class="block"><b>Email:</b> {contact.email.join(', ')}</span>
	{/if}
	{#if contact.tel}
		<span class="block"><b>Telephone:</b> {contact.tel.join(', ')}</span>
	{/if}
	{#if contact.address}
		{#each contact.address as address}
			<span class="block"><b>Address:</b> {JSON.stringify(address)}</span>
		{/each}
	{/if}
	{#if contact.icon}
		{#each contact.icon as icon}
			<span class="block"><b>Icon:</b> <img alt="" src="${URL.createObjectURL(icon)}" /></span>
		{/each}
	{/if}
</li>
