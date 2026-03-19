import { Grid, Text, Title, MultiSelect } from '@mantine/core';
import { useState, ReactNode } from 'react';
import { ScrollableCodeHighlight } from '../../components/ScrollableCodeHighlight.tsx';
import { AlgorithmDataRow } from '../../models.ts';
import { useStore } from '../../store.ts';
import { formatNumber } from '../../utils/format.ts';
import { ConversionObservationsTable } from './ConversionObservationsTable.tsx';
import { ListingsTable } from './ListingsTable.tsx';
import { OrderDepthTable } from './OrderDepthTable.tsx';
import { OrderDepthHistogram } from './OrderDepthHistogram.tsx';
import { OrderBookStatsTable } from './OrderBookStatsTable.tsx';
import { OrdersTable } from './OrdersTable.tsx';
import { PlainValueObservationsTable } from './PlainValueObservationsTable.tsx';
import { PositionTable } from './PositionTable.tsx';
import { ProfitLossTable } from './ProfitLossTable.tsx';
import { TradesTable } from './TradesTable.tsx';

function formatTraderData(value: any): string {
  if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value);
}

export interface TimestampDetailProps {
  row: AlgorithmDataRow;
}

export function TimestampDetail({
  row: { state, orders, conversions, traderData, algorithmLogs, sandboxLogs },
}: TimestampDetailProps): ReactNode {
  const algorithm = useStore(state => state.algorithm)!;

  const profitLoss = algorithm.activityLogs
    .filter(row => row.timestamp === state.timestamp)
    .reduce((acc, val) => acc + val.profitLoss, 0);

  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(
      Object.keys(state.orderDepths) // default: show all
      );

  const symbolOptions = Object.keys(state.orderDepths).map(symbol => ({
    value: symbol,
    label: symbol,
  }));

  function filterMapByKeys<T>(
    map: Record<string, T> | undefined,
    keysToKeep: string[]
  ): Record<string, T> {
    if (!map) return {};
    return Object.fromEntries(
      Object.entries(map).filter(([key]) => keysToKeep.includes(key))
    );
  }

  const filteredListings = filterMapByKeys(state.listings, selectedSymbols);
  const filteredPosition = filterMapByKeys(state.position, selectedSymbols);
  const filteredOwnTrades = filterMapByKeys(state.ownTrades, selectedSymbols);
  const filteredMarketTrades = filterMapByKeys(state.marketTrades, selectedSymbols);
  const filteredOrders = filterMapByKeys(orders, selectedSymbols);
  const filteredOrderDepths = filterMapByKeys(state.orderDepths, selectedSymbols);

  return (
    <Grid columns={12}>
      <Grid.Col span={12}>
        {/* prettier-ignore */}
        <Title order={5}>
          Current PnL: {formatNumber(profitLoss)},
          Conversions: {formatNumber(conversions)}
        </Title>
      </Grid.Col>

      {/* Symbol Selector */}
      <Grid.Col span={12}>
        <MultiSelect
          data={symbolOptions}
          value={selectedSymbols}
          onChange={setSelectedSymbols}
          label="Filter order depths by symbol"
          placeholder="Select symbols..."
        />
      </Grid.Col>

      {/* Diagnostic Info */}
      <Grid.Col span={4}>
        <Title order={5}>Listings</Title>
        <ListingsTable listings={filteredListings} />
      </Grid.Col>
      <Grid.Col span={4}>
        <Title order={5}>Positions</Title>
        <PositionTable position={filteredPosition} />
      </Grid.Col>
      <Grid.Col span={4}>
        <Title order={5}>PnL</Title>
        <ProfitLossTable timestamp={state.timestamp} symbols={selectedSymbols} />
      </Grid.Col>


      {/* Order Depth Vis */}

      {/*
      */}
      {Object.entries(state.orderDepths)
        .filter(([symbol]) => selectedSymbols.includes(symbol))
        .map(([symbol, orderDepth], i) => (
          <Grid.Col key={i} span={12}>
            <Title order={5}>{symbol} order depth</Title>
            <Grid columns={12}>

              <Grid.Col span={4}>
                <OrderBookStatsTable orderDepth={orderDepth} />
              </Grid.Col>
              <Grid.Col span={4}>
                <OrderDepthTable orderDepth={orderDepth} />
              </Grid.Col>
              <Grid.Col span={4}>
                <OrderDepthHistogram orderDepth={orderDepth} />
              </Grid.Col>
            </Grid>
          </Grid.Col>
      ))}

      {/* Trade Info */}
      <Grid.Col span={{ xs: 12, sm: 4 }}>
        <Title order={5}>Own trades</Title>
        <TradesTable trades={filteredOwnTrades} />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 4 }}>
        <Title order={5}>Market trades</Title>
        <TradesTable trades={filteredMarketTrades} />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 4 }}>
        <Title order={5}>Orders</Title>
        <OrdersTable orders={filteredOrders} />
      </Grid.Col>

      {/* Logs */}
      <Grid.Col span={{ xs: 12, sm: 4 }}>
        <Title order={5}>Plain value observations</Title>
        <PlainValueObservationsTable plainValueObservations={state.observations.plainValueObservations} />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 8 }}>
        <Title order={5}>Conversion observations</Title>
        <ConversionObservationsTable conversionObservations={state.observations.conversionObservations} />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 6 }}>
        <Title order={5}>Sandbox logs</Title>
        {sandboxLogs ? (
          <ScrollableCodeHighlight code={sandboxLogs} language="markdown" />
        ) : (
          <Text>Timestamp has no sandbox logs</Text>
        )}
      </Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 6 }}>
        <Title order={5}>Algorithm logs</Title>
        {algorithmLogs ? (
          <ScrollableCodeHighlight code={algorithmLogs} language="markdown" />
        ) : (
          <Text>Timestamp has no algorithm logs</Text>
        )}
      </Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 6 }}>
        <Title order={5}>Previous trader data</Title>
        {state.traderData ? (
          <ScrollableCodeHighlight code={formatTraderData(state.traderData)} language="json" />
        ) : (
          <Text>Timestamp has no previous trader data</Text>
        )}
      </Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 6 }}>
        <Title order={5}>Next trader data</Title>
        {traderData ? (
          <ScrollableCodeHighlight code={formatTraderData(traderData)} language="json" />
        ) : (
          <Text>Timestamp has no next trader data</Text>
        )}
      </Grid.Col>
    </Grid>
  );
}
