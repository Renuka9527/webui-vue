<template>
  <overview-card
    :title="$t('pageOverview.firmwareInformation')"
    :to="`/operations/firmware`"
  >
    <b-row class="mt-3">
      <b-col sm="5">
        <dl>
          <dt>{{ $t('pageOverview.runningVersion') }}</dt>
          <dd>{{ dataFormatter(runningVersion) }}</dd>
          <dt>{{ $t('pageOverview.backupVersion') }}</dt>
          <dd>{{ dataFormatter(backupVersion) }}</dd>
        </dl>
      </b-col>
      <b-col sm="7">
        <dl>
          <dt>{{ $t('pageOverview.accessKeyExpiration') }}</dt>
          <dd>
            {{
              dataFormatter(firmwareAccessKeyInfo.expirationDate) | formatDate
            }}
          </dd>
        </dl>
      </b-col>
    </b-row>
  </overview-card>
</template>

<script>
import OverviewCard from './OverviewCard';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';

export default {
  name: 'Firmware',
  components: {
    OverviewCard,
  },
  mixins: [DataFormatterMixin],
  computed: {
    firmwareAccessKeyInfo() {
      return this.$store.getters['licenses/firmwareAccessKeyInfo'];
    },
    backupBmcFirmware() {
      return this.$store.getters['firmware/backupBmcFirmware'];
    },
    backupVersion() {
      return this.backupBmcFirmware?.version;
    },
    activeBmcFirmware() {
      return this.$store.getters[`firmware/activeBmcFirmware`];
    },
    runningVersion() {
      return this.activeBmcFirmware?.version;
    },
  },
  created() {
    Promise.all([
      this.$store.dispatch('licenses/getLicenses'),
      this.$store.dispatch('firmware/getFirmwareInformation'),
    ]).finally(() => {
      this.$root.$emit('overview-firmware-complete');
    });
  },
};
</script>
