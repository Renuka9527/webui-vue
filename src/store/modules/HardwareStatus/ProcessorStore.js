import api from '@/store/api';
import i18n from '@/i18n';

const ProcessorStore = {
  namespaced: true,
  state: {
    processors: [],
  },
  getters: {
    processors: (state) => state.processors,
  },
  mutations: {
    setProcessorsInfo: (state, data) => {
      state.processors = data.map((processor) => {
        const {
          Id,
          Status = {},
          PartNumber,
          SerialNumber,
          SparePartNumber,
          Model,
          Name,
          ProcessorType,
          TotalCores,
          Location,
          LocationIndicatorActive,
        } = processor;
        return {
          id: Id,
          health: Status.Health,
          partNumber: PartNumber,
          sparePartNumber: SparePartNumber,
          serialNumber: SerialNumber,
          status: Status.State,
          model: Model,
          name: Name,
          processorType: ProcessorType,
          totalCores: TotalCores,
          locationNumber: Location?.PartLocation?.ServiceLabel,
          identifyLed: LocationIndicatorActive,
          uri: processor['@odata.id'],
        };
      });
    },
  },
  actions: {
    async getProcessorsInfo({ commit }) {
      commit('setProcessorsInfo', []);
      return await api
        .get('/redfish/v1/Systems/system/Processors')
        .then(({ data: { Members = [] } }) =>
          Members.map((member) => api.get(member['@odata.id']))
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const data = response.map(({ data }) => data);
          commit('setProcessorsInfo', data);
        })
        .catch((error) => console.log(error));
    },
    // Waiting for the following to be merged to test the Identify Led:
    // https://gerrit.openbmc-project.xyz/c/openbmc/bmcweb/+/37045
    async updateIdentifyLedValue({ dispatch }, led) {
      const uri = led.uri;
      const updatedIdentifyLedValue = {
        LocationIndicatorActive: led.identifyLed,
      };
      return await api
        .patch(uri, updatedIdentifyLedValue)
        .then(() => {
          if (led.identifyLed) {
            return i18n.t('pageInventory.toast.successEnableIdentifyLed');
          } else {
            return i18n.t('pageInventory.toast.successDisableIdentifyLed');
          }
        })
        .catch((error) => {
          dispatch('getProcessorsInfo');
          console.log('error', error);
          if (led.identifyLed) {
            throw new Error(
              i18n.t('pageInventory.toast.errorEnableIdentifyLed')
            );
          } else {
            throw new Error(
              i18n.t('pageInventory.toast.errorDisableIdentifyLed')
            );
          }
        });
    },
  },
};

export default ProcessorStore;
