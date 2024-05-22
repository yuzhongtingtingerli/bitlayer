import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    defaultAccount: "", //钱包账号
  },
  mutations: {
    //
  },
  actions: {
    async linkWallet() {
      // 已经连接了钱包
      if (this.defaultAccount) {
        return true;
      }
      // 没有钱包就跳转
      if (!window.unisat) {
        console.log("UniSat Wallet is installed!");
        window.open("https://unisat.io/");
        return;
      }
      // 链接钱包
      try {
        let unisat = window.unisat;
        const accounts = await unisat?.requestAccounts();
        this.setAccount(accounts[0]);
        this.subscribeProvider();
      } catch (error) {
        console.log(error, "error");
      }
    },
    async setAccount(account) {
      this.defaultAccount = account;
    },
    async subscribeProvider() {
      // 监听切账号
      window.unisat?.on("accountsChanged", (accounts) => {
        // this.changeSignal.countWallet++;
        this.defaultAccount = accounts[0];
        console.log("change account..", accounts, this.defaultAccount);
      });
    },
  },
});
