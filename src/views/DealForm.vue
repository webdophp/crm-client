<template>
    <v-container class="align-left" :style="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '' : 'float:left;max-width: 95%'">
        <v-row dense>
            <v-col cols="12" class="px-0 mx-0 title_header">
                {{ $t('deal_number_head', {'number': number}) }}
            </v-col>
        </v-row>
        <v-row >
            <v-col cols="12" class="px-0 mx-0 pt-5">
                <v-card flat class="background_color_transparent px-0 mx-0">
                    <v-container class="px-0 mx-0">
                        <v-row>
                            <v-col cols="12" sm="4"
                                   :class="($vuetify.breakpoint.xsOnly  ) ? '' : 'd-flex justify-start'"
                                   class="my-0 py-0" v-if="author && author.name">
                                <v-list class="my-0 py-0 background_color_transparent">
                                    <v-list-item class="mx-0 px-0">
                                        <v-list-item-avatar :size="$vuetify.breakpoint.xsOnly ? 61 : 51" class="mr-4 border1_B3B3B3" >
                                            <img :src="author.photo" v-if="author.photo"/>
                                            <v-icon v-else class="color_B3B3B3" size="20">
                                                ${{'settingsIcon'}}
                                            </v-icon>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title class="deal_title pb-1" v-text="author.name"></v-list-item-title>
                                            <v-list-item-subtitle class="deal_text" v-text="author.phone"></v-list-item-subtitle>
                                        </v-list-item-content>

                                    </v-list-item>
                                </v-list>
                            </v-col>
                            <v-col cols="12" sm="6"
                                   :class="($vuetify.breakpoint.xsOnly  ) ? 'pl-4' : 'mx-0 px-0 d-flex justify-center'"
                                   class=" my-0 py-0 deal_col_50" v-if="company && company.name">
                                <v-list class="my-0 py-0 background_color_transparent">
                                    <v-list-item class="mx-0 px-0">

                                        <v-list-item-content>
                                            <v-list-item-title class="deal_title pb-1" v-text="company.name"></v-list-item-title>
                                            <v-list-item-subtitle class="deal_text" v-text="company.bin_iin"></v-list-item-subtitle>
                                        </v-list-item-content>

                                    </v-list-item>

                                </v-list>
                            </v-col>
                            <v-col cols="12" sm="2"
                                   :class="($vuetify.breakpoint.xsOnly ) ? '' : 'd-flex justify-end align-right'"
                                   class="my-0 py-0 deal_col_50" v-if="created_at">
                                <v-list class="my-0 py-0 background_color_transparent">
                                    <v-list-item class="mx-0 px-0">
                                        <v-list-item-content>
                                            <v-list-item-title class="deal_title pb-1 text-right" v-text="$moment(created_at).format('DD.MM.YYYY') "></v-list-item-title>
                                            <v-list-item-subtitle class="deal_text text-right" v-text="$t('date_created')"></v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>

                        <v-row v-if="dealOrderItems.length > 0">
                            <v-col cols="12" class="pt-5">
                                <v-divider
                                    style="max-width: 100%; border-top: solid 1px #B3B3B3"
                                    size="2"
                                    class="mx-0 px-0 my-0 py-0"
                                ></v-divider>
                            </v-col>
                        </v-row>
                        <v-row v-if="dealOrderItems.length > 0">
                            <v-col cols="12" class="my-0 py-0">
                                <v-data-table :headers="headers" :items="dealOrderItems" :loading="loadingDealOrders" :locale="lang"
                                              :loading-text="$t('loading_please_wait')"
                                              class="elevation-0 px-0 mx-0 padding_0_tr_1 heightTable tableDealOrder"
                                              hide-default-footer

                                              :hide-default-header="(!$vuetify.breakpoint.xsOnly)"
                                              :item-class="rowClass"

                                >
                                    <template v-slot:header="{ props: { headers } }" v-if="(!$vuetify.breakpoint.xsOnly)">
                                        <thead>
                                        <tr >
                                            <th v-for="h in headers" :key="h.value" class="table_header">
                                                <span>{{h.text}}</span>
                                            </th>
                                        </tr>
                                        </thead>
                                    </template>
                                    <template v-slot:item.name="{ item, index }" >
                                        <div class="deal_text_order_tab">{{item.name}}</div>
                                    </template>
                                    <template v-slot:item.count="{ item, index }" >
                                        <span class="deal_text_order_tab">{{item.count}}</span>
                                    </template>
                                    <template v-slot:item.price="{ item, index }" >
                                           <span class="deal_text_order_tab">{{item.price}} {{item.currency}}</span>
                                    </template>

                                    <template v-slot:item.discount="{ item, index }">
                                         <span class="deal_text_order_tab">{{item.discount}} {{item.currency}}</span>
                                    </template>

                                    <template v-slot:item.extra_charge="{ item, index }">
                                        <span class="deal_text_order_tab">{{item.extra_charge}} {{item.currency}}</span>
                                    </template>

                                    <template v-slot:item.total="{ item }">

                                        <div v-if="item.total === item.total_usd" class="font-size-12">
                                            {{item.total}} {{item.currency}}
                                        </div>
                                        <div v-if="item.total !== item.total_usd" class="font-size-12" style="position: relative" >
                                            {{item.total}} {{item.currency}}
                                            <div style="position: absolute;right: 0;" class="font-size-11 font-weight-400 color_B3B3B3">{{item.total_usd}} $</div>
                                        </div>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <v-row v-if="dealOrderItems.length > 0">
                            <v-col cols="12" class="my-0 py-2">
                                <v-row class="mx-0 px-0 ">
                                    <v-col cols="12" sm="8" v-if="!$vuetify.breakpoint.xsOnly">

                                    </v-col>
                                    <v-col cols="12" sm="4" class=" mb-6" :class="!$vuetify.breakpoint.xsOnly ? 'my-1' : ''">
                                        <v-row class="rounded-lg py-5 px-4 color_333333" style="background-color: #CDDAE1">
                                           <div class="deal_title width_100 py-2">
                                               <div class="float-left text-right font-weight-400" style="width: 52%">{{$t('total_amount_without_vat')}}</div>
                                               <div class="float-right">{{deal_order_no_nds_total}} $</div>
                                           </div>
                                            <div class="deal_title width_100">
                                                <div class="float-left text-right font-weight-400" style="width: 52%">{{$t('total_amount_vat')}}</div>
                                                <div class="float-right"> {{ deal_order_nds_total }} $</div>
                                            </div>
                                            <div class="deal_title width_100 py-2">
                                                <div class="float-left text-right font-weight-400" style="width: 52%">{{$t('to_be_paid')}}</div>
                                                <div class="float-right "> {{deal_order_total}} $</div>
                                            </div>

                                        </v-row>
                                    </v-col>



                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row v-if="trackings.length > 0">
                            <v-col cols="12" class="pt-5">
                                <v-divider
                                    style="max-width: 100%; border-top: solid 1px #B3B3B3"
                                    size="2"
                                    class="mx-0 px-0 my-0 py-0"
                                ></v-divider>
                            </v-col>
                        </v-row>
                        <v-row v-if="trackings.length > 0">
                            <v-col cols="12" class="py-0 my-3 deal_title_section">
                                {{$t('transaction_tracking')}}
                            </v-col>
                            <v-col cols="12" class="my-0 py-0 pt-5">
                                <v-card flat class="background_color_transparent">
                                    <v-card
                                        elevation="0"
                                        :hover="true"
                                        v-for="(item, i) in trackings"
                                        :key="'tracking_'+i"
                                        class="mb-7 rounded-lg"
                                        :class="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly) ? 'text-center' :''"
                                        @click="showDetailsApplication(item)"
                                        color="#F5F5F5"

                                    >

                                        <v-card-text class="px-0 py-0">

                                            <v-row class="px-5 pb-2">
                                                <v-col cols="12" sm="4" :class="$vuetify.breakpoint.xsOnly ? 'text-left deal_col_50' : ''">
                                                    <div class="mb-4 deal_title">
                                                        <div class="deal_text mb-1">{{$t('date_created')}}</div>
                                                        {{ item.date_operation ? $moment(item.date_operation).format('DD.MM.YYYY') : '' }}
                                                    </div>
                                                    <div class="mb-2 deal_title">
                                                        <div class="deal_text mb-1">{{$t('container_number')}}</div>
                                                        {{item.container_number ? item.container_number : $t('no_data') }}
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" sm="8" :class="$vuetify.breakpoint.xsOnly ? 'text-right deal_col_50' : ''">
                                                    <div class="mb-4 deal_title">
                                                        <div class="deal_text mb-1">{{$t('direction')}}</div>
                                                        {{item.departure}} - {{item.destination}}
                                                    </div>
                                                    <div v-if="item.day > 0" class="deal_title">
                                                        <div class="deal_text mb-1">{{$t('in_operation_for')}}</div>
                                                        {{ $t('for_day', {"day":item.day})}}
                                                    </div>

                                                    <div v-if="false" class="font-montserrat font-size-14 font-weight-600 color_333333 mb-2">
                                                        <div class="font-size-11 font-weight-400 color_B3B3B3">{{$t('direction')}}</div>
                                                        {{item.departure}} - {{item.destination}}
                                                        <v-icon v-if="item.type_transport_slug === 'air_carriers'" :title="item.type_transport" class="mb-2 icon_width" color="primary">${{'airCarriersIcon'}}</v-icon>
                                                        <v-icon v-else-if="item.type_transport_slug === 'road_transport'" :title="item.type_transport" class="mb-2 icon_width" color="primary">${{'roadTransportIcon'}}</v-icon>
                                                        <v-icon v-else-if="item.type_transport_slug === 'railway_transportation'" :title="item.type_transport" class="mb-2 icon_width" color="primary">${{'railwayTransportationIcon'}}</v-icon>
                                                        <v-icon v-else-if="item.type_transport_slug === 'sea_transportation'" :title="item.type_transport" class="mb-2 icon_width" color="primary">${{'seaTransportationIcon'}}</v-icon>
                                                    </div>

                                                </v-col>
                                                <v-col cols="12" v-if="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly)">
                                                    <v-btn type="button"
                                                           outlined
                                                           color="primary"
                                                           class="rounded-lg but_enter"
                                                           block
                                                           :height="$vuetify.breakpoint.xsOnly ? 45 : 35">
                                                        {{ $t('details') }}
                                                    </v-btn>
                                                </v-col>
                                                <v-col cols="12" class="pb-7" v-if="!($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly)">
                                                    <v-row >
                                                        <v-col cols="12">
                                                            <ul class="pod_status d-flex">
                                                                <template v-for="(status_item, i) in statusItems"  >
                                                                    <li :key="'status'+status_item.id" class="li1"><div class="node " :class="item.status_id >= status_item.id ? 'blue_point' : 'grey_point'"></div><p :class="(i+1) === statusItems.length ? 'li_last' : ''"><span :class="item.status_id >= status_item.id ? 'blue_color' : ''" >{{status_item.name}}</span></p></li>
                                                                    <li :key="'status'+status_item.id + '-' + status_item.id" v-if="(i+1) !== statusItems.length" class="my_divider " :class="item.status_id > status_item.id ? 'blue_line' : 'grey_line'">
                                                                   </li>
                                                                </template>
                                                            </ul>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>

                                            </v-row>

                                            <v-row v-if="item.show"
                                                   :class="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly) ? 'elevation-0' :'elevation-2 rounded-lg'"
                                                   class="info_open  py-0 my-0 mx-0 px-0" >
                                                 <v-col cols="12">
                                                     <div class="close"><v-icon @click="close_info(item)">mdi-close-circle-outline</v-icon></div>
                                                     <div class="font-size-12 font-montserrat font-primary font-weight-600 text_left">{{$t('more_application')}}</div>
                                                     <div class="mt-2 text_left">
                                                        <v-chip  v-for="(item, z) in data_info" :key="'data_info'+z"
                                                                 small
                                                                 class="mr-2 font-size-11"
                                                                 :class="item.class"
                                                                 :color="item.color"
                                                                 label
                                                                 outlined
                                                                 @click="show_info(item.type)"
                                                        >{{item.name}}</v-chip>
                                                    </div>
                                                </v-col>
                                                <v-col cols="12" v-if="info_type==='data'">
                                                    <v-row v-if="false">
                                                        <v-col cols="12">
                                                            <ul style="display: flex;padding:0 0 0 0 !important;">
                                                                <template v-for="(item, i) in sub_statusItems[0]"  >
                                                                    <li :key="item.id"><div class="node blue_point"></div><p :class="(i+1) === sub_statusItems[0].length ? 'li_last' : ''">{{item.name}}</p></li>
                                                                    <li :key="item.name" v-if="(i+1) !== sub_statusItems[0].length"><div class="divider blue_line" style="width: 200px !important;"></div></li>
                                                                </template>
                                                            </ul>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col cols="12" lg="4" md="6" :class="$vuetify.breakpoint.mdOnly ? 'pt-5 pb-3 px-5' : 'py-5 px-5'">
                                                            <v-row>
                                                                <v-col cols="12" class="py-0 deal_in_detail"><b>{{ $t('application_number') }}:</b> {{ item.number ? item.number :  $t('no_data')  }}</v-col>
                                                                <v-col cols="12" class="py-0 deal_in_detail"><b>{{ $t('container_number') }}:</b> {{ item.container_number ? item.container_number :  $t('no_data')  }}</v-col>
                                                                <v-col cols="12" class="py-0 deal_in_detail"><b>{{ $t('departures') }}:</b> {{ item.departure ? item.departure :  $t('no_data')  }}</v-col>
                                                                <v-col cols="12" class="py-0 deal_in_detail"><b>{{ $t('destination') }}:</b> {{ item.destination ? item.destination :  $t('no_data')  }}</v-col>

                                                                <v-col cols="12" class="py-0 deal_in_detail"><b>{{ $t('type_container') }}:</b> {{ item.type_container ? item.type_container :  $t('no_data')  }}</v-col>
                                                                <v-col cols="12" class="py-0 deal_in_detail"><b>{{ $t('type_transportation') }}:</b> {{ item.type_transport ? item.type_transport :  $t('no_data')  }}</v-col>
                                                            </v-row>
                                                        </v-col>
                                                        <v-col cols="12" lg="4" md="6" :class="$vuetify.breakpoint.mdOnly ? 'pt-5 pb-3 px-5' : 'py-5 px-5'">
                                                            <v-row>
                                                                <v-col cols="12" class="py-0 deal_in_detail"><b>{{ $t('download_type') }}:</b> {{ (item.loading_type && item.loading_type.name) ? item.loading_type.code +' '+ item.loading_type.name :  $t('no_data')  }}</v-col>
                                                                <v-col cols="12" class="py-0 deal_in_detail"><b>{{ $t('application_date') }}:</b> {{ item.created_at ? $moment(item.created_at).format('YYYY-MM-DD HH:mm') : $t('no_data')  }}</v-col>
                                                                <v-col cols="12" class="py-0 deal_in_detail"><b>{{ $t('date_operation') }}:</b> {{ item.date_operation  ? $moment(item.date_operation).format('YYYY-MM-DD HH:mm') : $t('no_data')  }}</v-col>
                                                                <v-col cols="12" class="py-0 deal_in_detail"><b>{{ $t('date_of_arrival_at_the_border') }}:</b> {{ item.date_of_arrival_at_border ? $moment(item.date_of_arrival_at_border).format('YYYY-MM-DD HH:mm') :  $t('no_data')  }}</v-col>
                                                                <v-col cols="12" class="py-0 deal_in_detail"><b>{{ $t('arrival_date_at_destination') }}:</b> {{ item.arrival_date_at_destination ? $moment(item.arrival_date_at_destination).format('YYYY-MM-DD HH:mm') :  $t('no_data')  }}</v-col>

                                                            </v-row>
                                                        </v-col>
                                                        <v-col cols="12" :lg="$vuetify.breakpoint.mdOnly ? 12 : 4" :md="$vuetify.breakpoint.mdOnly ? 12 : 6" :class="$vuetify.breakpoint.mdOnly ? 'pb-5 px-5' : 'py-5 px-5'">
                                                            <v-row>
                                                                <v-col cols="12"  md="6" lg="12" class="py-0 deal_in_detail"><b>{{ $t('application_status') }} :</b> {{ item.status ? item.status :  $t('no_data')  }}</v-col>
                                                                <v-col cols="12"  md="6" lg="12" class="py-0 deal_in_detail"><b>{{ $t('distance_to_destination') }}:</b> {{ item.distance_to_destination ? item.distance_to_destination :  $t('no_data')  }}</v-col>
                                                                <v-col cols="12"  md="6" lg="12" class="py-0 deal_in_detail"><b>{{ $t('delivered') }}:</b> {{ item.paid == true ? $t('yes') :  $t('no')  }}</v-col>
                                                                <v-col cols="12"  md="6" lg="12" class="py-0 deal_in_detail"><b>{{ $t('company') }}:</b> {{ item.company && item.company.name ? item.company.name  :  $t('no_data')  }}</v-col>
                                                                <v-col cols="12"  md="6" lg="12" class="py-0 deal_in_detail"><b>{{ $t('bin_iin') }}:</b> {{ item.company && item.company.bin_iin ?  item.company.bin_iin :  $t('no_data')  }}</v-col>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>

                                                <v-col cols="12" v-if="info_type==='tracking'">
                                                    <v-row>
                                                        <v-col cols="12" class="mt-2">
                                                            <v-row>
                                                                <v-col cols="12" md="4">
                                                                    <ul class="station">

                                                                        <li v-if="tracking_geo.from">
                                                                            <div class="node blue_point" ></div>
                                                                            <p class="font-primary text_left">{{tracking_geo.from.name}} <span>{{tracking_geo.from.date_operation}}</span></p>
                                                                        </li>
                                                                        <li><div class="divider blue_line"></div></li>

                                                                        <template v-for="(item, t) in tracking_geo.tracking"  >
                                                                            <li :key="'geo'+item.id" class="text_left">
                                                                                <div class="node blue_point"></div>
                                                                                <p class="font-primary text_left">{{item.name}}<span>{{item.date_operation}}</span></p>
                                                                            </li>
                                                                            <li :key="'geo'+item.name"><div :class="(t+1)===tracking_geo.tracking.length ? 'grey_line' : 'blue_line'" class="divider"></div></li>
                                                                        </template>


                                                                        <li v-if="tracking_geo.to">
                                                                            <div class="node grey_point"></div>
                                                                            <p class="font-primary text_left">{{tracking_geo.to.name}} <span>{{tracking_geo.to.date_operation}}</span></p>
                                                                        </li>






                                                                    </ul>

                                                                </v-col>
                                                                <v-col cols="12" md="8">
                                                                    <div style="height: 310px">
                                                                        <yandex-map class="py-0 my-0" v-if="coords && showMap" ref="map"
                                                                                    :coords="coords"
                                                                                    :controls="[]"
                                                                                    :show-all-markers="showAllMarkers"
                                                                                    :zoom="zoom"
                                                                                    @map-was-initialized="initHandler"
                                                                                    style="background-color: #ffffff">
                                                                        </yandex-map>
                                                                    </div>
                                                                </v-col>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>



                                        </v-card-text>
                                    </v-card>

                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row v-if="(documents.length > 0 || topicItems.length > 0)">
                            <v-col cols="12" class="pt-5">
                                <v-divider
                                    style="max-width: 100%; border-top: solid 1px #B3B3B3"
                                    size="2"
                                    class="mx-0 px-0 my-0 py-0"
                                ></v-divider>
                            </v-col>
                        </v-row>
                        <v-row v-if="(documents.length > 0)">
                            <v-col cols="12" class="py-0 my-3 deal_title_section">
                                {{$t('attached_documents')}}
                            </v-col>
                            <v-col cols="12" class="my-0 py-0">
                                <v-list class="background_color_transparent">
                                    <template v-for="(item, index) in documents">
                                        <v-list-item
                                            :key="item.uuid"
                                            class="cursor-pointer mx-0 px-0 my-0 py-0"
                                            @click="downloadFile(item.download)"
                                        >
                                            <v-list-item-avatar left height="40" width="20">
                                                <v-icon color="primary" left size="25" class="ml-0 pl-0">
                                                    ${{'StoragesIcon'}}
                                                </v-icon>
                                            </v-list-item-avatar>
                                            <v-list-item-content class="py-0 my-0">
                                                <v-list-item-title class="py-0 my-0 deal_title font-weight-400" v-text="item.name "></v-list-item-title>
                                                <v-list-item-subtitle class="py-0 my-0 mt-1 deal_text" v-text="(item.size / 1000).toFixed(1) + ' KB'"></v-list-item-subtitle>
                                            </v-list-item-content>

                                        </v-list-item>

                                    </template>
                                    <template v-for="(item, index) in invoices">
                                        <v-list-item
                                            :key="item.uuid"
                                            class="cursor-pointer mx-0 px-0 my-0 py-0"
                                            @click="downloadFile(item.request_scanned)"
                                        >
                                            <v-list-item-avatar left height="40" width="20">
                                                <v-icon color="primary" left size="25" class="ml-0 pl-0">
                                                    ${{'StoragesIcon'}}
                                                </v-icon>
                                            </v-list-item-avatar>
                                            <v-list-item-content class="py-0 my-0">
                                                <v-list-item-title class="py-0 my-0 deal_title font-weight-400" v-html="item.request_scanned.file_name "></v-list-item-title>
                                                <v-list-item-subtitle class="py-0 my-0 mt-1 deal_text" v-html="(item.request_scanned.size / 1000).toFixed(1) + ' KB'"></v-list-item-subtitle>
                                            </v-list-item-content>

                                        </v-list-item>

                                    </template>
                                </v-list>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" class="pt-5">
                                <v-divider
                                    style="max-width: 100%; border-top: solid 1px #B3B3B3"
                                    size="2"
                                    class="mx-0 px-0 my-0 py-0"
                                ></v-divider>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" class="py-0 my-3 deal_title_section">
                                {{$t('chat_deals')}}
                            </v-col>
                            <v-col class=" my-0 py-0">
                                <v-list two-line class="background_color_transparent">
                                    <v-list-item-group
                                        v-model="selected"
                                        class="my-0"
                                    >

                                        <v-list-item
                                            v-for="(item, i) in topicItems"
                                            :key="i"


                                            :class="'rounded-lg  ' + item.class + ' ' + ($vuetify.breakpoint.xsOnly ? 'pl-15' : 'px-3')"
                                            class="mb-5 height_list_item"
                                            @click="openChat(item)"
                                        >
                                            <template v-slot:default="{ active }">
                                                <v-app-bar
                                                    elevation="0"
                                                    absolute
                                                    class="my-5 py-0"
                                                    height="0"
                                                    v-if="!($vuetify.breakpoint.xsOnly)"
                                                >
                                                    <v-spacer></v-spacer>
                                                    <v-icon class="icon_width " v-if="item.active">${{'lockOpenIcon'}}</v-icon>
                                                    <v-icon v-else  class="icon_width">${{'lockIcon'}}</v-icon>

                                                </v-app-bar>
                                                <v-list-item-avatar size="58" class="border1_B3B3B3"   v-if="!($vuetify.breakpoint.xsOnly)">
                                                    <img v-if="item.last_user.photo " :src="item.last_user.photo" >
                                                    <v-icon v-else  size="26" class="color_B3B3B3">
                                                        ${{'settingsIcon'}}
                                                    </v-icon>
                                                </v-list-item-avatar>



                                                <v-list-item-content class="ml-6 topic_padding_top0">
                                                    <v-row v-if="($vuetify.breakpoint.xsOnly)" class="my-0 py-0">
                                                        <v-col cols="12" style="position: absolute;top:3px;left:-3px">
                                                            <v-avatar size="58" class="border1_B3B3B3" >
                                                                <img v-if="item.last_user.photo " :src="item.last_user.photo" >
                                                                <v-icon v-else  size="26" class="color_B3B3B3">
                                                                    ${{'settingsIcon'}}
                                                                </v-icon>
                                                            </v-avatar>
                                                        </v-col>
                                                        <v-col cols="12" style="position: absolute; bottom: 3px; left: 12px">
                                                            <v-icon class="icon_width" size="35" v-if="item.active">${{'lockOpenIcon'}}</v-icon>
                                                            <v-icon v-else size="50" class="icon_width">${{'lockIcon'}}</v-icon>

                                                        </v-col>
                                                    </v-row>
                                                    <v-row class="topic_margin_top0">
                                                        <v-col cols="12"  md="4" sm="4" lg="6" class="padding_top10_bottom0" >
                                                            <v-list-item-title class="topic_title" v-text="item.title"></v-list-item-title>
                                                            <v-list-item-subtitle
                                                                style="max-width: 400px"
                                                                :class="item.bot ? 'topic_text_bot' : 'topic_text'"
                                                                v-if="(item.last_message && item.last_message.type && item.last_message.type==='text') ">
                                                                <span class="font-weight-700">{{item.last_user.my ? $t('from_you') :  $t('from_name', {"name": item.last_user.name})}}</span>
                                                                {{ item.last_message.value }}

                                                            </v-list-item-subtitle>
                                                            <v-list-item-subtitle
                                                                style="max-width: 400px"
                                                                :class="item.bot ? 'topic_text_bot' : 'topic_text'"
                                                                v-if="(item.last_message && item.last_message.type && item.last_message.type==='file') ">
                                                                <span class="font-weight-700">{{item.last_user.my ? $t('from_you') :  $t('from_name', {"name": item.last_user.name})}}</span>
                                                                {{item.last_message.file_name}}
                                                            </v-list-item-subtitle>
                                                            <v-list-item-subtitle
                                                                style="max-width: 400px"
                                                                :class="item.bot ? 'topic_text_bot' : 'topic_text'"
                                                                v-if="(item.last_message && item.last_message.type && item.last_message.type==='image') ">
                                                <span class="font-weight-700">{{item.last_user.my ? $t('from_you') :  $t('from_name', {"name": item.last_user.name})}}
                                                    <v-img max-width="100" :src="item.last_message.value ? item.last_message.value : userAvatar" ></v-img>
                                                </span>
                                                            </v-list-item-subtitle>
                                                        </v-col>
                                                        <v-col cols="12"  md="4" sm="4" lg="3" class="padding_top10_bottom0">
                                                            <v-list-item-title class="topic_text">
                                                                {{$t('last_message')}}
                                                            </v-list-item-title>
                                                            <v-list-item-subtitle class="topic_title">
                                                                {{item.last_date}}
                                                            </v-list-item-subtitle>
                                                        </v-col>
                                                        <v-col cols="12" md="4" sm="4" lg="3" class="padding_top10_bottom0">
                                                            <v-list-item-title class="topic_text">
                                                                {{$t('application_status')}}
                                                            </v-list-item-title>
                                                            <v-list-item-subtitle class="topic_title" >
                                                                {{item.bot ? $t('system_message') : (item.active ? $t('open_application') : $t('closed_application')) }}
                                                            </v-list-item-subtitle>
                                                        </v-col>
                                                    </v-row>


                                                </v-list-item-content>

                                            </template>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </v-col>
                        </v-row>
                    </v-container>


                   </v-card>
            </v-col>
        </v-row>

        <v-dialog
            v-model="dialogDetailTracking"
            :width="!$vuetify.breakpoint.xsOnly ? 700 : '100%'"
            overlay-color = "#edebeb"
            :content-class="!$vuetify.breakpoint.xsOnly ? 'rounded-lg border1_B3B3B3' : ''"
            transition="dialog-bottom-transition"

            :fullscreen="$vuetify.breakpoint.xsOnly"
            :hide-overlay="$vuetify.breakpoint.xsOnly"
            :scrollable="$vuetify.breakpoint.xsOnly"

        >
            <v-card>
                    <v-card-title class="deal_dialog_padding">
                        <v-row class="mx-0 px-0 py-0 my-0">
                            <v-col cols="12" class="mx-0 px-0 py-0 my-0">
                                <div class="close"><v-icon size="35" @click="close_info(detail_tracking)">${{'closeIcon'}}</v-icon></div>
                                <div class="deal_title_section mb-4">{{$t('more_application')}}</div>
                                <div class="text_left">
                                        <v-chip  v-for="(item, z) in data_info" :key="'data_info'+z"
                                                 small
                                                 class="mr-2 font-size-11"
                                                 :class="item.class"
                                                 :color="item.color"
                                                 label
                                                 outlined
                                                 @click="show_info(item.type)"
                                        >{{item.name}}</v-chip>
                                    </div>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-card-text class="mx-0 px-0 py-0 my-0">
                        <v-row class="mx-0 px-0 py-0 my-0">
                            <v-col cols="12" class="deal_dialog_padding pt-0"  v-if="info_type==='data'">
                                <v-row class="mx-0 px-0 py-0 my-0">
                                    <v-col cols="12" md="6" class="mx-0 px-0 py-0 my-0">
                                        <v-row class="mx-0 px-0 py-0 my-0">
                                            <v-col cols="12" class="deal_in_detail"><b>{{ $t('application_number') }}:</b> {{ detail_tracking.number ? detail_tracking.number :  $t('no_data')  }}</v-col>
                                            <v-col cols="12" class="deal_in_detail"><b>{{ $t('container_number') }}:</b> {{ detail_tracking.container_number ? detail_tracking.container_number :  $t('no_data')  }}</v-col>
                                            <v-col cols="12" class="deal_in_detail"><b>{{ $t('departures') }}:</b> {{ detail_tracking.departure ? detail_tracking.departure :  $t('no_data')  }}</v-col>
                                            <v-col cols="12" class="deal_in_detail"><b>{{ $t('destination') }}:</b> {{ detail_tracking.destination ? detail_tracking.destination :  $t('no_data')  }}</v-col>
                                            <v-col cols="12" class="deal_in_detail"><b>{{ $t('type_container') }}:</b> {{ detail_tracking.type_container ? detail_tracking.type_container :  $t('no_data')  }}</v-col>
                                            <v-col cols="12" class="deal_in_detail"><b>{{ $t('type_transportation') }}:</b> {{ detail_tracking.type_transport ? detail_tracking.type_transport :  $t('no_data')  }}</v-col>
                                            <v-col cols="12" class="deal_in_detail"><b>{{ $t('download_type') }}:</b> {{ (detail_tracking.loading_type && detail_tracking.loading_type.name) ? detail_tracking.loading_type.code +' '+ detail_tracking.loading_type.name :  $t('no_data')  }}</v-col>
                                            <v-col cols="12" class="deal_in_detail"><b>{{ $t('application_date') }}:</b> {{ detail_tracking.created_at ? $moment(detail_tracking.created_at).format('YYYY-MM-DD HH:mm') : $t('no_data')  }}</v-col>

                                        </v-row>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-row>
                                           <v-col cols="12" class="deal_in_detail"><b>{{ $t('date_operation') }}:</b> {{ detail_tracking.date_operation  ? $moment(detail_tracking.date_operation).format('YYYY-MM-DD HH:mm') : $t('no_data')  }}</v-col>
                                            <v-col cols="12" class="deal_in_detail"><b>{{ $t('date_of_arrival_at_the_border') }}:</b> {{ detail_tracking.date_of_arrival_at_border ? $moment(detail_tracking.date_of_arrival_at_border).format('YYYY-MM-DD HH:mm') :  $t('no_data')  }}</v-col>
                                            <v-col cols="12" class="deal_in_detail"><b>{{ $t('arrival_date_at_destination') }}:</b> {{ detail_tracking.arrival_date_at_destination ? $moment(detail_tracking.arrival_date_at_destination).format('YYYY-MM-DD HH:mm') :  $t('no_data')  }}</v-col>
                                            <v-col cols="12"  md="6" lg="12" class="deal_in_detail"><b>{{ $t('application_status') }} :</b> {{ detail_tracking.status ? detail_tracking.status :  $t('no_data')  }}</v-col>
                                            <v-col cols="12"  md="6" lg="12" class="deal_in_detail"><b>{{ $t('distance_to_destination') }}:</b> {{ detail_tracking.distance_to_destination ? detail_tracking.distance_to_destination :  $t('no_data')  }}</v-col>
                                            <v-col cols="12"  md="6" lg="12" class="deal_in_detail"><b>{{ $t('delivered') }}:</b> {{ detail_tracking.paid == true ? $t('yes') :  $t('no')  }}</v-col>
                                            <v-col cols="12"  md="6" lg="12" class="deal_in_detail"><b>{{ $t('company') }}:</b> {{ detail_tracking.company && detail_tracking.company.name ? detail_tracking.company.name  :  $t('no_data')  }}</v-col>
                                            <v-col cols="12"  md="6" lg="12" class="deal_in_detail"><b>{{ $t('bin_iin') }}:</b> {{ detail_tracking.company && detail_tracking.company.bin_iin ?  detail_tracking.company.bin_iin :  $t('no_data')  }}</v-col>

                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" v-if="info_type==='tracking'">
                                <v-row>
                                    <v-col cols="12" class="rounded-lg" style="background-color: #CDDAE1">
                                        <v-row>
                                            <v-col cols="12" md="4" >
                                                <ul class="station">
                                                    <li v-if="tracking_geo.from">
                                                        <div class="node blue_point" ></div>
                                                        <p class="font-primary text_left">{{tracking_geo.from.name}} <span>{{tracking_geo.from.date_operation}}</span></p>
                                                    </li>
                                                    <li><div class="divider blue_line"></div></li>

                                                    <template v-for="(item, t) in tracking_geo.tracking"  >
                                                        <li :key="'geo'+item.id" class="text_left">
                                                            <div class="node blue_point"></div>
                                                            <p class="font-primary text_left">{{item.name}}<span>{{item.date_operation}}</span></p>
                                                        </li>
                                                        <li :key="'geo'+item.name"><div :class="(t+1)===tracking_geo.tracking.length ? 'grey_line' : 'blue_line'" class="divider"></div></li>
                                                    </template>


                                                    <li v-if="tracking_geo.to">
                                                        <div class="node grey_point"></div>
                                                        <p class="font-primary text_left">{{tracking_geo.to.name}} <span>{{tracking_geo.to.date_operation}}</span></p>
                                                    </li>

                                                </ul>

                                            </v-col>
                                            <v-col cols="12" md="8">
                                                <div style="height: 310px;" class="rounded-lg my-0 py-0">
                                                    <yandex-map class="py-0 my-0 py-0" v-if="coords && showMap" ref="map"
                                                                :coords="coords"
                                                                :controls="[]"
                                                                :show-all-markers="showAllMarkers"
                                                                :zoom="zoom"
                                                                @map-was-initialized="initHandler"
                                                                style="background-color: #ffffff">
                                                    </yandex-map>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                </v-card-text>

            </v-card>
        </v-dialog>


        <v-sheet v-if="loading && deal"
                 color="white lighten-5"
                 class="pa-1"
        >
            <v-skeleton-loader
                class="mx-auto"
                type="text,text,card,text,text,card,text,text"
            ></v-skeleton-loader>
        </v-sheet>
        <v-overlay :value="loading" z-index="10" color="#244ba8">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-container>

