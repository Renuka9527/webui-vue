<template>
  <div>
    <b-row>
      <b-col class="d-flex align-items-center justify-content-between">
        <dl class="mt-3 mr-3 w-75">
          <dt id="rpd-policy-label">
            {{ $t('pageSystemParameters.rpdFeature') }}
          </dt>
          <dd id="rpd-policy-description">
            {{ $t('pageSystemParameters.rpdFeatureDescription') }}
          </dd>
        </dl>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="8" xl="6">
        <b-form novalidate @submit.prevent="updateRpdFeature">
          <b-select
            v-model="selectedFeatureOption"
            :options="rpdFeatOptions"
          ></b-select>
          <b-button variant="primary" type="submit" class="mt-3 mb-3">
            {{ $t('pageSystemParameters.updateRpdFeature') }}
          </b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="d-flex align-items-center justify-content-between">
        <dl class="mt-3 mr-3 w-75">
          <dt id="rpd-policy-label">
            {{ $t('pageSystemParameters.rpdPolicy') }}
          </dt>
          <dd id="rpd-policy-description">
            {{ $t('pageSystemParameters.rpdPolicyDescription') }}
          </dd>
        </dl>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="8" xl="6">
        <b-form novalidate @submit.prevent="updateRpdPolicy">
          <b-select
            v-model="selectedOption"
            :options="options"
            :disabled="isRpdFeatureCurrentDisabled"
          ></b-select>
          <b-button
            variant="primary"
            type="submit"
            class="mt-3 mb-3"
            :disabled="isRpdFeatureCurrentDisabled"
          >
            {{ $t('pageSystemParameters.updateRpdPolicy') }}
          </b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="d-flex align-items-center justify-content-between">
        <dl class="mt-3 mr-3 w-75">
          <dt id="rpd-scheduled-run-label">
            {{ $t('pageSystemParameters.rpdScheduledRun') }}
          </dt>
          <dd id="rpd-scheduled-run-description">
            {{ $t('pageSystemParameters.rpdScheduledRunDescription') }}
          </dd>
        </dl>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="8" xl="6">
        <b-form>
          <b-form-group
            :label="$t('pageSystemParameters.startTime')"
            label-for="start-time"
            class="mb-3"
          >
            <b-input-group>
              <b-form-input
                id="input-rpd-scheduled-run"
                v-model="rpdScheduledRun"
                :state="getValidationState($v.rpdScheduledRun)"
                :disabled="isRpdFeatureCurrentDisabled || !isRpdPolicyScheduled"
                @blur="$v.rpdScheduledRun.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <div v-if="!$v.rpdScheduledRun.pattern">
                  {{ $t('global.form.invalidFormat') }}
                </div>
              </b-form-invalid-feedback>
            </b-input-group>
          </b-form-group>
          <b-form-group
            :label="$t('pageSystemParameters.duration')"
            label-for="duration"
            class="mb-3"
          >
            <b-form-input
              id="input-rpd-scheduled-run-duration"
              v-model.number="rpdScheduledRunDuration"
              type="number"
              :min="0"
              :max="86399"
              :state="getValidationState($v.rpdScheduledRunDuration)"
              :disabled="isRpdFeatureCurrentDisabled || !isRpdPolicyScheduled"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              <template
                v-if="
                  !$v.rpdScheduledRunDuration.minLength ||
                  !$v.rpdScheduledRunDuration.maxLength
                "
              >
                {{
                  $t('global.form.valueMustBeBetween', {
                    min: 30,
                    max: 1440,
                  })
                }}
              </template>
            </b-form-invalid-feedback>
            <b-button
              variant="primary"
              class="mt-3 mb-3"
              :disabled="isRpdFeatureCurrentDisabled || !isRpdPolicyScheduled"
              @click="
                updateRpdScheduledRun(rpdScheduledRun, rpdScheduledRunDuration)
              "
            >
              {{ $t('pageSystemParameters.updateRpdScheduledRun') }}
            </b-button>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
    <b-row></b-row>
    <b-row>
      <b-col class="d-flex align-items-center justify-content-between">
        <dl class="mt-3 mr-3 w-75">
          <dt id="gard-on-error-label">
            {{ $t('pageSystemParameters.gardOnError') }}
          </dt>
          <dd id="gard-on-error-description">
            {{ $t('pageSystemParameters.gardOnErrorDescription') }}
          </dd>
        </dl>
        <b-form-checkbox
          id="gardOnErrorSwitch"
          v-model="gardOnErrorState"
          aria-labelledby="gard-on-error-label"
          aria-describedby="gard-on-error-description"
          switch
          :disabled="isRpdFeatureCurrentDisabled"
          @change="updateGardOnErrorState"
        >
          <span v-if="gardOnErrorState">
            {{ $t('global.status.enabled') }}
          </span>
          <span v-else>{{ $t('global.status.disabled') }}</span>
        </b-form-checkbox>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="d-flex align-items-center justify-content-between">
        <dl class="mt-3 mr-3 w-75">
          <dt id="immediate-test-requested-label">
            {{ $t('pageSystemParameters.immediateTestRequested') }}
          </dt>
          <dd id="immediate-test-requested-description">
            {{ $t('pageSystemParameters.immediateTestRequestedDescription') }}
          </dd>
        </dl>
      </b-col>
    </b-row>
    <b-row>
      <b-button
        variant="primary"
        type="submit"
        class="ml-3"
        :disabled="immediateTestRequestedState || isRpdFeatureCurrentDisabled"
        @click="updateImmediateTestRequestedState()"
      >
        {{ $t('pageSystemParameters.runNow') }}
      </b-button>
    </b-row>
  </div>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import { mapGetters } from 'vuex';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { helpers } from 'vuelidate/lib/validators';
