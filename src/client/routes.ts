// Generated automatically by @izzyjs/route
// Do not modify this file
export declare const routes: readonly [
  {
    readonly name: 'support.index'
    readonly path: '/'
    readonly method: 'get'
    readonly domain: 'suporte.localhost'
  },
  {
    readonly name: 'support.category'
    readonly path: '/category/:slug'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['slug']
    }
    readonly domain: 'suporte.localhost'
  },
  {
    readonly name: 'support.article'
    readonly path: '/article/:slug'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['slug']
    }
    readonly domain: 'suporte.localhost'
  },
  {
    readonly name: 'admin.support.teams'
    readonly path: '/support/teams'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.support.ticket'
    readonly path: '/support/tickets/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.support.ticket.message'
    readonly path: '/support/tickets/:id/message'
    readonly method: 'post'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.support.sac.index'
    readonly path: '/support/sac'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.support.sac.show'
    readonly path: '/support/sac/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.support.index'
    readonly path: '/support'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.support.show'
    readonly path: '/support/:filterId'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['filterId']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_banners.index'
    readonly path: '/advertisements/banners'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_banners.create'
    readonly path: '/advertisements/banners/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_banners.store'
    readonly path: '/advertisements/banners'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_banners.show'
    readonly path: '/advertisements/banners/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_banners.edit'
    readonly path: '/advertisements/banners/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_banners.update'
    readonly path: '/advertisements/banners/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_banners.destroy'
    readonly path: '/advertisements/banners/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertise_banner.edit'
    readonly path: '/advertisements/:id/banners/:advertisementId/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id', 'advertisementId']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_banners.index'
    readonly path: '/advertisements/:id/banners'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_banners.create'
    readonly path: '/advertisements/:id/banners/create'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_banners.store'
    readonly path: '/advertisements/:id/banners'
    readonly method: 'post'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_banners.show'
    readonly path: '/banners/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_banners.edit'
    readonly path: '/banners/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_banners.update'
    readonly path: '/banners/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_banners.destroy'
    readonly path: '/banners/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_internals.index'
    readonly path: '/advertisements/internals'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_internals.create'
    readonly path: '/advertisements/internals/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_internals.store'
    readonly path: '/advertisements/internals'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_internals.show'
    readonly path: '/advertisements/internals/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_internals.edit'
    readonly path: '/advertisements/internals/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_internals.update'
    readonly path: '/advertisements/internals/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_internals.destroy'
    readonly path: '/advertisements/internals/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertise_internal.edit'
    readonly path: '/advertisements/:id/internals/:advertisementId/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id', 'advertisementId']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_internals.index'
    readonly path: '/advertisements/:id/internals'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_internals.create'
    readonly path: '/advertisements/:id/internals/create'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_internals.store'
    readonly path: '/advertisements/:id/internals'
    readonly method: 'post'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_internals.show'
    readonly path: '/internals/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_internals.edit'
    readonly path: '/internals/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_internals.update'
    readonly path: '/internals/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_internals.destroy'
    readonly path: '/internals/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_panels.index'
    readonly path: '/advertisements/panels'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_panels.create'
    readonly path: '/advertisements/panels/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_panels.store'
    readonly path: '/advertisements/panels'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_panels.show'
    readonly path: '/advertisements/panels/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_panels.edit'
    readonly path: '/advertisements/panels/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_panels.update'
    readonly path: '/advertisements/panels/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_panels.destroy'
    readonly path: '/advertisements/panels/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertise_panel.edit'
    readonly path: '/advertisements/:id/panels/:advertisementId/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id', 'advertisementId']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_panels.index'
    readonly path: '/advertisements/:id/panels'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_panels.create'
    readonly path: '/advertisements/:id/panels/create'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_panels.store'
    readonly path: '/advertisements/:id/panels'
    readonly method: 'post'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_panels.show'
    readonly path: '/panels/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_panels.edit'
    readonly path: '/panels/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_panels.update'
    readonly path: '/panels/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_panels.destroy'
    readonly path: '/panels/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_videos.index'
    readonly path: '/advertisements/videos'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_videos.create'
    readonly path: '/advertisements/videos/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_videos.store'
    readonly path: '/advertisements/videos'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_videos.show'
    readonly path: '/advertisements/videos/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_videos.edit'
    readonly path: '/advertisements/videos/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_videos.update'
    readonly path: '/advertisements/videos/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertises_videos.destroy'
    readonly path: '/advertisements/videos/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertise_video.edit'
    readonly path: '/advertisements/:id/videos/:advertisementId/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id', 'advertisementId']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_videos.index'
    readonly path: '/advertisements/:id/videos'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_videos.create'
    readonly path: '/advertisements/:id/videos/create'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_videos.store'
    readonly path: '/advertisements/:id/videos'
    readonly method: 'post'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_videos.show'
    readonly path: '/videos/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_videos.edit'
    readonly path: '/videos/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_videos.update'
    readonly path: '/videos/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser_videos.destroy'
    readonly path: '/videos/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser.index'
    readonly path: '/advertisements'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser.create'
    readonly path: '/advertisements/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser.store'
    readonly path: '/advertisements'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser.show'
    readonly path: '/advertisements/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser.edit'
    readonly path: '/advertisements/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser.update'
    readonly path: '/advertisements/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.advertiser.destroy'
    readonly path: '/advertisements/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.index'
    readonly path: '/'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.login.index'
    readonly path: '/login'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.login.store'
    readonly path: '/login'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.dashboard'
    readonly path: '/dashboard'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.billing.index'
    readonly path: '/billing'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.billing.plans.index'
    readonly path: '/billing/plans'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.billing.plans.create'
    readonly path: '/billing/plans/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.billing.plans.store'
    readonly path: '/billing/plans'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.billing.plans.edit'
    readonly path: '/billing/plans/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.billing.plans.update'
    readonly path: '/billing/plans/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.billing.plans.destroy'
    readonly path: '/billing/plans/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.billing.subscriptions.index'
    readonly path: '/billing/subscriptions'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.billing.subscriptions.show'
    readonly path: '/billing/subscriptions/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.billing.transactions.index'
    readonly path: '/billing/transactions'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.billing.transactions.show'
    readonly path: '/billing/transactions/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.institutional'
    readonly path: '/cms/institutional'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.institutional.create'
    readonly path: '/cms/institutional/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.institutional.store'
    readonly path: '/cms/institutional'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.tutorial'
    readonly path: '/cms/tutorial'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.tutorial.create'
    readonly path: '/cms/tutorial/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.tutorial.store'
    readonly path: '/cms/tutorial'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.blog'
    readonly path: '/cms/blog'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.blog.create'
    readonly path: '/cms/blog/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.blog.store'
    readonly path: '/cms/blog'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.support'
    readonly path: '/cms/support'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.support.create'
    readonly path: '/cms/support/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.support.store'
    readonly path: '/cms/support'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.upload.image'
    readonly path: '/cms/upload-image'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.images.index'
    readonly path: '/cms/images'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.images.store'
    readonly path: '/cms/images'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.images.show'
    readonly path: '/cms/images/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.images.update'
    readonly path: '/cms/images/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.images.destroy'
    readonly path: '/cms/images/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.show'
    readonly path: '/cms/:article'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['article']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.edit'
    readonly path: '/cms/:article/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['article']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.update'
    readonly path: '/cms/:article'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['article']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.cms.destroy'
    readonly path: '/cms/:article'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['article']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.companies.blocks'
    readonly path: '/companies/blocks'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.companies.index'
    readonly path: '/companies'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.companies.show'
    readonly path: '/companies/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.companies.blocks.index'
    readonly path: '/companies/:id/blocks'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.companies.blocks.create'
    readonly path: '/companies/:id/blocks/create'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.companies.blocks.store'
    readonly path: '/companies/:id/blocks'
    readonly method: 'post'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.companies.blocks.show'
    readonly path: '/companies/:id/blocks/:blockId'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id', 'blockId']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.companies.publications'
    readonly path: '/companies/:id/publications'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.companies.publications.blocks'
    readonly path: '/companies/:id/publications/blocks'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.companies.users'
    readonly path: '/companies/:id/users'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.index'
    readonly path: '/settings'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.users.index'
    readonly path: '/settings/users'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.users.create'
    readonly path: '/settings/users/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.users.store'
    readonly path: '/settings/users'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.users.show'
    readonly path: '/settings/users/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.users.edit'
    readonly path: '/settings/users/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.users.update'
    readonly path: '/settings/users/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.users.destroy'
    readonly path: '/settings/users/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.categories.index'
    readonly path: '/settings/categories'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.categories.create'
    readonly path: '/settings/categories/create'
    readonly method: 'get'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.categories.store'
    readonly path: '/settings/categories'
    readonly method: 'post'
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.categories.show'
    readonly path: '/settings/categories/:id'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.categories.edit'
    readonly path: '/settings/categories/:id/edit'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.categories.update'
    readonly path: '/settings/categories/:id'
    readonly method: 'put'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'admin.settings.categories.destroy'
    readonly path: '/settings/categories/:id'
    readonly method: 'delete'
    readonly params: {
      readonly required: readonly ['id']
    }
    readonly domain: 'admin.localhost'
  },
  {
    readonly name: 'sac.store'
    readonly path: '/support/sac'
    readonly method: 'post'
    readonly domain: 'root'
  },
  {
    readonly name: 'auth.delete-account'
    readonly path: '/auth/delete-account'
    readonly method: 'delete'
    readonly domain: 'root'
  },
  {
    readonly name: 'auth.forgot_password.index'
    readonly path: '/auth/forgot-password'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'auth.forgot_password.store'
    readonly path: '/auth/forgot-password'
    readonly method: 'post'
    readonly domain: 'root'
  },
  {
    readonly name: 'auth.verify'
    readonly path: '/auth/verify-code'
    readonly method: 'post'
    readonly domain: 'root'
  },
  {
    readonly name: 'auth.reset'
    readonly path: '/auth/reset-password'
    readonly method: 'post'
    readonly domain: 'root'
  },
  {
    readonly name: 'auth.setup_credentials.index'
    readonly path: '/auth/setup-credentials'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'auth.setup_credentials.store'
    readonly path: '/auth/setup-credentials'
    readonly method: 'post'
    readonly domain: 'root'
  },
  {
    readonly name: 'cnpj.bridge'
    readonly path: '/cnpj/:cnpj'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['cnpj']
    }
    readonly domain: 'root'
  },
  {
    readonly name: 'admin.billing.subscriptions.store'
    readonly path: '/billing/subscriptions'
    readonly method: 'post'
    readonly domain: 'root'
  },
  {
    readonly name: 'admin.billing.webhook'
    readonly path: '/payment/webhook'
    readonly method: 'head'
    readonly domain: 'root'
  },
  {
    readonly name: 'billing.index'
    readonly path: '/billing'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'billing.register'
    readonly path: '/billing/register'
    readonly method: 'post'
    readonly domain: 'root'
  },
  {
    readonly name: 'billing.capture.show'
    readonly path: '/billing/capture'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'billing.capture.store'
    readonly path: '/billing/capture'
    readonly method: 'post'
    readonly domain: 'root'
  },
  {
    readonly name: 'billing.redirect'
    readonly path: '/billing/*'
    readonly method: 'head'
    readonly domain: 'root'
  },
  {
    readonly name: 'home'
    readonly path: '/ofertas'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'institutional'
    readonly path: '/'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'policy.privacy'
    readonly path: '/policy/privacy'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'policy.cancel'
    readonly path: '/policy/cancel'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'tou'
    readonly path: '/tou'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'blog.index'
    readonly path: '/blog'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'blog.show'
    readonly path: '/blog/:slug'
    readonly method: 'get'
    readonly params: {
      readonly required: readonly ['slug']
    }
    readonly domain: 'root'
  },
  {
    readonly name: 'tutorials.delete-data'
    readonly path: '/tutorials/delete-data'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'tutorials.delete-account'
    readonly path: '/tutorials/delete-account'
    readonly method: 'get'
    readonly domain: 'root'
  },
  {
    readonly name: 'teste'
    readonly path: '/teste/:message?'
    readonly method: 'get'
    readonly params: {
      readonly optional: readonly ['message']
    }
    readonly domain: 'root'
  },
]
export type Routes = typeof routes
export type Route = Routes[number]
export type RouteWithName = Extract<Route, { name: string }>
export type RouteWithParams = Extract<
  Route,
  { params: { required?: ReadonlyArray<string>; optional?: ReadonlyArray<string> } }
>
export type RouteName = Exclude<RouteWithName['name'], ''>
