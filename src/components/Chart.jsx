// Chart.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Chart({ data }) {
  const COLORS = ['#0ea5e9', '#fbbf24', '#d946ef', '#f43f5e', '#22d3ee'];
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 4} startAngle={startAngle} endAngle={endAngle} fill={fill} />;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const bgColor = entry.payload?.fill || '#1f2937';
      const total = data.reduce((sum, d) => sum + d.votes, 0);
      const percent = ((entry.value / total) * 100).toFixed(0);

      return (
        <div
          className="p-2 rounded-md text-white text-sm"
          style={{
            backgroundColor: bgColor,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            borderRadius: '8px',
          }}
        >
          <div className="font-semibold">{entry.name}</div>
          <div>{percent}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className="text-center text-xl font-semibold text-white mb-4">Live Voting Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart className="outline-none ring-0 focus:outline-none focus:ring-0">
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            dataKey="votes"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            labelLine={false}
            label={false}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} payload={{ ...entry, fill: COLORS[index % COLORS.length] }} className="outline-none ring-0 focus:outline-none focus:ring-0" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
