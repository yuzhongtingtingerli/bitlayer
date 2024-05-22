import { ErrorCodes, WalletUtilsError } from "@unisat/wallet-sdk/es/error";
import { NetworkType } from "@unisat/wallet-sdk/es/network";
import { Transaction } from "@unisat/wallet-sdk/es/transaction/transaction";
import { utxoHelper } from "@unisat/wallet-sdk/es/transaction/utxo";
import { ToSignInput, UnspentOutput } from "./types";

export async function sendInscriptions({
  assetUtxos,
  btcUtxos,
  toAddress,
  networkType,
  changeAddress,
  feeRate,
  enableRBF = true,
  sendBtcValue = 0,
  serviceAddress = "",
}: {
  assetUtxos: UnspentOutput[];
  btcUtxos: UnspentOutput[];
  toAddress: string;
  networkType: NetworkType;
  changeAddress: string;
  feeRate: number;
  enableRBF?: boolean;
  sendBtcValue?: number;
  serviceAddress?: string;
}) {
  if (utxoHelper.hasAnyAssets(btcUtxos)) {
    throw new WalletUtilsError(ErrorCodes.NOT_SAFE_UTXOS);
  }

  if (utxoHelper.hasAtomicals(assetUtxos)) {
    throw new WalletUtilsError(ErrorCodes.NOT_SAFE_UTXOS);
  }

  const tx = new Transaction();
  tx.setNetworkType(networkType);
  tx.setFeeRate(feeRate);
  tx.setEnableRBF(enableRBF);
  tx.setChangeAddress(changeAddress);

  const toSignInputs: ToSignInput[] = [];

  for (let i = 0; i < assetUtxos.length; i++) {
    const assetUtxo = assetUtxos[i];
    if (assetUtxo.inscriptions.length > 1) {
      throw new Error(
        "Multiple inscriptions in one UTXO! Please split them first."
      );
    }
    tx.addInput(assetUtxo);
    tx.addOutput(toAddress, assetUtxo.satoshis);
    toSignInputs.push({ index: i, publicKey: assetUtxo.pubkey });
  }

  tx.addOutput(assetUtxos[0]?.serviceAddress, assetUtxos[0]?.sendBtcValue);

  const _toSignInputs = await tx.addSufficientUtxosForFee(btcUtxos);
  toSignInputs.push(..._toSignInputs);

  const psbt = tx.toPsbt();

  return { psbt, toSignInputs };
}
