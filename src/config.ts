export const SITE = {
	title: 'The Mythic Age',
	description: 'Resources for the Mythic Age.',
	defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/withastro/astro/blob/main/assets/social/banner.jpg?raw=true',
		alt:
			'astro logo on a starry expanse of space,' +
			' with a purple saturn-like planet floating in the right foreground',
	},
	twitter: 'astrodotbuild',
};

export const KNOWN_LANGUAGES = {
	English: 'en',
};

// Uncomment this to add an "Edit this page" button to every page of documentation.
// export const GITHUB_EDIT_URL = `https://github.com/withastro/astro/blob/main/docs/`;

// Uncomment this to add an "Join our Community" button to every page of documentation.
// export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// Uncomment this to enable site search.
// See "Algolia" section of the README for more information.
// export const ALGOLIA = {
//   indexName: 'XXXXXXXXXX',
//   appId: 'XXXXXXXXXX',
//   apiKey: 'XXXXXXXXXX',
// }

export const SIDEBAR = {
	en: [
		{ text: 'Introduction', link: 'the-mythic-age/intro' },

		{ text: 'The World', header: true },
		{ text: 'Maurkim', link: 'the-mythic-age/world/maurkim' },

		{ text: 'Campaigns', header: true },
		{ text: 'The Company of the Golden Lion', link: 'the-mythic-age/campaigns/the-cotgl' },

		{ text: 'Mechanics', header: true },
		{ text: 'Character Creation', link: 'the-mythic-age/mechanics/character-creation' },

		{ text: 'Weapons', header: true },
		{ text: 'Mundane Weapons', link: 'the-mythic-age/weapons/mundane-weapons' },
		{ text: 'Chimera Weapons', link: 'the-mythic-age/weapons/chimera-weapons' },
		{ text: 'Dryad Weapons', link: 'the-mythic-age/weapons/dryad-weapons' },
		{ text: 'Hydra Weapons', link: 'the-mythic-age/weapons/hydra-weapons' },
		{ text: 'Karkhadan Weapons', link: 'the-mythic-age/weapons/karkhadan-weapons' },
		{ text: 'Leucrotta Weapons', link: 'the-mythic-age/weapons/leucrotta-weapons' },
		{ text: 'Manticore Weapons', link: 'the-mythic-age/weapons/manticore-weapons' },
		{ text: 'Medusa Weapons', link: 'the-mythic-age/weapons/medusa-weapons' },
		{ text: 'Roc Weapons', link: 'the-mythic-age/weapons/roc-weapons' },
		{ text: 'Serpopard Weapons', link: 'the-mythic-age/weapons/serpopard-weapons' },
		{ text: 'Siren Weapons', link: 'the-mythic-age/weapons/siren-weapons' },
		{ text: 'Sphynx Weapons', link: 'the-mythic-age/weapons/sphynx-weapons' },

	],
};
