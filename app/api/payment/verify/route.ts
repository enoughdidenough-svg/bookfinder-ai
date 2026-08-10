const MERCHANT = "TLPJSxHjfkfANiv9BueXDhXtSXe9dpDDrn";
const USDT_TRON = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const REQUIRED_USDT_MICRO = 5_000_000;

export async function POST(request: Request) {
  let body: { txHash?: string };
  try { body = await request.json(); } catch { return Response.json({ message: "Invalid request." }, { status: 400 }); }
  const txHash = body.txHash?.trim();
  if (!txHash || !/^[a-fA-F0-9]{64}$/.test(txHash)) return Response.json({ message: "Enter a valid 64-character TRON transaction hash." }, { status: 400 });

  try {
    const url = `https://api.trongrid.io/v1/transactions/${txHash}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return Response.json({ message: "Transaction not found on TRON yet. Wait for confirmation and try again." }, { status: 400 });
    const tx = await response.json();
    const confirmed = tx?.ret?.some((item: { contractRet?: string }) => item.contractRet === "SUCCESS");
    if (!confirmed) return Response.json({ message: "This transaction is not confirmed successfully on TRON." }, { status: 400 });

    const contract = tx?.raw_data?.contract?.[0];
    const parameter = contract?.parameter?.value;
    const isTransfer = contract?.type === "TriggerSmartContract" && parameter?.contract_address;

    // Full TRC20 event data is queried separately so the verification does not trust client input.
    if (!isTransfer) return Response.json({ message: "That transaction is not a TRC20 token transfer." }, { status: 400 });
    const eventsUrl = `https://api.trongrid.io/v1/transactions/${txHash}/events?only_confirmed=true&limit=20`;
    const eventsResponse = await fetch(eventsUrl, { cache: "no-store" });
    const events = eventsResponse.ok ? await eventsResponse.json() : { data: [] };
    const transfer = (events.data ?? []).find((event: any) => event.event_name === "Transfer" && event.contract_address === USDT_TRON);
    const result = transfer?.result;
    const to = result?.to;
    const rawValue = result?.value;
    const value = typeof rawValue === "string" ? Number(rawValue) : Number(rawValue ?? 0);

    if (to !== MERCHANT || !Number.isFinite(value) || value < REQUIRED_USDT_MICRO) {
      return Response.json({ message: "Payment not matched. Send exactly 5 USDT via TRC20 to the BookFinder wallet." }, { status: 400 });
    }

    return Response.json({ verified: true, message: "Payment verified on TRON. Pro activation is ready for the account/subscription system." });
  } catch {
    return Response.json({ message: "TRON verification is temporarily unavailable. Please try again shortly." }, { status: 502 });
  }
}
