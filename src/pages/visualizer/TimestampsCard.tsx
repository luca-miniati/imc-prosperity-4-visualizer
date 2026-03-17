import { Slider, SliderProps, Text, NumberInput, Group } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { ReactNode, useState } from 'react';
import { AlgorithmDataRow } from '../../models.ts';
import { useStore } from '../../store.ts';
import { formatNumber } from '../../utils/format.ts';
import { TimestampDetail } from './TimestampDetail.tsx';
import { VisualizerCard } from './VisualizerCard.tsx';

export function TimestampsCard(): ReactNode {
  const algorithm = useStore(state => state.algorithm)!;

  const rowsByTimestamp: Record<number, AlgorithmDataRow> = {};
  for (const row of algorithm.data) {
    rowsByTimestamp[row.state.timestamp] = row;
  }

  const timestampMin = algorithm.data[0].state.timestamp;
  const timestampMax = algorithm.data[algorithm.data.length - 1].state.timestamp;
  const timestampStep = algorithm.data[1].state.timestamp - algorithm.data[0].state.timestamp;

  const [timestamp, setTimestamp] = useState(timestampMin);

  const marks: SliderProps['marks'] = [];
  for (let i = timestampMin; i < timestampMax; i += (timestampMax + 100) / 4) {
    marks.push({
      value: i,
      label: formatNumber(i),
    });
  }

  useHotkeys([
    ['ArrowLeft', () => setTimestamp(t => (t === timestampMin ? t : t - timestampStep))],
    ['ArrowRight', () => setTimestamp(t => (t === timestampMax ? t : t + timestampStep))],
  ]);

  return (
    <VisualizerCard title="Timestamps">
      <Group mb="sm">
        <NumberInput
          label="Timestamp"
          value={timestamp}
          min={timestampMin}
          max={timestampMax}
          step={timestampStep}
          clampBehavior="strict"
          onChange={(value) => {
            if (typeof value === 'number') setTimestamp(value);
          }}
        />
      </Group>

      <Slider
        min={timestampMin}
        max={timestampMax}
        step={timestampStep}
        marks={marks}
        label={value => `Timestamp ${formatNumber(value)}`}
        value={timestamp}
        onChange={setTimestamp}
        mb="lg"
      />

      {rowsByTimestamp[timestamp] ? (
        <TimestampDetail row={rowsByTimestamp[timestamp]} />
      ) : (
        <Text>No logs found for timestamp {formatNumber(timestamp)}</Text>
      )}
    </VisualizerCard>
  );
}
