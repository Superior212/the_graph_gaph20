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
  // Load the Token entity
  let token = Token.load("1");
  if (!token) {
    // If the Token entity doesn't exist, create it with initial values
    token = new Token("1");
    token.name = "GRAPH20";
    token.symbol = "GRP";
    token.decimals = 18;
    token.totalSupply = BigInt.fromI32(0);
  }
  token.save();

  // Handle the 'from' account
  let fromAccount = Account.load(event.params.from.toHexString());
  if (!fromAccount) {
    // If the 'from' account doesn't exist, create it
    fromAccount = new Account(event.params.from.toHexString());
    fromAccount.balance = BigInt.fromI32(0);
  }
  // Decrease the balance of the 'from' account
  fromAccount.balance = fromAccount.balance.minus(event.params.value);
  fromAccount.save();

  // Handle the 'to' account
  let toAccount = Account.load(event.params.to.toHexString());
  if (!toAccount) {
    // If the 'to' account doesn't exist, create it
    toAccount = new Account(event.params.to.toHexString());
    toAccount.balance = BigInt.fromI32(0);
  }
  // Increase the balance of the 'to' account
  toAccount.balance = toAccount.balance.plus(event.params.value);
  toAccount.save();

  // Create a new Transfer entity to record this event
  let transfer = new Transfer(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  transfer.from = fromAccount.id;
  transfer.to = toAccount.id;
  transfer.value = event.params.value;
  transfer.timestamp = event.block.timestamp;
  transfer.block = event.block.number;
  transfer.save();
}

export function handleApproval(event: ApprovalEvent): void {
  // Create a new Approval entity to record this event
  let approval = new Approval(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  approval.owner = event.params.owner.toHexString();
  approval.spender = event.params.spender.toHexString();
  approval.value = event.params.value;
  approval.timestamp = event.block.timestamp;
  approval.block = event.block.number;
  approval.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  // Create a new OwnershipTransferred entity to record this event
  let ownershipTransferred = new OwnershipTransferred(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  ownershipTransferred.previousOwner = event.params.previousOwner;
  ownershipTransferred.newOwner = event.params.newOwner;
  ownershipTransferred.timestamp = event.block.timestamp;
  ownershipTransferred.block = event.block.number;
  ownershipTransferred.save();
}
