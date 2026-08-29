import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface SizeGuideProps {
  category?: string
}

export default function SizeGuide({ category = 'agbada' }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sizeCharts: Record<string, any> = {
    agbada: [
      { size: 'XS', chest: '86cm', waist: '71cm', length: '140cm' },
      { size: 'S', chest: '91cm', waist: '76cm', length: '142cm' },
      { size: 'M', chest: '97cm', waist: '81cm', length: '144cm' },
      { size: 'L', chest: '102cm', waist: '86cm', length: '146cm' },
      { size: 'XL', chest: '107cm', waist: '91cm', length: '148cm' },
      { size: 'XXL', chest: '112cm', waist: '96cm', length: '150cm' },
    ],
    kaftan: [
      { size: 'S', bust: '86cm', waist: '71cm', length: '135cm' },
      { size: 'M', bust: '91cm', waist: '76cm', length: '137cm' },
      { size: 'L', bust: '97cm', waist: '81cm', length: '139cm' },
      { size: 'XL', bust: '102cm', waist: '86cm', length: '141cm' },
      { size: 'XXL', bust: '107cm', waist: '91cm', length: '143cm' },
    ],
  }

  const chart = sizeCharts[category] || sizeCharts.agbada

  return (
    <div className="my-6 border rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-veez-gray-50 transition"
      >
        <span className="font-semibold">Size Guide</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-4 border-t bg-veez-gray-50">
          <p className="text-sm text-veez-gray-600 mb-4">
            All measurements are in centimeters. For best fit, measure directly on your body.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {Object.keys(chart[0]).map((key) => (
                    <th key={key} className="text-left py-2 px-3 font-semibold">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.map((row: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-veez-gray-100'}>
                    {Object.values(row).map((value: any, j: number) => (
                      <td key={j} className="py-2 px-3">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
            <p className="font-semibold mb-2">Need Help?</p>
            <p>
              Chat with us on WhatsApp for personalized sizing recommendations based on your
              measurements.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
