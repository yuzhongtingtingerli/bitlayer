import { request, requestPost } from "./request.js";

export const getGroupDetailInfo = (params) => {
  return request(
    `/bitlayer/blockchain/getGroupDetailInfo?UserAddress=${params}`,
    "get"
  );
};

export const getScore = (params) => {
  return request(`/bitlayer/blockchain/getScore?UserAddress=${params}`, "get");
};

export const getJoinGroup = (params) => {
  return request(
    `/bitlayer/blockchain/getJoinGroup?UserAddress=${params}`,
    "get"
  );
};

export const getGroupList = ({ Offset, Limit }) => {
  return request(
    `/bitlayer/blockchain/getGroupList?Offset=${Offset}&Limit=${Limit}`,
    "get"
  );
};

export const getTokenLogo = () => {
  return request(`/bitlayer/blockchain/getTokenLogo`, "get");
};

export const getGroupScoreRank = ({ Offset, Limit, groupName }) => {
  return request(
    `/bitlayer/blockchain/getGroupScoreRank?Offset=${Offset}&Limit=${Limit}&GroupName=${groupName}`,
    "get"
  );
};

export const getScoreRank = ({ Offset, Limit }) => {
  return request(
    `/bitlayer/blockchain/getScoreRank?Offset=${Offset}&Limit=${Limit}`,
    "get"
  );
};

export const getGroupTVLRank = () => {
  return request(`/bitlayer/blockchain/getGroupTVLRank`, "get");
};

export const getPersonalTVLRank = () => {
  return request(`/bitlayer/blockchain/getPersonalTVLRank`, "get");
};

export const getLastScoreRank = ({ Offset, Limit }) => {
  return request(
    `/bitlayer/blockchain/getLastScoreRank?Offset=${Offset}&Limit=${Limit}`,
    "get"
  );
};

export const getGroupSearch = (groupName) => {
  return request(
    `/bitlayer/blockchain/getGroupSearch?TokenSymbol=${groupName}`,
    "get"
  );
};

// 获取桥的记录列表
export const getBridgeList = ({ BridgeType, UserAddress, Offset, Limit }) => {
  return request(
    `/bitlayer/stake/getBridgeList?BridgeType=${BridgeType}&UserAddress=${UserAddress}&Offset=${Offset}&Limit=${Limit}`,
    "get"
  );
};

export const doBridge = ({
  BridgeFromAddress,
  BridgeType,
  BridgeTokenSymbol,
  BridgeTokenBalance,
  BridgeTxHash,
  BridgeToAddress,
}) => {
  return request(
    `/bitlayer/stake/doBridge?BridgeFromAddress=${BridgeFromAddress}&BridgeType=${BridgeType}&BridgeTokenSymbol=${BridgeTokenSymbol}&BridgeTokenBalance=${BridgeTokenBalance}&BridgeTxHash=${BridgeTxHash}&BridgeToAddress=${BridgeToAddress}`,
    "get"
  );
};

export const getTotalStakeInfo = () => {
  return request(`/bitlayer/stake/getTotalStakeInfo`, "get");
};

export const getBRCList = () => {
  return request(`/bitlayer/stake/getBRCList`, "get");
};

export const getWalletStakeInfo = ({ UserAddress }) => {
  return request(
    `/bitlayer/stake/getWalletStakeInfo?UserAddress=${UserAddress}`,
    "get"
  );
};

export const getSakeList = ({ UserAddress }) => {
  return request(
    `/bitlayer/stake/getSakeList?UserAddress=${UserAddress}`,
    "get"
  );
};

export const getTreasure = ({ UserAddress }) => {
  return request(
    `/bitlayer/stake/getTreasure?UserAddress=${UserAddress}`,
    "get"
  );
};

export const doStake = ({
  UserAddress,
  StakeTokenSymbol,
  StakeTokenBalance,
  StakeTxHash,
}) => {
  return request(
    `/bitlayer/stake/doStake?UserAddress=${UserAddress}&StakeTokenSymbol=${StakeTokenSymbol}&StakeTokenBalance=${StakeTokenBalance}&StakeTxHash=${StakeTxHash}`,
    "get"
  );
};

