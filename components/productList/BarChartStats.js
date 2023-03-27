// components/BarChartStats.js
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const labelFormatter = (value) => {
    switch (value) {
        case 'head':
            return '헤드';
        case 'groove':
            return '그루브';
        case 'hole':
            return '나사';
        default:
            return value;
    }
};

export default function BarChartStats({ data }) {
    return (
        <BarChart width={1400} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value, name) => [value, labelFormatter(name)]} />
            <Legend formatter={labelFormatter} />
            <Bar dataKey="head" fill="#8884d8" />
            <Bar dataKey="groove" fill="#82ca9d" />
            <Bar dataKey="hole" fill="#ffc658" />
        </BarChart>
    );
}
