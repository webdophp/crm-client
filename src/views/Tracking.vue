<template>
    <v-container class="align-left" :style="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '' : 'float:left;max-width: 95%'">
        <v-row dense>
            <v-col cols="12" class="px-0 mx-0 pb-5 title_header">
                {{ $t('search_tracking') }}
                <v-icon v-if="false"
                    :color="color"
                    @click="openSearch"

                >mdi-text-box-search-outline</v-icon>
            </v-col>
        </v-row>
        <v-row v-if="search">
            <v-col cols="12">
                <v-form @submit.prevent="getTrackings()">
                    <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                        <v-card flat class="px-0 mx-0">
                            <v-card-text class="px-0 mx-0">

                                <v-row>
                                    <v-col class="py-0" cols="12" sm="8">
                                        <ValidationProvider ref="tracking" rules="min:1|max:255"
                                                            v-slot="{ errors, valid }">
                                            <v-text-field v-model="container_number"
                                                          type="text"
                                                          :error-messages="errors"
                                                          :disabled="loading"
                                                          outlined
                                                          :label="$t('container_number')" color="primary"
                                                          clearable></v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col class="py-0" cols="12" sm="4">
                                        <v-dialog ref="dateDialog" v-model="dateDialog" width="290px">
                                            <v-date-picker ref="pickerDateContract" v-model="date"
                                                           :locale="lang"
                                                           @change="dateDialog = false">
                                            </v-date-picker>
                                        </v-dialog>
                                        <ValidationProvider ref="dateContract" rules="date_format"
                                                            v-slot="{ errors, valid }">
                                            <v-text-field v-model="date" :error-messages="errors"
                                                          :error="!valid"
                                                          :disabled="loading"
                                                          :label="$t('date_operation')"
                                                          outlined color="primary" readonly
                                                          @click.stop="dateDialog = !dateDialog"
                                                          clearable @click:clear="date = null"></v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions class="py-0">
                                <v-row>
                                    <v-col cols="12" sm="3" md="2" class="px-1 mx-0">
                                        <v-select :value="perPage" :items="perPageItems" :disabled="loading"
                                                  :label="$t('items_per_page')"
                                                  outlined
                                                  @input="perPage = options.itemsPerPage = Number($event)"
                                                  hide-details dense></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="9" md="10"
                                           class="px-1 mx-0 d-flex justify-center justify-sm-end align-self-center">
                                        <v-btn type="submit" :disabled="invalid || loading"
                                               :loading="loading"
                                               :block="$vuetify.breakpoint.xsOnly" color="primary">
                                            {{ $t('search') }}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-actions>
                        </v-card>
                        <v-divider class="my-5"></v-divider>
                    </ValidationObserver>
                </v-form>
            </v-col>
        </v-row>
        <v-row dense v-if="!no_data">
            <v-col class="px-0 mx-0" cols="12" v-if="!($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly)">
                <v-row class="px-0 mx-0 font-pt-sans-caption color_B3B3B3 menu_header" >


                    <v-col cols="6" class="px-0 mx-0">
                       <v-row class="px-0 mx-0">
                           <v-col cols="12" sm="4" >{{$t('date_created')}}</v-col>
                           <v-col cols="12" sm="4">Заявка</v-col>
                           <v-col cols="12" sm="4" v-if="false">Импортер</v-col>
                       </v-row>
                    </v-col>
                    <v-col cols="6" class="px-0 mx-0">
                       <v-row class="px-0 mx-0">
                           <v-col cols="12" sm="5" >Работают над заявкой</v-col>
                           <v-col cols="12" sm="5">Контейнеры</v-col>
                           <v-col cols="12" sm="2"></v-col>
                       </v-row>
                    </v-col>



                </v-row>
            </v-col>
            <v-col cols="12" class="px-0 mx-0">
                <v-card flat class="background_color_transparent">
                    <v-card
                        elevation="0"
                        :ripple="false"
                        :hover="true"
                        v-for="(item, i) in trackings"
                        :key="'tracking'+i"
                        class="mb-5 rounded-lg "
                        :class="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly) ? 'text-center' :''"
                        @click="showDetailsApplication(item)"
                        color="#F5F5F5"
                    >
                        <v-card-text class="px-0 mx-0"
                        v-if="!($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly)"

                        >

                            <v-row class="px-0 mx-0">

                                <v-col cols="6" class="px-0 mx-0">
                                    <v-row class="px-0 mx-0">
                                        <v-col cols="12" sm="4">
                                            <div class="tracking_title">
                                                {{ item.info.date_operation ? $moment(item.info.date_operation).format('DD.MM.YYYY') : '' }}
                                            </div>
                                            <div style="text-align: left">
                                                <v-icon lass="color_999999" size="14" @click="redirectMessages(item)"
                                                        v-for="(item, i) in item.topics" :key="'topic' + i"
                                                >
                                                    ${{'commentTextIcon'}}
                                                </v-icon>
                                            </div>
                                        </v-col>
                                        <v-col cols="12" sm="4">
                                            <div class="tracking_title">
                                                {{item.info.deal_number}}
                                            </div>
                                            <div class="font-pt-sans-caption tracking_subtitle">
                                                {{ item.info.company.name}}
                                            </div>
                                        </v-col>
                                        <v-col cols="12" sm="4" v-if="false">
                                            <div class="tracking_title">
                                                ООО «ПМТЦ»
                                            </div>
                                            <div class="tracking_subtitle">
                                                ГК: ООО «Ко ПМТЦ»
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="6" class="px-0 mx-0">
                                    <v-row class="px-0 mx-0">
                                        <v-col cols="12" sm="5" >
                                            <div class="tracking_name manager_ellipse" v-for="(responsible, y) in item.responsible" :key="'responsible'+y">
                                                {{responsible}}
                                            </div>
                                        </v-col>
                                        <v-col cols="12" sm="5" >
                                            <div class="tracking_container" v-for="(containers, x) in item.containers" :key="'containers'+x" >
                                                {{containers}}
                                            </div>
                                        </v-col>

                                        <v-col cols="12" sm="2">
                                            <div class="tracking_document doc1">
                                                {{item.document_count}}/{{item.document_count_confirmed}}
                                            </div>
                                            <div class="tracking_document doc2">
                                                {{item.invoice_count}}/{{item.invoice_count_confirmed}}
                                            </div>
                                            <div v-if="false" class="tracking_document doc3">
                                                Не подана
                                            </div>
                                        </v-col>

                                    </v-row>
                                </v-col>


                            </v-row>
                            <v-row class="px-0 mx-0">
                                <v-col cols="12" md="2" class="px-0 mx-0 "
                                       :class="$vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ? 'pt-1 pb-5' : 'pt-11' ">
                                    <v-row class="px-0 mx-0">
                                        <v-col cols="12">
                                            <div class="font-pt-sans-caption tracking_text_foot" v-if="item.info.day > 0">
                                                {{$t('in_operation_for')}} {{ $t('for_day', {"day":item.info.day})}}
                                            </div>
                                        </v-col>
                                        <v-col v-if="false" cols="12" sm="4">
                                            <div class="font-pt-sans-caption tracking_text_foot">
                                                {{$t('in_operation_for')}} {{ $t('for_day', {"day":item.info.day})}}
                                            </div>
                                        </v-col>
                                        <v-col v-if="false"  cols="12" sm="4">
                                            <div class="font-pt-sans-caption tracking_text_foot">
                                                {{$t('in_operation_for')}} {{ $t('for_day', {"day":item.info.day})}}
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" md="10" class="px-0 mx-0 pt-12"
                                       v-if="!($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly)"
                                >
                                    <v-row class="px-0 mx-0">
                                        <v-col cols="12 py-0 my-0">
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
                                                 class="mr-2 font-size-11 "
                                                 :class="item.class"
                                                 :color="item.color"
                                                 label
                                                 outlined
                                                 @click="show_info(item.type)"
                                        >{{item.name}}</v-chip>
                                    </div>
                                </v-col>
                               <v-col cols="12" v-if="info_type==='data'">
                                   <v-row>
                                       <v-col cols="12" lg="4" md="6" :class="$vuetify.breakpoint.mdOnly ? 'pt-5 pb-3 px-5' : 'py-5 px-5'">
                                           <v-row>
                                               <v-col cols="12" class="py-0 in_detail"><b>{{ $t('application_number') }}:</b> {{ item.info.number ? item.info.number :  $t('no_data')  }}</v-col>
                                               <v-col cols="12" class="py-0 in_detail"><b>{{ $t('container_number') }}:</b> {{ item.info.container_number ? item.info.container_number :  $t('no_data')  }}</v-col>
                                               <v-col cols="12" class="py-0 in_detail"><b>{{ $t('departures') }}:</b> {{ item.info.departure ? item.info.departure :  $t('no_data')  }}</v-col>
                                               <v-col cols="12" class="py-0 in_detail"><b>{{ $t('destination') }}:</b> {{ item.info.destination ? item.info.destination :  $t('no_data')  }}</v-col>

                                               <v-col cols="12" class="py-0 in_detail"><b>{{ $t('type_container') }}:</b> {{ item.info.type_container ? item.info.type_container :  $t('no_data')  }}</v-col>
                                               <v-col cols="12" class="py-0 in_detail"><b>{{ $t('type_transportation') }}:</b> {{ item.info.type_transport ? item.info.type_transport :  $t('no_data')  }}</v-col>
                                           </v-row>
                                       </v-col>
                                       <v-col cols="12" lg="4" md="6" :class="$vuetify.breakpoint.mdOnly ? 'pt-5 pb-3 px-5' : 'py-5 px-5'">
                                           <v-row>
                                               <v-col cols="12" class="py-0 in_detail"><b>{{ $t('download_type') }}:</b> {{ (item.info.loading_type && item.info.loading_type.name) ? item.info.loading_type.code +' '+ item.info.loading_type.name :  $t('no_data')  }}</v-col>
                                               <v-col cols="12" class="py-0 in_detail"><b>{{ $t('application_date') }}:</b> {{ item.info.created_at ? $moment(item.info.created_at).format('YYYY-MM-DD HH:mm') : $t('no_data')  }}</v-col>
                                               <v-col cols="12" class="py-0 in_detail"><b>{{ $t('date_operation') }}:</b> {{ item.info.date_operation  ? $moment(item.info.date_operation).format('YYYY-MM-DD HH:mm') : $t('no_data')  }}</v-col>
                                               <v-col cols="12" class="py-0 in_detail"><b>{{ $t('date_of_arrival_at_the_border') }}:</b> {{ item.info.date_of_arrival_at_border ? $moment(item.info.date_of_arrival_at_border).format('YYYY-MM-DD HH:mm') :  $t('no_data')  }}</v-col>
                                               <v-col cols="12" class="py-0 in_detail"><b>{{ $t('arrival_date_at_destination') }}:</b> {{ item.info.arrival_date_at_destination ? $moment(item.info.arrival_date_at_destination).format('YYYY-MM-DD HH:mm') :  $t('no_data')  }}</v-col>

                                           </v-row>
                                       </v-col>
                                       <v-col cols="12" :lg="$vuetify.breakpoint.mdOnly ? 12 : 4" :md="$vuetify.breakpoint.mdOnly ? 12 : 6" :class="$vuetify.breakpoint.mdOnly ? 'pb-5 px-5' : 'py-5 px-5'">
                                           <v-row>
                                               <v-col cols="12"  md="6" lg="12" class="py-0 in_detail"><b>{{ $t('application_status') }} :</b> {{ item.info.status ? item.info.status :  $t('no_data')  }}</v-col>
                                               <v-col cols="12"  md="6" lg="12" class="py-0 in_detail"><b>{{ $t('distance_to_destination') }}:</b> {{ item.info.distance_to_destination ? item.info.distance_to_destination :  $t('no_data')  }}</v-col>
                                               <v-col cols="12"  md="6" lg="12" class="py-0 in_detail"><b>{{ $t('delivered') }}:</b> {{ item.info.paid == true ? $t('yes') :  $t('no')  }}</v-col>
                                               <v-col cols="12"  md="6" lg="12" class="py-0 in_detail"><b>{{ $t('company') }}:</b> {{ item.info.company && item.info.company.name ? item.info.company.name  :  $t('no_data')  }}</v-col>
                                               <v-col cols="12"  md="6" lg="12" class="py-0 in_detail"><b>{{ $t('bin_iin') }}:</b> {{ item.info.company && item.info.company.bin_iin ?  item.info.company.bin_iin :  $t('no_data')  }}</v-col>
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

                        <v-card-text
                            v-if="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly)"
                        >
                            <v-row class="tracking_rov_mobi">
                                <v-col cols="12" class="tracking_chat_icon">
                                    <div style="text-align: left">
                                        <v-icon lass="color_999999" size="24" @click="redirectMessages(item)"
                                                v-for="(item, i) in item.topics" :key="'topic' + i"
                                        >
                                            ${{'commentTextIcon'}}
                                        </v-icon>
                                    </div>
                                </v-col>
                                <v-col cols="6" class="tracking_title_mobi">Заявка</v-col>
                                <v-col cols="6" class="tracking_text_mobi">  {{item.info.deal_number}}</v-col>
                                <v-col cols="6" class="tracking_title_mobi">Работают над заявкой</v-col>
                                <v-col cols="6" class="tracking_text_mobi">
                                    <div class="tracking_name manager_ellipse" v-for="(responsible, y) in item.responsible" :key="'responsible'+y">
                                        {{responsible}}
                                    </div>
                                </v-col>
                                <v-col cols="6" class="tracking_title_mobi">Контейнеры</v-col>
                                <v-col cols="6" class="tracking_text_mobi">
                                    <div class="tracking_container" v-for="(containers, x) in item.containers" :key="'containers'+x" >
                                        {{containers}}
                                    </div>
                                </v-col>
                                <v-col cols="6" class="tracking_title_mobi">Статус</v-col>
                                <v-col cols="6" class="tracking_text_mobi">{{item.info.status}}</v-col>
                                <v-col cols="12">
                                    <v-btn

                                        color="primary"
                                        class="rounded-lg but_enter"
                                        block
                                        :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                        outlined
                                    >
                                        {{ $t('details') }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>

                    </v-card>

                    <v-card-text>
                        <v-progress-linear  v-model="progress2"
                                            :active="progress_shop" class="mr-2"></v-progress-linear>
                    </v-card-text>
                    <v-card-actions class="justify-center" v-if="(nextLink===true && loading===false) ? true : false">
                        <v-btn
                            color="primary"
                            outlined
                            class="elevation-0 "
                            @click="nextItems"
                        >
                            {{  $t('download_more') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="no_data">
            <v-col cols="12">
                <v-card flat class="background_color_transparent">
                    <v-list-item-content>
                        <v-img style="margin: 0 auto 0 auto" max-width="500" src="img/no/topic.png"></v-img>
                    </v-list-item-content>
                </v-card>
            </v-col>
        </v-row>



        <v-dialog
            v-if="invoice.request_scanned"
            v-model="dialog_invoice"
            scrollable

            max-width="500px"


        >
            <v-card>
                <v-card-title class="px-2 mx-0">
                    <v-icon @click="dialog_invoice = false;invoice={}">mdi-close</v-icon>
                    <span class="pl-5">{{ $t('payment_invoice') }}</span>


                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list subheader>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{ invoice.number }}</v-list-item-title>
                                <v-list-item-subtitle>{{ $t('account_number')}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ invoice.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') }} {{ $t('tg') }}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{$t('amount')}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{ invoice.invoice_status }}</v-list-item-title>
                                <v-list-item-subtitle>{{$t('invoice_status')}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{ $moment(invoice.date).format('DD.MM.YYYY') }}</v-list-item-title>
                                <v-list-item-subtitle> {{$t('date')}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>




                        <v-list-item>


                            <v-list-item-content>
                                <v-list-item-title v-text="invoice.request_scanned.file_name"></v-list-item-title>
                                <v-list-item-subtitle v-text="(invoice.request_scanned.size / 1000).toFixed(1) + ' KB'"></v-list-item-subtitle>
                            </v-list-item-content>


                        </v-list-item>


                    </v-list>


                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        @click="downloadInvoice(invoice.request_scanned)"
                    >
                        {{$t('download')}}
                    </v-btn>
                </v-card-actions>


            </v-card>
        </v-dialog>

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
                                        <v-col cols="12" md="4" v-if="(!$vuetify.breakpoint.xsOnly)">
                                            <ul class="station" style="padding-top: 10px !important; margin-top: 0 !important; max-height:300px !important;overflow-y: scroll !important;">
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
                                        <v-col cols="12" md="8" sm="12">
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

        <v-sheet v-if="loading && trackings.length === 0"
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

        <v-tour name="TourTracking" :steps="stepsTracking" :options="optionsTracking" :callbacks="callbacksTracking"></v-tour>

    </v-container>

</template>
<script>

    import {mapGetters} from "vuex"
    import {ValidationObserver, ValidationProvider} from 'vee-validate'
    import {loadYmap, yandexMap} from 'vue-yandex-maps'

    export default {
        name: "Trackings",
        components: {
            ValidationProvider,
            ValidationObserver,
            yandexMap
        },
        data() {
            return {
                dialog_invoice:false,
                invoice:{},
                overlay: true,
                loading2:true,
                progress:0,
                progress2:0,
                progress_shop:false,
                search:false,
                nextLink: true,
                color: 'primary',

                date: null,
                dateDialog: false,
                fab: false,
                container_number: null,
                trackings: [],
                trackingItems: [],
                sortBy: "id",
                sortDir: false,
                page: 1,
                pageCount: 0,
                perPage: 25,
                totalVisiblePag: 5,
                totalTracking: 0,
                options: {},
                loading: false,
                headers: [
                   {
                        text: this.$t('date_operation'),
                        align: "center",
                        sortable: false,
                        value: "date_operation"
                    },
                    {
                        text: this.$t('container_number'),
                        align: "center",
                        sortable: false,
                        value: "container_number"
                    },
                    {
                        text: this.$t('route'),
                        align: "center",
                        sortable: false,
                        value: "route"
                    },
                    {
                        text: this.$t('location'),
                        align: "center",
                        sortable: false,
                        value: "station"
                    },
                    {
                        text: this.$t('arrival_date'),
                        align: "center",
                        sortable: false,
                        value: "arrival_date_at_destination"
                    },
                    {
                        text: this.$t('distance_to_destination'),
                        align: "center",
                        sortable: false,
                        value: "distance_to_destination"
                    }
                ],

                no_data: false,
                dialogDetails: false,
                detailsItems:[],
                clickMenuIcon: 0,
                optionsTracking: {
                    startTimeout: 500,
                    useKeyboardNavigation: false,
                    labels: {
                        buttonSkip: this.$t('miss'),
                        buttonPrevious: this.$t('previous'),
                        buttonNext: this.$t('next'),
                        buttonStop: this.$t('finish'),
                    }
                },
                stepsTracking: [
                    {
                        target: '#v-step-0',
                        content: this.$t('container_search'),
                        params: {
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#v-step-1',
                        content: this.$t('tracking_chat'),
                        params: {
                            enableScrolling: false
                        }
                    },
                    {   target: '#v-step-2',
                        content: this.$t('create_application'),
                        params: {
                            placement: 'top',
                            enableScrolling: false
                        }
                    },
                ],
                callbacksTracking: {
                    onFinish: this.callbackOnFinishTour,
                    onSkip: this.callbackOnFinishTour,
                    onStop: this.callbackOnFinishTour,
                },
                showAllMarkers: true,
                mapMarker: null,
                zoom: 12,
                ymaps: null,
                coordinates: [],
                showMap: false,
                coordinatesPolygon: [],

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
                click_action: false,
                deal_uuid: null,
                tracking_geo: [],
                referencePoints: [],
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
            ...mapGetters(['lang', 'itemsPerPage', 'perPageItems']),
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

        },
        async mounted() {
            this.options.itemsPerPage = this.perPage = this.itemsPerPage
            await this.getStatus()
            await this.getTrackings()

            if (!localStorage.TourTracking && this.trackings.length > 0) {
                this.$tours['TourTracking'].start()
            }
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

            redirectMessages(item){
                this.$router.push({
                    name: 'topic.messages',
                    params: {
                        uuid: item.uuid
                    }
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
            async getTrackingDeal(item) {
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


            showActiveClient(item){
                this.trackings.map(detail => {
                    if(detail.id !== item.id){
                        detail.show = false
                    }
                            detail.active_client = false

                    }
                )
                item.active_client = !item.active_client;
            },
            showDetailsApplication3(item) {

                if(this.clickMenuIcon === 1){
                    this.clickMenuIcon = 0;
                    return;
                }

                this.loading = true;
                this.$http
                    .get("client/tracking/"+item.id)
                    .then(res => {
                        this.detailsItems = res.body.data
                        this.dialogDetails = true;
                    })
                    .catch(err => {
                        this.detailsItems = []
                        this.$toastr.error(this.$t('failed_to_get_list_applications'))
                    })
                    .finally(end => {
                        this.loading = false
                    })
            },
            showDetailsApplication2(item){
             //   console.log(event.pageX+':'+event.pageY);

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
            showDetailsApplication(item){
                console.log(item)
                this.detail_tracking = {};
                this.detail_tracking = item.info;
                this.deal_uuid = item.uuid
                this.dialogDetailTracking = true;
            },
            showInvoice(item){
                this.invoice = {};
                this.dialog_invoice = true;
                this.invoice = item;
                this.clickMenuIcon = 1;

            },
            downloadInvoice(data) {
                this.clickMenuIcon = 1;
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
            callbackOnFinishTour(){
                localStorage.TourTracking = 1;
            },
            cancelDetails(){
                this.dialogDetails = false;
            },

            openSearch(){
                if(this.search === true){
                    this.search = false
                    this.color = 'primary';
                }
                else{
                    this.search = true
                    this.color = '';
                }
            },
            async addTopic(item) {
                var _this = this;
                this.progress = 0
                this.loading = true
                this.clickMenuIcon = 1;
                var formData = new FormData()
                if (this.languages && this.languages[this.tab]) {
                    formData.append('language', this.languages[this.tab])
                }
                formData.append('tracking_uuid', item.uuid)
                await this.$http
                    .post('client/topic_tracking', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {
                        this.$toastr.success(this.$t('topic_has_been_added'))
                        if (res && res.body && res.body.data && res.body.data.topic_uuid) {

                            this.$router.push({
                                name: 'topic.messages',
                                params: {
                                    uuid: res.body.data.topic_uuid
                                }
                            })
                        } else {
                            this.$toastr.error(this.$t('topic_has_not_been_added'))
                        }
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('topic_has_not_been_added'))
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
            async getTrackings() {
                var _this = this;
                this.loading = true;

                let params = {};
                params.page = 1
                params.sortBy = this.sortBy;
                params.sortDir = this.sortDir ? 'asc' : 'desc';
                params.perPage = this.perPage;

                if (this.container_number) {
                    params.container_number = this.container_number;
                }
                if (this.lang) {
                    params.language = this.lang
                }

                if (this.date) {
                    params.date = this.date;
                }

                await this.$http
                    .get("client/tracking/deal", {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {

                        this.trackings = res.body.data
                        this.page = res.body.meta.current_page
                        this.totalTracking = res.body.meta.total
                        this.pageCount = res.body.meta.last_page
                        if(this.pageCount === this.page){
                            this.nextLink = false;
                        }
                        else{
                            this.nextLink = true;
                        }
                        if(this.trackings.length <= 0){
                            this.no_data = true;
                        }
                        else{
                            this.no_data = false;
                        }
                    })
                    .catch(err => {
                        this.trackings = []
                        this.totalTracking = 0
                        this.$toastr.error(this.$t('failed_to_get_list_trackings'))
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
            },
            async nextItems(){
                var _this = this;

                this.progress_shop = true;
                let params = {};

                params.page = this.page + 1 ;
                params.sortBy = this.sortBy;
                params.sortDir = this.sortDir ? 'asc' : 'desc';
                params.perPage = this.perPage;

                if (this.storage) {
                    params.storage = this.storage;
                }
                if (this.date) {
                    params.date = this.date;
                }

                await this.$http
                    .get("client/tracking", {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress2 = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {
                        let data = res.body.data;
                        data.forEach((item) => {

                            this.trackings.push(item)
                        })

                        this.page = res.body.meta.current_page
                        this.totalStorages = res.body.meta.total
                        this.pageCount = res.body.meta.last_page

                        if(this.pageCount === this.page){
                            this.nextLink = false;
                        }
                        else{
                            this.nextLink = true;
                        }
                        data = [];
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('failed_to_get_list_trackings'))
                    })
                    .finally(end => {
                        this.progress2 = 0
                        this.progress_shop = false
                    })


            },



        }
    }
</script>

<style>

.no_box_shadow{
    box-shadow: none !important;
    min-height: 50px;

}



</style>

<style scoped>

.node {
    height: 8px;
    width: 8px;
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
.blue_color{color: #007EC9}

.color_dodgerblue{
    color: #007ec9;
}



</style>

<style scoped>

.menu_header{
    font-size: 11px !important;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0;
    text-align: left;

}

.v-card--link:before {
    background: none;
}


.tracking_title{
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0;
    text-align: left;
    color: #333333;
}

.tracking_subtitle{
    font-size: 11px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0;
    text-align: left;
    color: #b3b3b3;
}

.tracking_name{
    font-size: 11px;
    font-weight: 700;
    line-height: 14px;
    letter-spacing: 0;
    text-align: left;
    color: #333333;
    padding-left: 17px;
    margin-bottom: 4px;

}

.tracking_container{

    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing:0;
    text-align: left;
    color: #333333;
    padding-left: 30px;
}

.tracking_document{
    font-size: 12px;
    font-weight: 700;
    line-height: 25px;
    letter-spacing: 0;
    text-align: right;
    color: #333333;
    padding-right: 20px;

}

.tracking_document:nth-child(2){
    top: 30px;
}

.tracking_document:nth-child(3){
    top: 43px;
}

.tracking_text_foot{
    font-size: 11px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0;
    text-align: left;


}

.info_open{
    position: absolute;
    background-color: #ffffff;
    z-index: 1;
    width: 600px;
    right: -70px;
    top: -50px;
}

.border_0{
    border: 0 !important;
}

.in_detail{

    font-size: 11px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0.03em;
    text-align: left;
    color: #333333;


}
.in_detail b{
    font-weight: 700;
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

ul.station{
    padding-left: 10px;
}

ul.station li p {
    display:inline-block;
    margin: 0 0 0 15px !important;
    position: absolute;
    left: 0;
    top: -11px;
    line-height: normal;
    font-size: 12px;
    font-weight: 800;
}
ul.station li p span {
    display: block;
    font-weight: normal;
    font-size: 11px;
}

ul.station li {
    list-style: none;
    line-height: 1px;
    position: relative;
    width: 8px;
}
ul.station li:after, ul.station li:before, ul.station li p:after, ul.station li p:before { margin:0; padding:0; }

.close{
    position: absolute;
    right: 13px;
    top: 15px;
}
.details_title{
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0.03em;
    text-align: left;
    color: #007EC9;

}

.ymap-container {
    height: 300px;
}

@media screen and (max-width: 960px) {
    .info_open{
        position: unset;
        width: 100%;
        border: solid 1px #b3b3b3;

    }
    .close{
        position: unset;
        right: 10px;
        top: 10px;
        text-align: right;
        float: right;
    }

    .in_detail, .text_left{
        text-align: left;
    }
}

</style>


