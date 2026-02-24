export function toMoney(value: number | bigint) {
  const amount = typeof value === "bigint" ? Number(value) : value;
  return `₦${amount.toLocaleString("en-US")}`;
}

export function toPercent(raised: number, target: number) {
  if (!target) return 0;
  return Math.round((raised / target) * 100);
}

export function shortAddress(address: string) {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(isoOrSeconds: string | number) {
  const date =
    typeof isoOrSeconds === "number"
      ? new Date(isoOrSeconds * 1000)
      : new Date(isoOrSeconds);

  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

