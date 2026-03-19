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

  const timestampMinDefault = algorithm.data[0].state.timestamp;
  const timestampMaxDefault = algorithm.data[algorithm.data.length - 1].state.timestamp;
  const timestampStep = algorithm.data[1].state.timestamp - algorithm.data[0].state.timestamp;

  const [timestamp, setTimestamp] = useState(timestampMinDefault);

  const [minTimestamp, setMinTimestamp] = useState(timestampMinDefault);
  const [maxTimestamp, setMaxTimestamp] = useState(timestampMaxDefault);

  const clamp = (value: number) =>
    Math.min(Math.max(value, minTimestamp), maxTimestamp);

  const marks: SliderProps['marks'] = [];
  const range = maxTimestamp - minTimestamp;
  const stepSize = range / 4;

  for (let i = minTimestamp; i <= maxTimestamp; i += stepSize) {
    marks.push({
      value: i,
      label: formatNumber(i),
    });
  }

  useHotkeys([
    ['ArrowLeft', () =>
      setTimestamp(t => clamp(t - timestampStep))
    ],
    ['ArrowRight', () =>
      setTimestamp(t => clamp(t + timestampStep))
    ],
  ]);

  return (
    <VisualizerCard title="Timestamps">
      <Group mb="sm">
        <NumberInput
          label="Min"
          value={minTimestamp}
          min={timestampMinDefault}
          max={maxTimestamp}
          step={timestampStep}
          onChange={(value) => {
            if (typeof value === 'number') {
              setMinTimestamp(value);
              setTimestamp(t => Math.max(t, value));
            }
          }}
        />

        <NumberInput
          label="Max"
          value={maxTimestamp}
          min={minTimestamp}
          max={timestampMaxDefault}
          step={timestampStep}
          onChange={(value) => {
            if (typeof value === 'number') {
              setMaxTimestamp(value);
              setTimestamp(t => Math.min(t, value));
            }
          }}
        />
      </Group>

      <Group mb="sm">
        <NumberInput
          label="Timestamp"
          value={timestamp}
          min={minTimestamp}
          max={maxTimestamp}
          step={timestampStep}
          clampBehavior="strict"
          onChange={(value) => {
            if (typeof value === 'number') setTimestamp(clamp(value));
          }}
        />
      </Group>

      <Slider
        min={minTimestamp}
        max={maxTimestamp}
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