export const getTVLStatus = ({ StakeTokenSymbol, StakeTokenBalance }) => {
  return request(
    `/bitlayer/stake/getTVLStatus?StakeTokenSymbol=${StakeTokenSymbol}&StakeTokenBalance=${StakeTokenBalance}`,
    "get"
  );
};

export const checkAddressMapping = ({ BtcAddress, EthAddress }) => {
  return request(
    `/bitlayer/stake/checkAddressMapping?BtcAddress=${BtcAddress}&EthAddress=${EthAddress}`,
    "get"
  );
};

export const insertAddressMapping = ({ BtcAddress, EthAddress }) => {
  return request(
    `/bitlayer/stake/insertAddressMapping?BtcAddress=${BtcAddress}&EthAddress=${EthAddress}`,
    "get"
  );
};

export const getETHContractAddress = ({ TokenSymbol }) => {
  return request(
    `/bitlayer/stake/getETHContractAddress?TokenSymbol=${TokenSymbol}`,
    "get"
  );
};

export const getTransferInfo = ({ TokenSymbol, TokenBalance }) => {
  return request(
    `/bitlayer/stake/getTransferInfo?TokenSymbol=${TokenSymbol}&TokenBalance=${TokenBalance}`,
    "get"
  );
};

export const checkRuningStatus = () => {
  return request(`/common/checkRuningStatus`, "get");
};

export const checkNftStatus = ({ InscriptionID }) => {
  return request(
    `/bitlayer/nft/checkNftStatus?InscriptionID=${InscriptionID}`,
    "get"
  );
};

export const getNftGroupList = () => {
  return request(`/bitlayer/nft/getGroupList`, "get");
};

export const doUseNft = ({ UserAddress, UsedGroup, InscriptionID }) => {
  return request(
    `/bitlayer/nft/doUseNft?UserAddress=${UserAddress}&UsedGroup=${UsedGroup}&InscriptionID=${InscriptionID}`,
    "get"
  );
};

export const doUseNftPost = ({
  BTCAddress,
  ETHAddress,
  UsedGroup,
  InscriptionID,
}) => {
  return requestPost(`/bitlayer/nft/doUseNftPost`, "post", {
    BTCAddress,
    ETHAddress,
    UsedGroup,
    InscriptionID,
  });
};

export const getNftGroupDetailInfo = ({ UserAddress }) => {
  return request(
    `/bitlayer/nft/getNftGroupDetailInfo?UserAddress=${UserAddress}`,
    "get"
  );
};

export const getNftScore = ({ UserAddress }) => {
  return request(`/bitlayer/nft/getNftScore?UserAddress=${UserAddress}`, "get");
};

export const getTokenContract = ({ UserAddress }) => {
  return request(
    `/bitlayer/blockchain/getTokenContract?UserAddress=${UserAddress}`,
    "get"
  );
};

export const addCustomerToken = ({
  UserAddress,
  TokenSymbol,
  TokenContractAddress,
}) => {
  return requestPost(`/bitlayer/blockchain/addCustomerToken`, "post", {
    UserAddress,
    TokenSymbol,
    TokenContractAddress,
  });
};

export const getTotalTokenContract = () => {
  return request(`/bitlayer/stake/getTotalTokenContract`, "get");
};

export const getAssetList = ({ EthAddress, ContractType }) => {
  let url;
  if (ContractType) {
    url = `/bitlayer/withdraw/withdrawAssetList?EthAddress=${EthAddress}&ContractType=${ContractType}`;
  } else {
    url = `/bitlayer/withdraw/withdrawAssetList?EthAddress=${EthAddress}`;
  }
  return request(url, "get");
};

export const doWithdraw = ({
  StakeAddress,
  StakeSymbol,
  StakeTokenStatus,
  Txhash,
}) => {
  return requestPost(`/bitlayer/withdraw/doWithdraw`, "post", {
    StakeAddress,
    StakeSymbol,
    StakeTokenStatus,
    Txhash,
  });
};

export const doUseHamletPost = ({ ETHAddress, UsedGroup, TokenID }) => {
  return requestPost(`/bitlayer/nft/doUseHamletPost`, "post", {
    ETHAddress,
    UsedGroup,
    TokenID,
  });
};
