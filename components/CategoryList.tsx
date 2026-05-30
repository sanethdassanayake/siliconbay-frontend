import React from 'react'
import Link from 'next/link'

import { Categories } from '@/constants/DummyData'

const CategoryList = () => {
  return (
    <div className="flex py-4 gap-6 px-8 overflow-x-auto no-scrollbar border-b-8 border-amber-300">
      {Categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.id}`} className="hover:underline whitespace-nowrap font-semibold">
          {category.name}
        </Link>
      ))}
    </div>
  )
}

export default CategoryList