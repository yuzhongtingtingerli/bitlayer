export const getAddress = (add) => {
  if (add === "") return "";
  if (!add) return "";
  return add?.slice(0, 4) + "......" + add?.slice(-4);
};
export const getMoney = (money) => {
  if (money === "") return "";
  if (money === 0) return "0";
  if (money === "null") return "0";
  const num = money.toString().split(".")[0].length > 6 ? 3 : 6;
  const m = Number(money).toFixed(num);
  // 每隔三位小数加一个,
  return m?.toString().replace(/\d+/, function (n) {
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ",";
    });
  });
};

export const getFloorNum = (money) => {
  return Number((Math.floor(money * 10 ** 6) / 10 ** 6).toFixed(6));
};

export const getUniSatAddress = async () => {
  if (window.unisat) {
    if (window.address) return window.address;
    let unisat = window.unisat;
    const accounts = await unisat?.requestAccounts();
    if (accounts && accounts.length > 0) {
      return accounts[0];
    }
  }
};

export const toUpperCase = (str) => {
  if (str === "") return;
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};
