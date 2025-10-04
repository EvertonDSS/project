
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

interface _GlobalComponents {
      'ApostadorForm': typeof import("../../components/ApostadorForm.vue")['default']
    'ApostadorResults': typeof import("../../components/ApostadorResults.vue")['default']
    'BetResults': typeof import("../../components/BetResults.vue")['default']
    'BettingForm': typeof import("../../components/BettingForm.vue")['default']
    'CampeonatoForm': typeof import("../../components/CampeonatoForm.vue")['default']
    'CampeonatoResults': typeof import("../../components/CampeonatoResults.vue")['default']
    'CavaloForm': typeof import("../../components/CavaloForm.vue")['default']
    'CavaloResults': typeof import("../../components/CavaloResults.vue")['default']
    'FormInput': typeof import("../../components/FormInput.vue")['default']
    'FormSelect': typeof import("../../components/FormSelect.vue")['default']
    'FormSelectSearchable': typeof import("../../components/FormSelectSearchable.vue")['default']
    'ListaApostadores': typeof import("../../components/ListaApostadores.vue")['default']
    'ModalAdicionarRodada': typeof import("../../components/ModalAdicionarRodada.vue")['default']
    'ModalApostador': typeof import("../../components/ModalApostador.vue")['default']
    'ModalGerenciarCavalos': typeof import("../../components/ModalGerenciarCavalos.vue")['default']
    'ModalSelecaoRodada': typeof import("../../components/ModalSelecaoRodada.vue")['default']
    'ModalTipoRodada': typeof import("../../components/ModalTipoRodada.vue")['default']
    'NavigationHeader': typeof import("../../components/NavigationHeader.vue")['default']
    'RodadaCampeonatoForm': typeof import("../../components/RodadaCampeonatoForm.vue")['default']
    'RodadaCampeonatoResults': typeof import("../../components/RodadaCampeonatoResults.vue")['default']
    'RodadaForm': typeof import("../../components/RodadaForm.vue")['default']
    'RodadaResults': typeof import("../../components/RodadaResults.vue")['default']
    'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyApostadorForm': LazyComponent<typeof import("../../components/ApostadorForm.vue")['default']>
    'LazyApostadorResults': LazyComponent<typeof import("../../components/ApostadorResults.vue")['default']>
    'LazyBetResults': LazyComponent<typeof import("../../components/BetResults.vue")['default']>
    'LazyBettingForm': LazyComponent<typeof import("../../components/BettingForm.vue")['default']>
    'LazyCampeonatoForm': LazyComponent<typeof import("../../components/CampeonatoForm.vue")['default']>
    'LazyCampeonatoResults': LazyComponent<typeof import("../../components/CampeonatoResults.vue")['default']>
    'LazyCavaloForm': LazyComponent<typeof import("../../components/CavaloForm.vue")['default']>
    'LazyCavaloResults': LazyComponent<typeof import("../../components/CavaloResults.vue")['default']>
    'LazyFormInput': LazyComponent<typeof import("../../components/FormInput.vue")['default']>
    'LazyFormSelect': LazyComponent<typeof import("../../components/FormSelect.vue")['default']>
    'LazyFormSelectSearchable': LazyComponent<typeof import("../../components/FormSelectSearchable.vue")['default']>
    'LazyListaApostadores': LazyComponent<typeof import("../../components/ListaApostadores.vue")['default']>
    'LazyModalAdicionarRodada': LazyComponent<typeof import("../../components/ModalAdicionarRodada.vue")['default']>
    'LazyModalApostador': LazyComponent<typeof import("../../components/ModalApostador.vue")['default']>
    'LazyModalGerenciarCavalos': LazyComponent<typeof import("../../components/ModalGerenciarCavalos.vue")['default']>
    'LazyModalSelecaoRodada': LazyComponent<typeof import("../../components/ModalSelecaoRodada.vue")['default']>
    'LazyModalTipoRodada': LazyComponent<typeof import("../../components/ModalTipoRodada.vue")['default']>
    'LazyNavigationHeader': LazyComponent<typeof import("../../components/NavigationHeader.vue")['default']>
    'LazyRodadaCampeonatoForm': LazyComponent<typeof import("../../components/RodadaCampeonatoForm.vue")['default']>
    'LazyRodadaCampeonatoResults': LazyComponent<typeof import("../../components/RodadaCampeonatoResults.vue")['default']>
    'LazyRodadaForm': LazyComponent<typeof import("../../components/RodadaForm.vue")['default']>
    'LazyRodadaResults': LazyComponent<typeof import("../../components/RodadaResults.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
