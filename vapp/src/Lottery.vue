<template>
  <div>
    <div className="container">
      <h1 className="text-center">Lottery</h1>

      <p>Only admin account[0] can perform this</p>
      <hr />
      <p>House Fee: {{ houseFee }}</p>
      <p>State: {{ states[bet.state] }}</p>

      <div v-if="bet.state === 1">
        <p>Bet size: {{ bet.size }}</p>
        <p>Bet count: {{ bet.count }}</p>
        <div>
          <h2>Players</h2>
          <ul>
            <li v-for="player in players" :key="player.id">{{ player }}</li>
          </ul>
        </div>
      </div>

      <div className="row" v-if="bet.state === 0">
        <div className="col-sm-12">
          <h2>Create bet</h2>
          <form @submit.prevent="createBet">
            <div className="form-group">
              <label htmlFor="count">Count</label>
              <input
                v-model="count"
                type="text"
                className="form-control"
                id="count"
              />
            </div>
            <div className="form-group">
              <label htmlFor="size">Size</label>
              <input
                v-model="size"
                type="text"
                className="form-control"
                id="size"
              />
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </div>
      </div>

      <div
        className="row"
        v-if="bet.state === 1 && activeAccount === bet.admin"
      >
        <div className="col-sm-12">
          <h2>Cancel bet</h2>
          <button
            @click.prevent="cancel"
            type="submit"
            className="btn btn-primary"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="row" v-if="bet.state === 1">
        <div className="col-sm-12">
          <h2>Bet</h2>
          <button
            @click.prevent="doBet"
            type="submit"
            className="btn btn-primary"
          >
            Bet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("accounts", ["activeAccount"]),
    ...mapGetters("drizzle", ["drizzleInstance"]),
    ...mapGetters({
      betData: "getBetData",
    }),
  },
  data: () => ({
    states: ["IDLE", "BETTING"],
    bet: {},
    players: undefined,
    houseFee: undefined,
    count: undefined,
    size: undefined,
  }),
  methods: {
    createBet() {
      this.drizzleInstance.contracts.Lottery.methods
        .createBet(this.count, this.size)
        .send()
        .then(() => {
          this.init();
        });
    },
    cancel() {
      this.drizzleInstance.contracts.Lottery.methods
        .cancel()
        .send()
        .then(() => {
          this.init();
        });
    },
    doBet() {
      this.drizzleInstance.contracts.Lottery.methods
        .bet()
        .send({ value: this.bet.size })
        .then(() => {
          this.init();
        });
    },
    async init() {
      const contract = this.drizzleInstance.contracts.Lottery;
      await Promise.all([
        contract.methods
          .houseFee()
          .call()
          .then((res) => {
            this.houseFee = res;
          }),
        contract.methods
          .currentState()
          .call()
          .then((res) => {
            this.bet.state = parseInt(res);
          }),
      ]);
      const bet = await Promise.all([
        contract.methods.betCount().call(),
        contract.methods.betSize().call(),
        contract.methods.admin().call(),
        contract.methods.currentState().call(),
      ]);
      this.bet = {
        count: bet[0],
        size: bet[1],
        admin: bet[2],
        state: parseInt(bet[3]),
      };
    },
  },
  created() {
    this.init();
  },
};
</script>
