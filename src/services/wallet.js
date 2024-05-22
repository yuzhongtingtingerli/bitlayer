import {
  getBrc20Summary,
  getRecommended,
  getTransferableInscriptions,
  getUtxoDataInfo,
  getInscriptionInfo,
} from "./walletApi";

export const getBrc20SummaryData = async (params) => {
  try {
    const { code, data, msg } = await getBrc20Summary(params);
    const statusCode = parseInt(code);
    if (statusCode === 0) {
      return { msg, data };
    } else {
      return { msg };
    }
  } catch (error) {
    return { msg: error };
  }
};

export const getTransferableInscriptionsData = async (params) => {
  try {
    const { code, data, msg } = await getTransferableInscriptions(params);
    const statusCode = parseInt(code);
    if (statusCode === 0) {
      return { msg, data };
    } else {
      return { msg };
    }
  } catch (error) {
    return { msg: error };
  }
};

export const getRecommendedData = async () => {
  try {
    const data = await getRecommended();
    return data;
  } catch (error) {
    return { msg: error };
  }
};

export const getUtxoData = async (params) => {
  try {
    const data = await getUtxoDataInfo(params);
    return data;
  } catch (error) {
    return { msg: error };
  }
};

export const getInscriptionInfoData = async (params) => {
  try {
    const data = await getInscriptionInfo(params);
    return data;
  } catch (error) {
    return { msg: error };
  }
};
