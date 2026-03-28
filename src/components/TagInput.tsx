'use client'

import { useState } from 'react'

export default function TagInput({ defaultValue = '' }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue)
  const tags = value.split(',').map(t => t.trim()).filter(Boolean)

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="javascript, react, hooks"
        className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
      />
      <input type="hidden" name="tags" value={value} />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
