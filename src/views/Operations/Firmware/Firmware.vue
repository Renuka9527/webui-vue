<template>
  <b-container fluid="xl">
    <page-title :title="$t('appPageTitle.firmware')" />
    <alerts-server-power
      v-if="isServerPowerOffRequired"
      :is-server-off="isServerOff"
    />

    <!-- Firmware cards -->
    <b-row>
      <b-col xl="10">
        <!-- BMC Firmware -->
        <bmc-cards
          :is-page-disabled="isPageDisabled"
          :is-server-off="isServerOff"
          @loadingStatus="loadingStatus"
        />

        <!-- Host Firmware -->
        <host-cards v-if="!isSingleFileUploadEnabled" />
      </b-col>
    </b-row>

    <!-- Update firmware-->
    <page-section
      :section-title="$t('pageFirmware.sectionTitleUpdateFirmware')"
    >
      <b-row>
        <b-col class="mb-4" sm="8" md="6" xl="4">
          <!-- Update form -->
          <form-update
            :is-page-disabled="isPageDisabled"
            @loadingStatus="loadingStatus"
          />
        </b-col>
        <b-col sm="8" md="6" xl="4">
          <!-- Access key expiration -->
          <firmware-access-key :is-page-disabled="isPageDisabled" />
        </b-col>
      </b-row>
    </page-section>
  </b-container>
</template>

<script>
import AlertsServerPower from './FirmwareAlertServerPower';
import BmcCards from './FirmwareCardsBmc';
import FirmwareAccessKey from './FirmwareAccessKey';
import FormUpdate from './FirmwareFormUpdate';
import HostCards from './FirmwareCardsHost';
import PageSection from '@/components/Global/PageSection';
import PageTitle from '@/components/Global/PageTitle';

import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';

export default {
  name: 'FirmwareSingleImage',
  components: {
    AlertsServerPower,
    BmcCards,
    FirmwareAccessKey,
    FormUpdate,
    HostCards,
    PageSection,
    PageTitle,
  },
  mixins: [LoadingBarMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      loading,
      isServerPowerOffRequired:
        process.env.VUE_APP_SERVER_OFF_REQUIRED === 'true',
    };
  },
  computed: {
    serverStatus() {
      return this.$store.getters['global/serverStatus'];
    },
    isServerOff() {
      return this.serverStatus === 'off' ? true : false;
    },
    isSingleFileUploadEnabled() {
      return this.$store.getters['firmware/isSingleFileUploadEnabled'];
    },
    isPageDisabled() {
      if (this.isServerPowerOffRequired) {
        return !this.isServerOff || this.loading || this.isOperationInProgress;
      }
      return this.loading || this.isOperationInProgress;
    },
  },
  created() {
    this.startLoader();
    Promise.all([
      this.$store.dispatch('licenses/getLicenses'),
      this.$store.dispatch('firmware/getFirmwareInformation'),
      this.$store.dispatch('firmware/getFirmwareBootSide'),
    ]).finally(() => this.endLoader());
  },
  methods: {
    loadingStatus(loading) {
      this.loading = loading;
    },
  },
};
</script>
