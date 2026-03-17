import { Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { OrderDepth } from '../../models.ts';

interface OrderDepthHistogramProps {
  orderDepth: OrderDepth;
}

export function OrderDepthHistogram({ orderDepth }: OrderDepthHistogramProps) {
  const buyData = Object.entries(orderDepth.buyOrders || {}).map(([price, volume]) => ({
    price,
    buyVolume: volume,
  }));

  const sellData = Object.entries(orderDepth.sellOrders || {}).map(([price, volume]) => ({
    price,
    sellVolume: Math.abs(volume),
  }));

  // Merge buy and sell into a single array of unique price points
  const allPrices = Array.from(
    new Set([...buyData.map(d => d.price), ...sellData.map(d => d.price)])
  );

  const data = [
    ...Object.entries(orderDepth.buyOrders || {}).map(([price, volume]) => ({
      price,
      volume,
      type: 'buy',
    })),
    ...Object.entries(orderDepth.sellOrders || {}).map(([price, volume]) => ({
      price,
      volume: Math.abs(volume),
      type: 'sell',
    })),
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="price" />
        <YAxis />
        <Tooltip formatter={(value: number) => value} />
        <Bar dataKey="volume" name="Orders">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.type === 'buy' ? '#27AE60' : '#C0392B'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
