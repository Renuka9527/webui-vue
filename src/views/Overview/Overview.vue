<template>
  <b-container fluid="xl">
    <page-title :title="$t('appPageTitle.overview')" />
    <overview-quick-links class="mb-4" />
    <page-section
      :section-title="$t('pageOverview.systemInformation')"
      class="mb-1"
    >
      <b-card-group deck>
        <overview-server />
        <overview-firmware />
      </b-card-group>
      <b-card-group deck>
        <overview-network />
        <overview-power />
      </b-card-group>
    </page-section>
    <page-section :section-title="$t('pageOverview.statusInformation')">
      <b-card-group deck>
        <overview-events />
        <overview-inventory />
        <overview-dumps v-if="showDumps" />
      </b-card-group>
    </page-section>
  </b-container>
</template>

<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import OverviewDumps from './OverviewDumps.vue';
import OverviewEvents from './OverviewEvents.vue';
import OverviewFirmware from './OverviewFirmware.vue';
import OverviewInventory from './OverviewInventory.vue';
import OverviewNetwork from './OverviewNetwork';
import OverviewPower from './OverviewPower';
import OverviewQuickLinks from './OverviewQuickLinks';
import OverviewServer from './OverviewServer';
import PageSection from '@/components/Global/PageSection';
import PageTitle from '@/components/Global/PageTitle';

export default {
  name: 'Overview',
  components: {
    OverviewDumps,
    OverviewEvents,
    OverviewFirmware,
    OverviewInventory,
    OverviewNetwork,
    OverviewPower,
    OverviewQuickLinks,
    OverviewServer,
    PageSection,
    PageTitle,
  },
  mixins: [LoadingBarMixin],
  data() {
    return {
      showDumps: process.env.VUE_APP_ENV_NAME === 'ibm',
    };
  },
  created() {
    this.startLoader();
    const dumpsPromise = new Promise((resolve) => {
      this.$root.$on('overview-dumps-complete', () => resolve());
    });
    const eventsPromise = new Promise((resolve) => {
      this.$root.$on('overview-events-complete', () => resolve());
    });
    const firmwarePromise = new Promise((resolve) => {
      this.$root.$on('overview-firmware-complete', () => resolve());
    });
    const inventoryPromise = new Promise((resolve) => {
      this.$root.$on('overview-inventory-complete', () => resolve());
    });
    const networkPromise = new Promise((resolve) => {
      this.$root.$on('overview-network-complete', () => resolve());
    });
    const powerPromise = new Promise((resolve) => {
      this.$root.$on('overview-power-complete', () => resolve());
    });
    const quicklinksPromise = new Promise((resolve) => {
      this.$root.$on('overview-quicklinks-complete', () => resolve());
    });
    const serverPromise = new Promise((resolve) => {
      this.$root.$on('overview-server-complete', () => resolve());
    });

    Promise.all([
      dumpsPromise,
      eventsPromise,
      firmwarePromise,
      inventoryPromise,
      networkPromise,
      powerPromise,
      quicklinksPromise,
      serverPromise,
    ]).finally(() => this.endLoader());
  },
};
</script>
