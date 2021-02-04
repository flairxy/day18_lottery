import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const state = () => ({
  betData: {},
});

const getters = {
  getBetData(state) {
    return state.betData;
  },
};

const actions = {
  set_betData({ commit }, data) {
    commit("setBetData", data);
  },
};

const mutations = {
  setBetData(state, data) {
    state.betData = data;
  },
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