</template>
<script>

    import {mapGetters} from "vuex"
    import {loadYmap, yandexMap} from 'vue-yandex-maps'

    export default {
        name: "DealForm",
        components: {
            yandexMap
        },
        data() {
            return {
                progress:0,
                deal: null,
                loading: false,
                deal_uuid: null,
                number: null,
                author: {},
                deal_status: null,
                company: null,
                documents: [],
                created_at: null,
                headers: [
                    {
                        text: this.$t('deal_type'),
                        align: "left",
                        sortable: false,
                        value: "name"
                    },
                    {
                        text: this.$t('quantity_short'),
                        align: "center",
                        sortable: false,
                        value: "count",
                        width:100
                    },
                    {
                        text: this.$t('price'),
                        align: "center",
                        sortable: false,
                        value: "price"
                    },
                    {
                        text: this.$t('discount'),
                        align: "center",
                        sortable: false,
                        value: "discount"
                    },
                    // {
                    //     text: this.$t('extra_charge'),
                    //     align: "center",
                    //     sortable: false,
                    //     value: "extra_charge"
                    // },
                    {
                        text: this.$t('cost'),
                        align: "right",
                        sortable: false,
                        value: "total",
                        width: 150,
                    }
                ],
                loadingDealOrders:false,
                dealOrderItems: [],
                deal_order_total: 0,
                deal_order_nds_total: 0,
                deal_order_no_nds_total: 0,
                trackings: [],
                invoices: [],
                selected: [],
                topicItems: [],
                clickMenuIcon: 0,
                data_info: [
                    {
                        "type": "data",
                        "name" : this.$t('data'),
                        "class": "mr-2",
                        "color": "primary",
                    },
                    {
                        "type": "tracking",
                        "name": this.$t('tracking'),
                        "class": "border_0",
                        "color": "color_B3B3B3"
                    }
                ],
                info_type: "data",
                tracking_geo: [],
                referencePoints: [],
                showAllMarkers: true,
                mapMarker: null,
                zoom: 12,
                ymaps: null,
                coordinates: [],
                showMap: false,
                coordinatesPolygon: [],
                currency: null,
                currencyItems: [],
                loadingCurrency: false,
                status: null,
                statusItems: [],
                loadingStatus: false,
                sub_status: null,
                sub_statusItems: [],
                loadingSubStatus: false,
                dialogDetailTracking: false,
                detail_tracking: {},
            };
        },
        computed: {
            ...mapGetters(['lang', 'listLanguages']),
            coords: {
                get: function () {
                    return (this.coordinates && this.coordinates.length === 2) ? this.coordinates : [51, 71]
                },
                set: function (val) {
                    this.coordinates = (val && val.length === 2) ? val : [51, 71]
                }
            },
            mapSettings() {
                this.$yandex.lang = 'ru_RU'
                return this.$yandex
            },
            languages() {
                return this.listLanguages
            },
        },
        async mounted() {
            this.language = this.languages[this.tab]
            await this.getDeal()
            await this.getStatus()
            await this.getSubStatus()
            await this.getTracking()
            await this.getInvoices()
            await this.getCurrencies()
            await this.getDealOrders()
            await this.getTopic()
        },

        methods: {

            async ymapInit() {
                var _this = this
                if (window.ymaps) {
                    this.showMap = false
                    if (this.$refs.map && this.$refs.map.myMap) {
                        this.$refs.map.myMap.destroy()
                    }
                    document.getElementById("vue-yandex-maps").remove()
                    delete window.ymaps
                }
                await loadYmap({...this.mapSettings, debug: true})
                if (window.ymaps) {
                    window.ymaps.ready(function () {
                        _this.showMap = true
                    })
                }
            },
            initHandler(e) {
                var _this = this;
                if (this.coords && this.coords.length !== 2 && window.ymaps) {
                    var location = window.ymaps.geolocation.get({
                        provider: 'yandex',
                        mapStateAutoApply: true,
                        autoReverseGeocode: true
                    })
                    location.then(
                        function (result) {
                            //console.log(result.geoObjects.get(0).geometry.getCoordinates())
                            e.geoObjects.add(result.geoObjects)
                        },
                        function (err) {
                            console.log('Error: ' + err)
                        }
                    )
                }
                e.geoObjects.options.set('draggable', true)
                _this.myMap = e;
                console.log(this.referencePoints);
                var multiRoute = new window.ymaps.multiRouter.MultiRoute({
                    // Точки маршрута. Точки могут быть заданы как координатами, так и адресом.
                    referencePoints: this.referencePoints,
                    // referencePoints: [
                    //     [39.960675, 116.341702],
                    //     [55.584227, 37.385534], // улица Льва Толстого.
                    //     [43.222955, 76.955441],
                    //     [44.197558, 80.449582],
                    //
                    //
                    // ]
                }, {
                    // Внешний вид путевых точек.
                    wayPointStartIconColor: "#FFFFFF",
                    wayPointStartIconFillColor: "#B3B3B3",
                    // Внешний вид линии активного маршрута.
                    routeActiveStrokeWidth: 4,
                    routeActiveStrokeStyle: 'solid',
                    routeActiveStrokeColor: "#007EC9",
                    // Внешний вид линий альтернативных маршрутов.
                    routeStrokeStyle: 'dot',
                    routeStrokeWidth: 3,
                    // Автоматически устанавливать границы карты так,
                    // чтобы маршрут был виден целиком.
                    boundsAutoApply: true
                });


                //  console.log(multiRoute);

                _this.myMap.geoObjects.add(multiRoute);
                //e.geoObjects.add(multiRoute);

                var fullscreenControl = new window.ymaps.control.FullscreenControl();
                _this.myMap.controls.add(fullscreenControl);
                //  e.controls.add('FullscreenControl');
            },

            rowClass(){
                //  const rowClass = (this.$vuetify.breakpoint.xsOnly || this.$vuetify.breakpoint.smOnly) ? '' : 'rowClass'
              //  return 'rowDealOrder rowDealForm';
                return (!this.$vuetify.breakpoint.xsOnly) ? 'rowDealOrder rowDealForm' : 'rowMobiClass';
            },

            async getDeal() {
                var _this = this;
                this.progress = 0
                this.loading = true
                let params = {}
                if (this.language) {
                    params.language = this.language
                }
                await this.$http
                    .get(`client/deal/${this.$route.params.uuid}`, {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {
                        this.deal_uuid = res.body.data.uuid
                        this.number = res.body.data.number
                        this.author = res.body.data.author

                        this.deal_status = res.body.data.deal_status.id

                        this.auditor = res.body.data.auditors
                        this.company = res.body.data.company

                        this.documents = res.body.data.documents
                        this.created_at = res.body.data.created_at
                      //  this.heading = this.number + '. ' + res.body.data.company.name

                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('failed_to_get_deal'))
                        if (err && err.body && err.body.message) {
                            for (let prop in err.body.errors) {
                                if (hasOwnProperty.call(err.body.errors, prop)) {
                                    if (_this.$refs[prop]) {
                                        _this.$refs[prop].setErrors([
                                            err.body.errors[prop][0]
                                        ])
                                    }
                                }
                            }
                            if (!err.body.errors) {
                                this.$toastr.error(err.body.message)
                            }
                        }
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
            },
            async getCurrencies() {
                var _this = this;
                this.loadingCurrency = true;

                let params = {};
                if (this.language) {
                    params.language = this.language
                }



                await this.$http
                    .get(`client/currency`, {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {

                        this.currencyItems = res.body.data

                    })
                    .catch(err => {
                        this.currencyItems = []
                        this.$toastr.error(this.$t('failed_to_get_list_currencies'))
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loadingCurrency = false
                    })
            },
            async getStatus() {
                var _this = this;
                this.loadingSataus = true;

                let params = {};
                if (this.language) {
                    params.language = this.language
                }



                await this.$http
                    .get(`client/status`, {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {

                        this.statusItems = res.body.data

                    })
                    .catch(err => {
                        this.statusItems = []
                        this.$toastr.error(this.$t('failed_to_get_list_statuses'))
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loadingSataus = false
                    })
            },
            async getSubStatus() {
                var _this = this;
                this.loadingSubSataus = true;

                let params = {};
                if (this.language) {
                    params.language = this.language
                }



                await this.$http
                    .get(`client/sub_status`, {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {

                        this.sub_statusItems = res.body.data

                    })
                    .catch(err => {
                        this.sub_statusItems = []
                        this.$toastr.error(this.$t('failed_to_get_list_statuses'))
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loadingSubSataus = false
                    })
            },
            async getDealOrders() {

                this.loadingDealOrders = true
                let params = {}
                params.filter = 'search'
                params.deal_uuid = this.deal_uuid

                await this.$http
                    .get("client/deal_order", {
                        params: params,
                    })
                    .then(res => {
                        this.dealOrderItems = res.body.data
                        this.recalculate();
                    })
                    .catch(err => {
                        this.dealOrderItems = []
                    })
                    .finally(end => {
                        this.loadingDealOrders = false
                    })

            },
            async getTracking() {
                var _this = this;
                this.progress = 0
                this.loading = true
                let params = {}
                if (this.language) {
                    params.language = this.language
                }
                await this.$http
                    .get(`client/deal/${this.$route.params.uuid}/tracking`, {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {
                        this.trackings = res.body.data

                    })
                    .catch(err => {
                        this.trackings = [];
                        this.$toastr.error(this.$t('failed_to_get_list_trackings'))
                        if (err && err.body && err.body.message) {
                            for (let prop in err.body.errors) {
                                if (hasOwnProperty.call(err.body.errors, prop)) {
                                    if (_this.$refs[prop]) {
                                        _this.$refs[prop].setErrors([
                                            err.body.errors[prop][0]
                                        ])
                                    }
                                }
                            }
                            if (!err.body.errors) {
                                this.$toastr.error(err.body.message)
                            }
                        }
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
            },
            async getInvoices() {
                var _this = this;
                this.loading = true;

                let params = {};
                if (this.language) {
                    params.language = this.language
                }



                await this.$http
                    .get(`client/deal/${this.$route.params.uuid}/invoices`, {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {

                        this.invoices = res.body.data

                    })
                    .catch(err => {
                        this.invoices = []
                        this.$toastr.error(this.$t('failed_to_get_list_invoices'))
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
            },
            async getTopic() {
                var _this = this;
                this.loading = true;

                let params = {};
                if (this.language) {
                    params.language = this.language
                }



                await this.$http
                    .get(`client/deal/${this.$route.params.uuid}/topic`, {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {

                        this.topicItems = res.body.data

                    })
                    .catch(err => {
                        this.topicItems = []
                        this.$toastr.error(this.$t('failed_to_get_list_topics'))
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
            },
            async getTrackingDeal() {
                var _this = this;
                this.loading = true;

                let params = {};


                await this.$http
                    .get("client/tracking/deal/"+this.deal_uuid, {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {
                        this.referencePoints = []
                        this.tracking_geo = res.body.data.tracking[0];
                        this.coordinates = this.tracking_geo.from.point

                        this.referencePoints.push(this.tracking_geo.from.point);
                        if(this.tracking_geo && this.tracking_geo.tracking)
                        {
                            for (var i=0; i<this.tracking_geo.tracking.length; i++){
                                this.referencePoints.push(this.tracking_geo.tracking[i].point)
                            }
                        }


                        this.ymapInit()
                    })
                    .catch(err => {
                        this.tracking_geo = []
                        this.$toastr.error(this.$t('failed_to_get_list_tracking'))
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
            },
            show_info(type){
                this.info_type = type;
                if(type === 'tracking'){

                    let mclass = this.data_info[0].class;
                    let mcolor = this.data_info[0].color;

                    this.data_info[0].class = this.data_info[1].class
                    this.data_info[0].color = this.data_info[1].color

                    this.data_info[1].class= mclass;
                    this.data_info[1].color = mcolor;
                    this.getTrackingDeal()
                }
                else if(this.data_info[0].color !== 'primary'){
                    let mclass = this.data_info[1].class;
                    let mcolor = this.data_info[1].color;

                    this.data_info[1].class = this.data_info[0].class
                    this.data_info[1].color = this.data_info[0].color

                    this.data_info[0].class= mclass;
                    this.data_info[0].color = mcolor;
                }

            },
            close_info(item){
               // this.click_action = true;
              //  item.show = false
                this.detail_tracking = {};
                this.dialogDetailTracking = false;
            },
            recalculate(){
                let total_umount = 0;
                this.dealOrderItems.forEach(function callback(item2) {
                    if (typeof item2.total_usd === 'string' || item2.total_usd instanceof String){
                        item2.total_usd = item2.total_usd.replace(/\s/g,'')
                        item2.total_usd = (item2.total_usd !== "") ? item2.total_usd : 0;
                    }
                    total_umount = parseFloat(total_umount) + parseFloat(item2.total_usd);

                    if (typeof item2.total_usd === 'string' || item2.total_usd instanceof String){
                        item2.total_usd = item2.total_usd.replace(/\s/g,'')
                    }
                    item2.total_usd = new Intl.NumberFormat('ru-RU').format(parseFloat(item2.total_usd))

                    if (typeof item2.total === 'string' || item2.total instanceof String){
                        item2.total = item2.total.replace(/\s/g,'')
                    }
                    item2.total = new Intl.NumberFormat('ru-RU').format(parseFloat(item2.total))

                    if (typeof item2.price === 'string' || item2.price instanceof String){
                        item2.price = item2.price.replace(/\s/g,'')
                    }
                    item2.price = new Intl.NumberFormat('ru-RU').format(parseFloat(item2.price))

                    if (typeof item2.discount === 'string' || item2.discount instanceof String){
                        item2.discount = item2.discount.replace(/\s/g,'')
                    }
                    item2.discount = new Intl.NumberFormat('ru-RU').format(parseFloat(item2.discount))

                    if (typeof item2.extra_charge === 'string' || item2.extra_charge instanceof String){
                        item2.extra_charge = item2.extra_charge.replace(/\s/g,'')
                    }
                    item2.extra_charge = new Intl.NumberFormat('ru-RU').format(parseFloat(item2.extra_charge))


                });

                this.deal_order_nds_total = total_umount * (12 / 100);
                this.deal_order_no_nds_total = total_umount - this.deal_order_nds_total;

                this.deal_order_total = new Intl.NumberFormat('ru-RU').format(total_umount)
                this.deal_order_no_nds_total = new Intl.NumberFormat('ru-RU').format(parseFloat(this.deal_order_no_nds_total))
                this.deal_order_nds_total = new Intl.NumberFormat('ru-RU').format(parseFloat(this.deal_order_nds_total))

            },
            showDetailsApplication3(item){
                if(item.show === true){
                    return;
                }
                if(this.click_action===true){
                    this.click_action = false;
                    return;
                }
                this.deal_uuid = item.uuid
                this.show_info('data')
                this.clickMenuIcon = 1;
                this.trackings.map(detail => {
                        if(detail.id !== item.id){
                            detail.show = false
                        }

                    }
                )
                item.show = !item.show;

            },
            showDetailsApplication2(item){
                this.clickMenuIcon = 1;
                if(item.show === true){
                    return;
                }
                if(this.click_action===true){
                    this.click_action = false;
                    return;
                }
                this.trackings.map(detail => {
                        if(detail.id !== item.id){
                            detail.show = false
                        }

                    }
                )
                item.show = !item.show;
            },

            showDetailsApplication(item){
                this.detail_tracking = {};
                this.detail_tracking = item;
                this.dialogDetailTracking = true;
            },
            downloadFile(data) {
                fetch(data.url)
                    .then((resp) => resp.blob())
                    .then((blob) => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.style.display = "none";
                        a.href = url;
                        a.download = data.file_name;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        this.$toastr.success(this.$t('file_download_started'))
                    })
                    .catch(() =>
                        this.$toastr.error(this.$t('file_download_error'))

                    );
            },
            openChat(item){
                this.$router.push({
                    name: 'topic.messages',
                    params: {
                        uuid: item.uuid
                    }
                })
            }





        }
    }
</script>

<style>
.rowDealForm td:nth-child(1){
    width: 58% !important;
}
.rowDealForm td:nth-child(2){
    width: 8% !important;
}
.rowDealForm td:nth-child(3){
    width: 12% !important;
}
.rowDealForm td:nth-child(4){
    width: 10% !important;
}
.rowDealForm td:nth-child(5){
    width: 12% !important;
}
</style>

<style scoped>

.wrapper-progressBar {
    width: 100%
}
.progressBar li {
    list-style-type: none;
    float: left;
    width: 33%;
    position: relative;
    text-align: center;
}
.progressBar li:before {
    content: " ";
    line-height: 10px;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    border: 1px solid #ddd;
    display: block;
    text-align: center;
    margin: 0 auto 10px;
    background-color: white;

}
.progressBar li:after {
    content: "";
    position: absolute;
    width: 90%;
    height: 4px;
    background-color: #ddd;
    top: 3px;
    left: -45%;


}
.progressBar li:first-child:after {
    content: none;


}
.progressBar li.active {
    color: #007ec9;

}
.progressBar li.active:before {
    border-color: #007ec9;
    background-color: #007ec9;

}
.progressBar .active:after {
    background-color: #007ec9;
}
.node {
    height: 8px !important;
    width: 8px !important;
    border-radius: 50%;
    display:inline-block;
    transition: all 1000ms ease;
}
ul.pod_status{
    display: flex;
    padding: 0 !important;
    flex-direction: row;
    justify-content: flex-start;

}
ul.pod_status li.my_divider {
    height: 2px;
    width: 14%;
    margin: 2px 0 0 0;
    transition: all 800ms ease;
    display:inline-block;
}
ul.pod_status li.li1 p {

    margin-left: 25px;
    position: absolute;
    top: 16px;
    left: -22px;
    color: #B3B3B3;
    font-size: 11px;
    font-weight: 700;
}
.blue_color{color: #007EC9}
ul.pod_status li.li1 {
    list-style: none;
    line-height: 1px;
    position: relative;
    width: 2px !important;
}

.li_last{
    left: -69px !important;
}
.blue_line{ background-color: #007EC9; }
.blue_point{ background: url("../../public/img/point_ok2.png") no-repeat;background-size: 8px 8px;}
.grey_line { background-color:  #B3B3B3; }
.grey_point {   background: url("../../public/img/grey_point.png") no-repeat;background-size: 8px 8px;}





.ymap-container {
    height: 300px;
}
ul.station{
    margin-top: 20px;
}
ul.station .node {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    display:inline-block;
    transition: all 1000ms ease;

}
ul.station .divider {
    height: 40px;
    width: 2px;
    margin: 0 0 0 3px;
    transition: all 800ms ease;
}
ul.station li p {
    display:inline-block;
    margin: 0 0 0 11px !important;
    position: absolute;
    left: 0;
    top: -11px;
    line-height: normal;
    font-size: 10px;
    font-weight: 800;
}
ul.station li p span {
    display: block;
    font-weight: normal;
    font-size: 9px;

}
ul.station li {
    list-style: none;
    line-height: 1px;
    position: relative;
}
ul.station li:after, ul.station li:before, ul.station li p:after, ul.station li p:before { margin:0; padding:0; }






</style>


