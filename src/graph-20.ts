import { BigInt } from "@graphprotocol/graph-ts";
import {
  Graph20,
  Transfer as TransferEvent,
  Approval as ApprovalEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
} from "../generated/Graph20/Graph20";
import {
  Token,
  Account,
  Transfer,
  Approval,
  OwnershipTransferred,
} from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load("1");
  if (!token) {
    token = new Token("1");
    token.name = "ApeReward";
    token.symbol = "APR";
    token.decimals = 18;
    token.totalSupply = BigInt.fromI32(0);
  }
  token.save();

  let fromAccount = Account.load(event.params.from.toHex());
  if (!fromAccount) {
    fromAccount = new Account(event.params.from.toHex());
    fromAccount.balance = BigInt.fromI32(0);
  }
  fromAccount.balance = fromAccount.balance.minus(event.params.value);
  fromAccount.save();

  let toAccount = Account.load(event.params.to.toHex());
  if (!toAccount) {
    toAccount = new Account(event.params.to.toHex());
    toAccount.balance = BigInt.fromI32(0);
  }
  toAccount.balance = toAccount.balance.plus(event.params.value);
  toAccount.save();

  let transfer = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  transfer.from = fromAccount.id;
  transfer.to = toAccount.id;
  transfer.value = event.params.value;
  transfer.timestamp = event.block.timestamp;
  transfer.block = event.block.number;
  transfer.save();
}

export function handleApproval(event: ApprovalEvent): void {
  let approval = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  approval.owner = event.params.owner.toHex();
  approval.spender = event.params.spender.toHex();
  approval.value = event.params.value;
  approval.timestamp = event.block.timestamp;
  approval.block = event.block.number;
  approval.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let ownershipTransferred = new OwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  ownershipTransferred.previousOwner = event.params.previousOwner;
  ownershipTransferred.newOwner = event.params.newOwner;
  ownershipTransferred.timestamp = event.block.timestamp;
  ownershipTransferred.block = event.block.number;
  ownershipTransferred.save();
}