import { minValue, maxValue } from 'vuelidate/lib/validators';

const isoTimeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
export default {
  name: 'RuntimeProcessorDiagnostic',
  mixins: [LoadingBarMixin, BVToastMixin, VuelidateMixin],
  props: {
    safeMode: {
      type: Boolean,
      default: null,
    },
  },
  computed: {
    ...mapGetters('systemParameters', [
      'rpdPolicy',
      'rpdPolicyOptions',
      'rpdFeature',
      'rpdFeatureOptions',
      'pvmRpdPolicy',
    ]),
    selectedOption: {
      get() {
        return this.rpdPolicy;
      },
      set(value) {
        // Do something when the option is selected
        // e.g. update the value in the store
        this.$store.commit('systemParameters/setRpdPolicy', value);
      },
    },
    selectedFeatureOption: {
      get() {
        return this.rpdFeature;
      },
      set(value) {
        // Do something when the option is selected
        // e.g. update the value in the store
        this.$store.commit('systemParameters/setRpdFeature', value);
      },
    },
    isRpdPolicyScheduled() {
      return this.pvmRpdPolicy === 'Scheduled';
    },
    options() {
      return this.rpdPolicyOptions.map((option) => ({
        value: option,
        text: option,
      }));
    },
    rpdFeatOptions() {
      return this.rpdFeatureOptions.map((option) => ({
        value: option,
        text: option,
      }));
    },
    isRpdFeatureCurrentDisabled() {
      return (
        this.$store.getters['systemParameters/rpdPolicyCurrent'] === 'Disabled'
      );
    },
    aggressivePrefetchState: {
      get() {
        return this.$store.getters['systemParameters/aggressivePrefetch'];
      },
      set(newValue) {
        return newValue;
      },
    },
    immediateTestRequestedState: {
      get() {
        return this.$store.getters['systemParameters/immediateTestRequested'];
      },
      set(newValue) {
        return newValue;
      },
    },
    rpdScheduledRun: {
      get() {
        return this.$store.getters['systemParameters/rpdScheduledRun'];
      },
      set(value) {
        this.$v.$touch();
        this.$store.commit('systemParameters/setRpdScheduledRun', value);
      },
    },
    rpdScheduledRunDuration: {
      get() {
        return this.$store.getters['systemParameters/rpdScheduledRunDuration'];
      },
      set(value) {
        this.$v.$touch();
        this.$store.commit(
          'systemParameters/setRpdScheduledRunDuration',
          value
        );
      },
    },
    gardOnErrorState: {
      get() {
        return this.$store.getters['systemParameters/gardOnError'];
      },
      set(newValue) {
        return newValue;
      },
    },
  },
  validations() {
    return {
      rpdScheduledRun: {
        pattern: helpers.regex('pattern', isoTimeRegex),
      },
      rpdScheduledRunDuration: {
        minValue: minValue(30),
        maxValue: maxValue(1440),
      },
    };
  },
  watch: {
    selectedItem: function (newValue) {
      this.$store.dispatch('systemParameters/setRpdPolicy', newValue);
    },
    selectedFeatureItem: function (newValue) {
      this.$store.dispatch('systemParameters/setRpdFeature', newValue);
    },
  },
  methods: {
    updateImmediateTestRequestedState() {
      this.startLoader();
      Promise.all([
        this.$store.dispatch('systemParameters/saveImmediateTestRequested'),
        this.$store.dispatch('systemParameters/getRpdScheduledRun'),
      ]).finally(() => this.endLoader());
    },
    updateGardOnErrorState(state) {
      this.$store
        .dispatch('systemParameters/saveGardOnError', state)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    updateRpdPolicy() {
      this.startLoader();
      let rpdPolicyValue = this.selectedOption;
      this.$store
        .dispatch('systemParameters/saveRpdPolicy', rpdPolicyValue)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.endLoader();
        });
    },
    updateRpdFeature() {
      this.startLoader();
      let rpdFeatureValue = this.selectedFeatureOption;
      this.$store
        .dispatch('systemParameters/saveRpdFeature', rpdFeatureValue)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.endLoader();
        });
    },
    updateRpdScheduledRun(startTime, duration) {
      this.startLoader();
      const [hours, minutes] = startTime.split(':');
      const totalSeconds = (+hours * 60 + +minutes) * 60;
      this.$store
        .dispatch('systemParameters/saveRpdScheduledRun', {
          totalSeconds,
          duration,
          startTime,
        })
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.endLoader();
        });
    },
  },
};
</script>
