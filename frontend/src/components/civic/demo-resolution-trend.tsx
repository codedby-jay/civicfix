import { Line, LineChart, ResponsiveContainer } from 'recharts'

const demoTrend = [
  { week: '01', resolved: 62 },
  { week: '02', resolved: 70 },
  { week: '03', resolved: 66 },
  { week: '04', resolved: 78 },
  { week: '05', resolved: 74 },
  { week: '06', resolved: 88 },
  { week: '07', resolved: 84 },
  { week: '08', resolved: 93 },
]

export function DemoResolutionTrend() {
  return (
    <div className="mt-10 border-t border-line pt-6" aria-hidden>
      <p className="text-xs text-ink-subtle">Sample resolution trend · demonstration only</p>
      <div className="mt-3 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={demoTrend} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="resolved"
              stroke="#1c4b8f"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
