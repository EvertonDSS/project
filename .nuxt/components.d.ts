
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)


export const ApostadorForm: typeof import("../components/ApostadorForm.vue")['default']
export const ApostadorResults: typeof import("../components/ApostadorResults.vue")['default']
export const BetResults: typeof import("../components/BetResults.vue")['default']
export const BettingForm: typeof import("../components/BettingForm.vue")['default']
export const CampeonatoForm: typeof import("../components/CampeonatoForm.vue")['default']
export const CampeonatoResults: typeof import("../components/CampeonatoResults.vue")['default']
export const CavaloForm: typeof import("../components/CavaloForm.vue")['default']
export const CavaloResults: typeof import("../components/CavaloResults.vue")['default']
export const FormInput: typeof import("../components/FormInput.vue")['default']
export const FormSelect: typeof import("../components/FormSelect.vue")['default']
export const ListaApostadores: typeof import("../components/ListaApostadores.vue")['default']
export const ModalApostador: typeof import("../components/ModalApostador.vue")['default']
export const NavigationHeader: typeof import("../components/NavigationHeader.vue")['default']
export const RodadaCampeonatoForm: typeof import("../components/RodadaCampeonatoForm.vue")['default']
export const RodadaCampeonatoResults: typeof import("../components/RodadaCampeonatoResults.vue")['default']
export const RodadaForm: typeof import("../components/RodadaForm.vue")['default']
export const RodadaResults: typeof import("../components/RodadaResults.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyApostadorForm: LazyComponent<typeof import("../components/ApostadorForm.vue")['default']>
export const LazyApostadorResults: LazyComponent<typeof import("../components/ApostadorResults.vue")['default']>
export const LazyBetResults: LazyComponent<typeof import("../components/BetResults.vue")['default']>
export const LazyBettingForm: LazyComponent<typeof import("../components/BettingForm.vue")['default']>
export const LazyCampeonatoForm: LazyComponent<typeof import("../components/CampeonatoForm.vue")['default']>
export const LazyCampeonatoResults: LazyComponent<typeof import("../components/CampeonatoResults.vue")['default']>
export const LazyCavaloForm: LazyComponent<typeof import("../components/CavaloForm.vue")['default']>
export const LazyCavaloResults: LazyComponent<typeof import("../components/CavaloResults.vue")['default']>
export const LazyFormInput: LazyComponent<typeof import("../components/FormInput.vue")['default']>
export const LazyFormSelect: LazyComponent<typeof import("../components/FormSelect.vue")['default']>
export const LazyListaApostadores: LazyComponent<typeof import("../components/ListaApostadores.vue")['default']>
export const LazyModalApostador: LazyComponent<typeof import("../components/ModalApostador.vue")['default']>
export const LazyNavigationHeader: LazyComponent<typeof import("../components/NavigationHeader.vue")['default']>
export const LazyRodadaCampeonatoForm: LazyComponent<typeof import("../components/RodadaCampeonatoForm.vue")['default']>
export const LazyRodadaCampeonatoResults: LazyComponent<typeof import("../components/RodadaCampeonatoResults.vue")['default']>
export const LazyRodadaForm: LazyComponent<typeof import("../components/RodadaForm.vue")['default']>
export const LazyRodadaResults: LazyComponent<typeof import("../components/RodadaResults.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
