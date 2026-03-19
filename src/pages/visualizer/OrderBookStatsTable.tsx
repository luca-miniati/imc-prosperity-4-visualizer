import { Table } from '@mantine/core';
import { ReactNode } from 'react';
import { getAskColor, getBidColor } from '../../utils/colors.ts';
import { formatNumber } from '../../utils/format.ts';
import { SimpleTable } from './SimpleTable.tsx';

function computeOBStats(orderDepth: OrderDepth) {
  const bids = Object.entries(orderDepth.buyOrders).map(([p, v]) => [Number(p), v]);
  const asks = Object.entries(orderDepth.sellOrders).map(([p, v]) => [Number(p), v]);

  if (bids.length === 0 || asks.length === 0) {
    return null;
  }

  const bestBid = Math.max(...bids.map(([p]) => p));
  const bestAsk = Math.min(...asks.map(([p]) => p));

  const midPrice = (bestBid + bestAsk) / 2;
  const spread = bestAsk - bestBid;

  const totalBidVolume = bids.reduce((acc, [, v]) => acc + v, 0);
  const totalAskVolume = Math.abs(asks.reduce((acc, [, v]) => acc + v, 0));

  const imbalance =
    (totalBidVolume - totalAskVolume) /
    (totalBidVolume + totalAskVolume);

  return {
    bestBid,
    bestAsk,
    midPrice,
    spread,
    totalBidVolume,
    totalAskVolume,
    imbalance,
  };
}

export function OrderBookStatsTable({ orderDepth }: { orderDepth: OrderDepth }) {
  const stats = computeOBStats(orderDepth);

    if (!stats) {
    return <SimpleTable label="ob stats" columns={['Metric', 'Value']} rows={[]} />;
  }

  const rows: ReactNode[] = [];

  // Neutral rows
  const addRow = (label: string, value: number | string) => {
    rows.push(
      <Table.Tr key={label}>
        <Table.Td>{label}</Table.Td>
        <Table.Td>{typeof value === 'number' ? formatNumber(value) : value}</Table.Td>
      </Table.Tr>,
    );
  };

  addRow('Best Bid', stats.bestBid);
  addRow('Best Ask', stats.bestAsk);
  addRow('Mid Price', stats.midPrice);
  addRow('Spread', stats.spread);

  // Volume rows with color
  rows.push(
    <Table.Tr key="bid-vol" style={{ background: getBidColor(0.1) }}>
      <Table.Td>Bid Volume</Table.Td>
      <Table.Td>{formatNumber(stats.totalBidVolume)}</Table.Td>
    </Table.Tr>,
  );

  rows.push(
    <Table.Tr key="ask-vol" style={{ background: getAskColor(0.1) }}>
      <Table.Td>Ask Volume</Table.Td>
      <Table.Td>{formatNumber(stats.totalAskVolume)}</Table.Td>
    </Table.Tr>,
  );

  // Imbalance row with directional color
  const imbalanceColor =
    stats.imbalance > 0 ? getBidColor : stats.imbalance < 0 ? getAskColor : undefined;

  rows.push(
    <Table.Tr
      key="imbalance"
      style={imbalanceColor ? { background: imbalanceColor(0.15) } : undefined}
    >
      <Table.Td>Imbalance</Table.Td>
      <Table.Td>{stats.imbalance.toFixed(3)}</Table.Td>
    </Table.Tr>,
  );

  return (
    <SimpleTable
      label="ob stats"
      columns={['Metric', 'Value']}
      rows={rows}
    />
  );
}
